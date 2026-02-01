import React, { useState } from "react";
import {  AtSign, Lock, ArrowRight } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api";

const Register: React.FC = () => {
  const navigate = useNavigate();

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post("/auth/register", {
        firstName,
        lastName,
        username, 
        password,
        avatarImage: "", 
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId",res.data.userId)

      console.log(res.data);
      navigate("/homepage"); // go to homepage after registration
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
      console.error("Register error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#0F172A] flex items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px]" />

      <div className="w-full max-w-[400px] relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-500/20">
            <span className="text-3xl font-black text-white italic">A</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create Account</h1>
          <p className="text-slate-500 text-sm mt-1">Join the AuraChat community today.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Name Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">First Name</label>
              <input
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 focus-within:border-blue-500 text-white text-sm w-full"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Last Name</label>
              <input
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 focus-within:border-blue-500 text-white text-sm w-full"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          {/* Username */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Username</label>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 focus-within:border-blue-500">
              <AtSign className="w-4 h-4 text-slate-500" />
              <input
                className="bg-transparent border-none outline-none text-white text-sm w-full"
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Password</label>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 focus-within:border-blue-500">
              <Lock className="w-4 h-4 text-slate-500" />
              <input
                type="password"
                className="bg-transparent border-none outline-none text-white text-sm w-full"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl mt-2 flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
          >
            {loading ? "Signing Up..." : "Sign Up"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/" className="text-blue-500 font-bold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
