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

export default function RegisterPage() {
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState<'farmer' | 'buyer'>('farmer');

  // --- NEW STATE FOR PASSWORD VISIBILITY ---
  const [showPassword, setShowPassword] = useState(false);

  // --- REGISTRATION STATE ---
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Trigger entrance animations after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://krishisetu-hhef.onrender.com/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, password, role })
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setSuccessMessage("Registration successful! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
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
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#10893E] rounded-full mix-blend-multiply filter blur-[100px] opacity-10 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#FBC02D] rounded-full mix-blend-multiply filter blur-[120px] opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* NORMALIZED FADED LOGO WATERMARK */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] w-[350px] h-[350px] md:w-[500px] md:h-[500px] opacity-[0.10] pointer-events-none z-0 flex items-center justify-center mix-blend-darken">
        <img src="/logo.png" alt="" className="w-full h-full object-contain filter grayscale-[20%]" />
      </div>

      <CornerWheat className="absolute bottom-10 left-4 md:left-12 w-24 h-48 md:w-32 md:h-64 text-[#D4C392] opacity-30 pointer-events-none z-0" />
      <CornerWheat className="absolute bottom-10 right-4 md:right-12 w-24 h-48 md:w-32 md:h-64 text-[#D4C392] opacity-30 pointer-events-none z-0 transform scale-x-[-1]" />

      {/* --- REGISTRATION CARD CONTAINER --- */}
      <div
        className={`w-full max-w-lg relative z-10 transition-all duration-1000 ease-out transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
      >
        {/* Logo / Back to Home Link */}
        <div className="text-center mb-4 mt-6">
          <Link href="/" className="inline-block group">
            <h1 className="heading-serif intelligence-effect text-5xl md:text-6xl font-black tracking-tighter drop-shadow-sm pb-1 pr-2">
              KrishiSetu
            </h1>
          </Link>
          <h2 className="heading-serif text-2xl font-black text-[#0A2F1D] mt-3">Join the Network</h2>
          <p className="text-base text-[#2D503C] font-medium mt-1">Create your account to access market intelligence.</p>
        </div>

        {/* 3D Frosted Glass Form Card */}
        <form onSubmit={handleRegister} className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] border border-[#E2DFD3] shadow-[0_20px_40px_rgba(10,47,29,0.08)] hover:shadow-[0_30px_60px_rgba(10,47,29,0.12)] transition-shadow duration-500 mb-8">

          {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-bold shadow-sm">{error}</div>}
          {successMessage && <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-bold shadow-sm">{successMessage}</div>}

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-[#0A2F1D] mb-3 pl-1">I want to...</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('farmer')}
                className={`py-3 px-4 rounded-xl border-2 font-bold transition-all duration-200 flex items-center justify-center ${role === 'farmer'
                  ? 'border-[#10893E] bg-[#E9F3E8] text-[#10893E] shadow-sm border-b-[4px]'
                  : 'border-[#E2DFD3] bg-[#FDF8EE] text-[#627768] hover:border-[#BDE0B8] hover:-translate-y-[2px] border-b-[4px]'
                  }`}
              >
                <span className="mr-2 text-xl">🌾</span> Sell Crops
              </button>
              <button
                type="button"
                onClick={() => setRole('buyer')}
                className={`py-3 px-4 rounded-xl border-2 font-bold transition-all duration-200 flex items-center justify-center ${role === 'buyer'
                  ? 'border-[#FBC02D] bg-[#FFF9E6] text-[#D49800] shadow-sm border-b-[4px]'
                  : 'border-[#E2DFD3] bg-[#FDF8EE] text-[#627768] hover:border-[#FDE08B] hover:-translate-y-[2px] border-b-[4px]'
                  }`}
              >
                <span className="mr-2 text-xl">🤝</span> Buy Crops
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-bold text-[#0A2F1D] mb-2 pl-1">Full Name</label>
            <input
              id="name"
              type="text"
              placeholder="e.g. Harleen Kaur Gill"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-5 py-4 bg-[#FDF8EE] rounded-xl border border-[#E2DFD3] text-[#0A2F1D] text-lg font-medium placeholder-[#8A9A90] focus:outline-none focus:ring-2 focus:ring-[#10893E] focus:border-transparent transition-all shadow-inner"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="phone" className="block text-sm font-bold text-[#0A2F1D] mb-2 pl-1">Mobile Number</label>
            <input
              id="phone"
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-5 py-4 bg-[#FDF8EE] rounded-xl border border-[#E2DFD3] text-[#0A2F1D] text-lg font-medium placeholder-[#8A9A90] focus:outline-none focus:ring-2 focus:ring-[#10893E] focus:border-transparent transition-all shadow-inner"
              required
            />
          </div>

          <div className="mb-10">
            <label htmlFor="password" className="block text-sm font-bold text-[#0A2F1D] mb-2 pl-1">Create Password</label>
            {/* WRAPPED INPUT WITH RELATIVE CONTAINER FOR THE BUTTON */}
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"} // Dynamic type based on state
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 pr-14 bg-[#FDF8EE] rounded-xl border border-[#E2DFD3] text-[#0A2F1D] text-lg font-medium placeholder-[#8A9A90] focus:outline-none focus:ring-2 focus:ring-[#10893E] focus:border-transparent transition-all shadow-inner"
                required
              />
              {/* EYE TOGGLE BUTTON */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A9A90] hover:text-[#10893E] transition-colors focus:outline-none p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
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
              Create Account
            </span>
          </button>

          <p className="text-center font-medium text-[#2D503C]">
            Already have an account?{' '}
            <Link href="/login" className="text-[#10893E] font-black hover:text-[#FBC02D] hover:underline transition-colors decoration-2 underline-offset-4">
              Log in instead
            </Link>
          </p>
        </form>
      </div>

    </main>
  );
}