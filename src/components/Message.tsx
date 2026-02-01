import React, { useEffect, useState, useRef } from "react";
import { ChevronLeft, MoreVertical, Phone, Video, Send } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getMessages, sendMessage as apiSendMessage, getConversationDetails } from "../api/chat";
import io from "socket.io-client";

const SOCKET_URL = "https://chatapp-serverside.onrender.com"; // Render backend URL
const socket = io(SOCKET_URL, { autoConnect: false });


interface MessageType {
  _id: string;
  senderId: string;
  text?: string;
  imageUrl?: string;
  createdAt: string;
  conversationId: string;
}

interface UserType {
  _id: string;
  username: string;
  avatar?: string;
}

const Message: React.FC = () => {
  const navigate = useNavigate();
  const { conversationId } = useParams<{ conversationId: string }>();

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [receiver, setReceiver] = useState<UserType | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // GET CURRENT USER
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setCurrentUserId(storedUserId);
  }, []);

  // LOAD CONVERSATION DETAILS AND MESSAGES
  useEffect(() => {
    const init = async () => {
      if (!conversationId) return;

      try {
        // get receiver details
        const convoDetails = await getConversationDetails(conversationId);
        setReceiver(convoDetails.receiver);

        // get messages
        const msgs = await getMessages(conversationId);
        setMessages(msgs);

        // join socket room
        socket.emit("joinConversation", conversationId);

        setLoading(false);
      } catch (err) {
        console.error("Failed to load conversation:", err);
        setLoading(false);
      }
    };

    init();
  }, [conversationId]);

  // SOCKET LISTENER
  useEffect(() => {
    if (!conversationId || !currentUserId) return;

    const handleNewMessage = (msg: MessageType) => {
      // Only add message if it's from another user
      if (msg.conversationId === conversationId && msg.senderId !== currentUserId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [conversationId, currentUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // SEND MESSAGE
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversationId || !currentUserId) return;

    try {
      const sentMsg = await apiSendMessage({
        conversationId,
        text: newMessage,
      });

      // add locally first
      setMessages((prev) => [...prev, sentMsg]);
      setNewMessage("");

      // emit to socket
      socket.emit("sendMessage", sentMsg);
      scrollToBottom();
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-[#0F172A]">
      {/* HEADER */}
      <header className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/homepage")}>
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          {receiver && (
            <>
              <img
                src={receiver.avatar || undefined}
                alt={receiver.username || "User"}
                className="w-10 h-10 rounded-full border border-blue-500/50"
              />
              <div>
                <h3 className="text-white font-semibold text-sm">{receiver.username}</h3>
                <p className="text-green-500 text-xs uppercase tracking-wider">Online</p>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 text-slate-400">
          <Phone />
          <Video />
          <MoreVertical />
        </div>
      </header>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => {
          const isMine = msg.senderId === currentUserId;
          const sender = isMine
            ? { username: "You", avatar: undefined }
            : receiver;

          return (
            <div
              key={msg._id}
              className={`flex max-w-[80%] ${isMine ? "ml-auto justify-end" : "mr-auto"} items-end gap-2`}
            >
              {!isMine && (
                <img
                  src={sender?.avatar || undefined}
                  alt={sender?.username || "User"}
                  className="w-6 h-6 rounded-full"
                />
              )}
              <div
                className={`p-3 rounded-xl text-sm ${
                  isMine ? "bg-blue-600 text-white rounded-tr-none" : "bg-white/10 text-slate-200 rounded-tl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <footer className="p-4 bg-[#0F172A]">
        <div className="flex items-center gap-2 bg-white/5 rounded-xl p-2">
          <input
            className="flex-1 bg-transparent outline-none text-white px-2"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 p-2 rounded-lg"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Message;
