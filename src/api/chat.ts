// src/api/chat.ts
import { api } from "../api";

export interface MessageType {
  _id: string;
  senderId: string;
  conversationId: string;
  text?: string;
  imageUrl?: string;
  createdAt: string;
}

export interface ConversationType {
  _id: string;
  members: string[];
  lastMessage: string;
  createdAt: string;
  updatedAt: string;
}

// Get or create a conversation
export const createOrGetConversation = async (receiverId: string): Promise<ConversationType> => {
  const token = localStorage.getItem("token");
  const res = await api.post(
    "/chat/create",
    { receiverId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

// Send a message
export const sendMessage = async ({
  conversationId,
  text,
  imageUrl,
}: {
  conversationId: string;
  text?: string;
  imageUrl?: string;
}): Promise<MessageType> => {
  const token = localStorage.getItem("token");
  const res = await api.post(
    "/chat/send",
    { conversationId, text, imageUrl },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

// Get all messages in a conversation
export const getMessages = async (conversationId: string): Promise<MessageType[]> => {
  const token = localStorage.getItem("token");
  const res = await api.get(`/chat/${conversationId}/messages`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getConversationDetails = async (conversationId: string) => {
  const res = await api.get(`/chat/conversation/${conversationId}`);
  return res.data;
};
