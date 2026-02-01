import React, { useEffect, useState } from "react";
import { Search, MoreHorizontal } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getAllUsers, getCurrentUser } from "../api/user";
import { createOrGetConversation } from "../api/chat"; // NEW import

interface UserType {
  _id: string;
  firstName?: string;
  lastName?: string;
  username: string;
  avatarImage?: string;
  status?: string; // optional for online/offline
}

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [contacts, setContacts] = useState<UserType[]>([]);
  const [loadingConversation, setLoadingConversation] = useState<string | null>(null); // NEW state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const me = await getCurrentUser();
        setCurrentUser(me);

        const users = await getAllUsers();
        const usersWithStatus = users.map((u: UserType) => ({ ...u, status: "Online" }));
        setContacts(usersWithStatus);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchData();
  }, []);

  // NEW FUNCTION: handle user click
  const handleUserClick = async (userId: string) => {
    try {
      setLoadingConversation(userId);
      const conversation = await createOrGetConversation(userId);
      navigate(`/message/${conversation._id}`);
    } catch (err) {
      console.error("Failed to create/get conversation:", err);
    } finally {
      setLoadingConversation(null);
    }
  };

  return (
    <aside className="w-full h-full flex flex-col bg-[#1E293B]/20 backdrop-blur-xl">
      {/* Top Profile Section */}
      {currentUser && (
        <div className="p-4 md:p-6">
          <Link 
            to="/settings" 
            className="flex items-center gap-4 p-3 rounded-2xl transition-all hover:bg-white/5 active:bg-white/10 group bg-white/5 md:bg-transparent"
          >
            <div className="relative">
              <img 
                src={currentUser.avatarImage || `https://i.pravatar.cc/150?u=${currentUser._id}`} 
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-blue-500 shadow-lg shadow-blue-500/20" 
                alt={currentUser.username} 
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0F172A] rounded-full" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-white text-sm">{currentUser.username}</h4>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Settings</p>
            </div>
            <MoreHorizontal className="w-4 h-4 text-slate-500" />
          </Link>
        </div>
      )}

      {/* Search Contacts */}
      <div className="px-4 md:px-6 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input 
            placeholder="Search contacts..." 
            className="w-full bg-slate-900/60 border border-slate-700/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto px-2 md:px-4 pb-20 md:pb-4 space-y-1">
        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-3 mb-3">Recent Messages</p>
        {contacts.map((user) => (
          <div
            key={user._id}
            onClick={() => handleUserClick(user._id)}
            className={`flex items-center gap-4 p-4 md:p-3 rounded-2xl cursor-pointer transition-all hover:bg-white/5 active:bg-blue-600/10 group ${
              loadingConversation === user._id ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <div className="relative">
              <img 
                src={user.avatarImage || `https://i.pravatar.cc/150?u=${user._id}`} 
                className="w-12 h-12 md:w-10 md:h-10 rounded-full" 
                alt={user.username} 
              />
              {user.status === "Online" && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0F172A] rounded-full md:hidden" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h4 className="text-sm font-semibold text-slate-200 group-hover:text-white truncate">{user.username}</h4>
                <span className="text-[10px] text-slate-500">12:45</span>
              </div>
              <p className="text-xs text-slate-500 truncate mt-0.5">Tap to open conversation</p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
