"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; // <-- Added this to track active pages
import { useEffect, useState } from "react";

export default function FarmerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname(); // <-- Gets the current URL path
  
  // State for the global voice assistant
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleVoice = () => {
    setIsListening(!isListening);
    // You can connect your voice AI logic here later!
  };

  // Navigation Links Array
  const navLinks = [
    { name: "Dashboard", icon: "📊", link: "/farmer-dashboard" },
    { name: "Marketplace", icon: "🤝", link: "/farmer-dashboard/marketplace" },
    { name: "AI Advisor", icon: "🤖", link: "/farmer-dashboard/advisor" },
    { name: "Price Forecast", icon: "🔮", link: "/farmer-dashboard/price-prediction" },
    { name: "Calculator", icon: "🧮", link: "/farmer-dashboard/calculator" },
    { name: "Mandi Prices", icon: "📈", link: "/farmer-dashboard/mandi-prices" },
    { name: "Traceability", icon: "🌱", link: "/farmer-dashboard/traceability" },
  ];

  return (
    <div className="flex h-screen bg-[#EBE5D9] overflow-hidden selection:bg-[#FBC02D] selection:text-[#0A2F1D] font-sans relative">
      
      {/* GLOBAL ANIMATIONS & 3D UTILITIES */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes subtle-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-subtle-float { animation: subtle-float 4s ease-in-out infinite; }
        
        .glass-panel {
          background: rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255, 255, 255, 0.95);
          border-left: 1px solid rgba(255, 255, 255, 0.95);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          border-right: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 15px 35px rgba(10, 47, 29, 0.1), inset 0 2px 0 rgba(255, 255, 255, 0.8);
        }
        
        .bg-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.06'/%3E%3C/svg%3E");
        }
      `}} />

      {/* BACKGROUND GLOWS & NOISE */}
      <div className="absolute inset-0 bg-noise z-0 pointer-events-none"></div>
      <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] bg-[#10893E] rounded-full mix-blend-multiply filter blur-[140px] opacity-[0.12] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-15%] right-[-5%] w-[700px] h-[700px] bg-[#FBC02D] rounded-full mix-blend-multiply filter blur-[160px] opacity-[0.12] pointer-events-none z-0"></div>

      {/* --- FLOATING 3D SIDEBAR --- */}
      <aside className={`relative z-20 w-24 lg:w-64 h-[calc(100vh-2rem)] my-4 ml-4 glass-panel rounded-3xl flex flex-col justify-between py-8 transition-all duration-300 ease-out transform ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
        
        <div className="px-0 lg:px-8 flex justify-center lg:justify-start items-center">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0A2F1D] to-[#10893E] rounded-xl flex items-center justify-center shadow-[0_4px_10px_rgba(10,47,29,0.3),inset_0_2px_0_rgba(255,255,255,0.3)] transform group-hover:rotate-12 transition-transform duration-150">
              <span className="w-4 h-4 bg-[#FBC02D] rounded-full shadow-inner"></span>
            </div>
            <span className="hidden lg:block text-2xl font-black text-[#0A2F1D] tracking-tight drop-shadow-sm">Krishi<span className="text-[#10893E]">Setu</span></span>
          </Link>
        </div>

        <nav className="flex-1 mt-12 px-4 space-y-3">
          {navLinks.map((nav, idx) => {
            // Check if the current URL matches the link to highlight the active tab
            const isActive = pathname === nav.link;

            return (
              <Link key={idx} href={nav.link} className={`flex items-center justify-center lg:justify-start space-x-4 px-4 py-4 rounded-2xl transition-all duration-150 font-bold ${
                isActive 
                ? 'bg-gradient-to-b from-[#0A2F1D] to-[#062013] text-[#FDF8EE] shadow-[0_8px_15px_rgba(10,47,29,0.4),inset_0_1px_0_rgba(255,255,255,0.2)] scale-105' 
                : 'text-[#627768] hover:bg-white/80 hover:text-[#0A2F1D] hover:shadow-[0_5px_15px_rgba(10,47,29,0.08)] hover:-translate-y-1'
              }`}>
                <span className="text-xl drop-shadow-md">{nav.icon}</span>
                <span className="hidden lg:block">{nav.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* BOTTOM SIDEBAR ACTIONS (Voice & Profile) */}
        <div className="px-4 mt-auto flex flex-col gap-4">
          
          {/* 3D INTEGRATED VOICE BUTTON */}
          <button
            onClick={toggleVoice}
            className={`relative flex items-center justify-center lg:justify-start space-x-3 p-3 rounded-2xl transition-all duration-300 border-2 border-b-[4px] group w-full
              ${isListening
                ? "bg-red-500 text-white border-red-600 shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse translate-y-[2px] !border-b-2"
                : "bg-white text-[#0A2F1D] border-[#D6D0C4] hover:bg-[#FDF8EE] hover:-translate-y-[2px] active:border-b-2 active:translate-y-[2px] shadow-sm"
              }`}
            title={isListening ? "Stop listening" : "KrishiSetu Voice Assistant"}
          >
            <div className="flex items-center justify-center w-8 h-8 relative">
              {isListening && <span className="absolute inset-0 rounded-full animate-ping bg-white opacity-40" />}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" 
                   className={isListening ? "text-white" : "text-[#10893E]"}>
                <rect x="9" y="2" width="6" height="11" rx="3" />
                <path d="M5 10a7 7 0 0 0 14 0M12 19v3M8 22h8" />
              </svg>
            </div>
            <span className="hidden lg:block font-black text-sm">
              {isListening ? "Listening..." : "Voice Assistant"}
            </span>
          </button>

          {/* USER PROFILE CARD */}
          <Link href="/farmer-dashboard/profile" className="flex items-center justify-center lg:justify-start space-x-3 p-2 rounded-2xl hover:bg-white/80 transition-all duration-150 border border-transparent hover:border-[#E2DFD3] hover:shadow-[0_5px_15px_rgba(10,47,29,0.08)] hover:-translate-y-1 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#FCD14D] to-[#FBC02D] flex items-center justify-center text-[#0A2F1D] font-black border-2 border-white shadow-[0_4px_8px_rgba(251,192,45,0.4)] group-hover:scale-110 transition-transform duration-150">
              HS
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-bold text-[#0A2F1D] leading-tight">Harpreet S.</p>
              <p className="text-xs font-medium text-[#627768]">Verified Farmer</p>
            </div>
          </Link>
          
        </div>
      </aside>

      {/* --- RIGHT SIDE CONTENT AREA --- */}
      <div className="flex-1 h-full overflow-y-auto hide-scrollbar relative z-10">
        {children}
      </div>

    </div>
  );
}