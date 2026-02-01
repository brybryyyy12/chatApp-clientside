import React, { useState } from "react";
import { Mail, Lock, Chrome, Apple } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { socket } from "../socket";

const Login: React.FC = () => {
  const navigate = useNavigate();

  // Form state
  const [username, setUsername] = useState(""); // your backend uses username, not email
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { username, password });

      // Save token in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      //connect socket
      socket.auth = {token:res.data.token};
      socket.connect();

      console.log("Login successful:", res.data);
      navigate("/homepage"); // redirect to homepage
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#0F172A] text-white">
      {/* Left Side: Branding (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-br from-blue-900/20 to-transparent border-r border-white/5">
        <div className="text-center">
          <div className="w-24 h-24 bg-blue-600 rounded-3xl rotate-12 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/40">
            <span className="text-5xl font-bold -rotate-12 text-white">A</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">AuraChat</h1>
          <p className="text-slate-400 mt-2">Connect beyond boundaries.</p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 bg-slate-800/30 p-10 rounded-3xl border border-white/10 backdrop-blur-xl">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold">Welcome Back</h2>
            <p className="text-slate-400 mt-2">Enter your details to login.</p>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Username"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20"
            >
              {loading ? "Logging in..." : "Sign In"}
            </button>
          </form>
          <div className="text-center mt-4 text-sm text-slate-400">
            Don't have an account?{" "}
            <button
              className="text-blue-500 font-semibold hover:underline"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </button>
          </div>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#161f35] px-2 text-slate-500">Or continue with</span>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 py-2.5 rounded-xl border border-white/5 transition-all">
              <Chrome className="w-5 h-5" /> Google
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 py-2.5 rounded-xl border border-white/5 transition-all">
              <Apple className="w-5 h-5" /> Apple
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
