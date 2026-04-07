"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

// --- REUSABLE CORNER WHEAT GRAPHIC ---
const CornerWheat = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 200" className={className} preserveAspectRatio="xMidYMid meet">
    <g fill="currentColor">
      <rect x="48" y="20" width="4" height="180" rx="2" />
      <path d="M45 40 C 25 50, 20 80, 45 90 C 50 80, 50 50, 45 40 Z" />
      <path d="M45 80 C 25 90, 20 120, 45 130 C 50 120, 50 90, 45 80 Z" />
      <path d="M45 120 C 25 130, 20 160, 45 170 C 50 160, 50 130, 45 120 Z" />
      <path d="M55 20 C 75 30, 80 60, 55 70 C 50 60, 50 30, 55 20 Z" />
      <path d="M55 60 C 75 70, 80 100, 55 110 C 50 100, 50 70, 55 60 Z" />
      <path d="M55 100 C 75 110, 80 140, 55 150 C 50 140, 50 110, 55 100 Z" />
      <path d="M55 140 C 75 150, 80 180, 55 190 C 50 180, 50 150, 55 140 Z" />
    </g>
  </svg>
);

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Trigger entrance animations after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Using deployed backend URL
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password })
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setSuccessMessage(`Login successful! Redirecting softly...`);

        setTimeout(() => {
          if (data.user.role === "buyer") {
            router.push("/buyer-dashboard");
          } else {
            router.push("/farmer-dashboard");
          }
        }, 1500);
      }
    } catch (err) {
      setError("Network error. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen bg-[#FDF8EE] flex flex-col items-center pt-[120px] pb-12 p-4 relative overflow-y-auto overflow-x-hidden selection:bg-[#FBC02D] selection:text-[#0A2F1D]"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      <Navbar />
      {/* GLOBAL ANIMATIONS & FONTS */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700;9..144,900&family=Manrope:wght@500;700;800&display=swap');

        @keyframes rolling-shine {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }

        .heading-serif { font-family: 'Fraunces', serif; }

        .intelligence-effect {
          font-family: 'Fraunces', serif;
          background: linear-gradient(
            to right, 
            #0A2F1D 20%, 
            #10893E 35%, 
            #FBC02D 50%, 
            #10893E 65%, 
            #0A2F1D 80%
          );
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: rolling-shine 5s linear infinite;
        }
      `}} />

      {/* --- BACKGROUND EFFECTS --- */}
      {/* Abstract Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#10893E] rounded-full mix-blend-multiply filter blur-[100px] opacity-10 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#FBC02D] rounded-full mix-blend-multiply filter blur-[120px] opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* --- NORMALIZED FADED LOGO WATERMARK --- */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] w-[350px] h-[350px] md:w-[500px] md:h-[500px] opacity-[0.10] pointer-events-none z-0 flex items-center justify-center mix-blend-darken">
        <img src="/logo.png" alt="" className="w-full h-full object-contain filter grayscale-[20%]" />
      </div>

      {/* Corner Wheat Graphics */}
      <CornerWheat className="absolute bottom-10 left-4 md:left-12 w-24 h-48 md:w-32 md:h-64 text-[#D4C392] opacity-30 pointer-events-none z-0" />
      <CornerWheat className="absolute bottom-10 right-4 md:right-12 w-24 h-48 md:w-32 md:h-64 text-[#D4C392] opacity-30 pointer-events-none z-0 transform scale-x-[-1]" />

      {/* --- ENLARGED LOGIN CARD CONTAINER --- */}
      <div
        className={`w-full max-w-lg relative z-10 transition-all duration-1000 ease-out transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
      >
        {/* Logo / Back to Home Link */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block group">
            {/* Reduced Title Size */}
            <h1 className="heading-serif intelligence-effect text-5xl md:text-6xl font-black tracking-tighter drop-shadow-sm pb-1 pr-2">
              KrishiSetu
            </h1>
          </Link>
          {/* Reduced Subtitle Size */}
          <h2 className="heading-serif text-3xl font-black text-[#0A2F1D] md:mt-2 mt-4">Welcome Back</h2>
          <p className="text-base text-[#2D503C] font-medium mt-1">Sign in to access your intelligence dashboard.</p>
        </div>

        {/* Evaluator Access (Hackathon Purpose) */}
        <div className="mb-6 bg-white/60 backdrop-blur-md rounded-[1.5rem] border border-[#E2DFD3] p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-sm">
          <span className="text-xs font-black uppercase tracking-widest text-[#627768]">Evaluator Access</span>
          <div className="flex gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={() => { setPhone("9758503545"); setPassword("12345678"); }}
              className="flex-1 md:flex-none px-4 py-2 bg-[#E9F3E8] border border-[#10893E]/30 text-[#10893E] text-xs font-bold rounded-xl hover:bg-[#10893E] hover:text-white transition-colors"
            >
              🌾 Farmer Test
            </button>
            <button
              type="button"
              onClick={() => { setPhone("7307362841"); setPassword("12345678"); }}
              className="flex-1 md:flex-none px-4 py-2 bg-[#FFF9E6] border border-[#FBC02D]/40 text-[#D49800] text-xs font-bold rounded-xl hover:bg-[#FBC02D] hover:text-[#0A2F1D] transition-colors"
            >
              🤝 Buyer Test
            </button>
          </div>
        </div>

        {/* 3D Frosted Glass Form Card */}
        <form onSubmit={handleLogin} className="bg-white/80 backdrop-blur-xl p-10 rounded-[2rem] border border-[#E2DFD3] shadow-[0_20px_40px_rgba(10,47,29,0.08)] hover:shadow-[0_30px_60px_rgba(10,47,29,0.12)] transition-shadow duration-500">

          {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-bold shadow-sm">{error}</div>}
          {successMessage && <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-bold shadow-sm">{successMessage}</div>}

          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-bold text-[#0A2F1D] mb-2 pl-1">Mobile Number or Email</label>
            <input
              id="email"
              type="text"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-5 py-4 bg-[#FDF8EE] rounded-xl border border-[#E2DFD3] text-[#0A2F1D] text-lg font-medium placeholder-[#8A9A90] focus:outline-none focus:ring-2 focus:ring-[#10893E] focus:border-transparent transition-all shadow-inner"
              required
            />
          </div>

          <div className="mb-10">
            <div className="flex justify-between items-center mb-2 pl-1 pr-1">
              <label htmlFor="password" className="block text-sm font-bold text-[#0A2F1D]">Password</label>
              <a href="#" className="text-sm font-bold text-[#10893E] hover:text-[#FBC02D] transition-colors">Forgot password?</a>
            </div>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-[#FDF8EE] rounded-xl border border-[#E2DFD3] text-[#0A2F1D] text-lg font-medium placeholder-[#8A9A90] focus:outline-none focus:ring-2 focus:ring-[#10893E] focus:border-transparent transition-all shadow-inner"
              required
            />
          </div>

          {/* 3D Floating Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full group relative overflow-hidden px-10 py-5 bg-gradient-to-b from-[#14A049] to-[#10893E] text-white text-xl font-bold rounded-2xl shadow-[0_8px_0_0_#0D7334,0_15px_20px_rgba(16,137,62,0.4)] hover:shadow-[0_4px_0_0_#0D7334,0_20px_40px_rgba(16,137,62,0.6)] transform hover:-translate-y-1 hover:scale-[1.02] active:translate-y-[4px] active:shadow-[0_0px_0_0_#0D7334,0_10px_10px_rgba(16,137,62,0.4)] transition-all duration-300 mb-6 disabled:opacity-50"
          >
            {/* The Glass Shine Sweep */}
            <span className="absolute inset-0 w-full h-full -translate-x-[150%] skew-x-[-25deg] bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-[150%] transition-transform duration-1000 ease-out z-0"></span>

            <span className="relative z-10 flex items-center justify-center">
              Secure Login
              <span className="ml-2 inline-block transform group-hover:translate-x-1.5 transition-transform duration-300">🔐</span>
            </span>
          </button>

          <p className="text-center font-medium text-[#2D503C]">
            New to KrishiSetu?{' '}
            <Link href="/register" className="text-[#10893E] font-black hover:text-[#FBC02D] hover:underline transition-colors decoration-2 underline-offset-4">
              Create an account
            </Link>
          </p>
        </form>
      </div>

    </main>
  );
}