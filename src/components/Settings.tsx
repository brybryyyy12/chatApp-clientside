import React, { useState, useEffect } from "react";
import { ChevronLeft, User, AtSign, LogOut, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, updateUserProfile } from "../api/user";

const SettingsView: React.FC = () => {
  const navigate = useNavigate();

  // --- State ---
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("https://i.pravatar.cc/150?u=me");
  const [loading, setLoading] = useState(false);

  // --- Fetch current user ---
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        // Split name if you store full name
        const [first = "", last = ""] = user.name?.split(" ") || ["", ""];
        setFirstName(first);
        setLastName(last);
        setUsername(user.username || "");
        if (user.avatarImage) setAvatar(user.avatarImage);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  // --- Handlers ---
  const handleSave = async () => {
    setLoading(true);
    try {
      await updateUserProfile({ username, firstName, lastName, avatarImage: avatar });
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleAvatarChange = () => {
    // Example: random avatar, replace with file upload logic
    setAvatar(`https://i.pravatar.cc/150?u=${Math.random()}`);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#0F172A] overflow-hidden text-slate-200">
      {/* Top Nav */}
      <header className="flex items-center p-4 md:p-6 border-b border-white/5 bg-[#0F172A]">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-white/5 rounded-full transition-colors mr-2"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-white">Edit Profile</h1>
      </header>

      {/* Center Form */}
      <div className="flex-1 overflow-y-auto p-6 flex justify-center items-center">
        <div className="w-full max-w-md space-y-6">

          {/* Avatar */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 rounded-full border-2 border-blue-500 p-1 mb-2">
              <img src={avatar} className="w-full h-full rounded-full" alt="Profile" />
            </div>
            <button 
              className="text-xs text-blue-400 font-bold uppercase tracking-widest hover:text-white transition-colors"
              onClick={handleAvatarChange}
            >
              Change Photo
            </button>
          </div>

          {/* Inputs */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">First Name</label>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-xl focus-within:border-blue-500 transition-all">
                <User className="w-4 h-4 text-slate-500" />
                <input 
                  className="bg-transparent border-none outline-none text-white w-full text-sm" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Last Name</label>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-xl focus-within:border-blue-500 transition-all">
                <User className="w-4 h-4 text-slate-500" />
                <input 
                  className="bg-transparent border-none outline-none text-white w-full text-sm" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Username</label>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-xl focus-within:border-blue-500 transition-all">
                <AtSign className="w-4 h-4 text-slate-500" />
                <input 
                  className="bg-transparent border-none outline-none text-white w-full text-sm" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <footer className="p-4 md:p-6 border-t border-white/5 bg-[#0F172A] flex items-center justify-between gap-4">
        <button 
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-red-500 hover:bg-red-500/10 transition-all text-sm"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>

        <button 
          className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 text-sm"
          onClick={handleSave}
          disabled={loading}
        >
          <Save className="w-4 h-4" />
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </footer>
    </div>
  );
};

export default SettingsView;
