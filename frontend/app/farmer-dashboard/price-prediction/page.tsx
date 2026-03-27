"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function PricePredictionPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState("Wheat (Lok-1)");

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex h-screen bg-[#EBE5D9] overflow-hidden selection:bg-[#FBC02D] selection:text-[#0A2F1D] font-sans relative">
      
      {/* EXTREME 3D ANIMATIONS & UTILITIES */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes laser-scan {
          0% { left: -10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 110%; opacity: 0; }
        }
        .animate-laser {
          position: absolute;
          height: 100%;
          width: 2px;
          background: #FBC02D;
          box-shadow: 0 0 20px 5px rgba(251, 192, 45, 0.6);
          animation: laser-scan 3s ease-in-out infinite;
          z-index: 20;
        }

        .glass-sidebar {
          background: rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255, 255, 255, 0.95);
          border-left: 1px solid rgba(255, 255, 255, 0.95);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          border-right: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 15px 35px rgba(10, 47, 29, 0.1), inset 0 2px 0 rgba(255, 255, 255, 0.8);
        }

        .chunky-3d-block {
          background: #FDF8EE;
          border: 2px solid #E2DFD3;
          border-radius: 2rem;
          box-shadow: 0 12px 0 0 #D4C392, 0 25px 35px rgba(10, 47, 29, 0.15), inset 0 4px 10px rgba(255, 255, 255, 1); 
          transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .chunky-3d-block:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 0 0 #D4C392, 0 35px 50px rgba(10, 47, 29, 0.2), inset 0 4px 10px rgba(255, 255, 255, 1);
        }

        .embedded-screen {
          background: #061A10;
          border-radius: 1.5rem;
          border: 3px solid #10893E;
          box-shadow: inset 0 15px 25px rgba(0, 0, 0, 0.6), 0 2px 0 rgba(255, 255, 255, 0.5);
        }
        
        .bg-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E");
        }
      `}} />

      {/* BACKGROUND GLOWS & NOISE */}
      <div className="absolute inset-0 bg-noise z-0 pointer-events-none"></div>
      <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-[#10893E] rounded-full mix-blend-multiply filter blur-[150px] opacity-20 pointer-events-none z-0 animate-pulse"></div>
      
      {/* --- SIDEBAR ---
      <aside className={`relative z-20 w-24 lg:w-64 h-[calc(100vh-2rem)] my-4 ml-4 glass-sidebar rounded-3xl flex flex-col justify-between py-8 transition-all duration-300 ease-out transform ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
        <div className="px-0 lg:px-8 flex justify-center lg:justify-start items-center">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0A2F1D] to-[#10893E] rounded-xl flex items-center justify-center shadow-[0_4px_10px_rgba(10,47,29,0.3),inset_0_2px_0_rgba(255,255,255,0.3)] transform group-hover:rotate-12 transition-transform duration-150">
              <span className="w-4 h-4 bg-[#FBC02D] rounded-full shadow-inner"></span>
            </div>
            <span className="hidden lg:block text-2xl font-black text-[#0A2F1D] tracking-tight drop-shadow-sm">Krishi<span className="text-[#10893E]">Setu</span></span>
          </Link>
        </div>

        <nav className="flex-1 mt-12 px-4 space-y-3">
          {[
  { name: "Dashboard", icon: "📊", link: "/farmer-dashboard", active: false },
  { name: "Marketplace", icon: "🤝", link: "/marketplace", active: false },
  { name: "AI Advisor", icon: "🤖", link: "/advisor", active: false },
  { name: "Price Forecast", icon: "🔮", link: "/price-prediction", active: false },
  { name: "Calculator", icon: "🧮", link: "/calculator", active: false }, // Add this!
  { name: "Mandi Prices", icon: "📈", link: "/mandi-prices", active: false },
  { name: "Traceability", icon: "🌱", link: "/traceability", active: false },
].map((nav, idx) => (
            <Link key={idx} href={nav.link} className={`flex items-center justify-center lg:justify-start space-x-4 px-4 py-4 rounded-2xl transition-all duration-150 font-bold ${
              nav.active 
              ? 'bg-gradient-to-b from-[#0A2F1D] to-[#062013] text-[#FDF8EE] shadow-[0_8px_15px_rgba(10,47,29,0.4),inset_0_1px_0_rgba(255,255,255,0.2)] scale-105' 
              : 'text-[#627768] hover:bg-white/80 hover:text-[#0A2F1D] hover:shadow-[0_5px_15px_rgba(10,47,29,0.08)] hover:-translate-y-1'
            }`}>
              <span className="text-xl drop-shadow-md">{nav.icon}</span>
              <span className="hidden lg:block">{nav.name}</span>
            </Link>
          ))}
        </nav>

        <div className="px-4 mt-auto">
          <Link href="/profile" className="flex items-center justify-center lg:justify-start space-x-3 p-2 rounded-2xl hover:bg-white/80 transition-all duration-150 group border border-transparent hover:border-[#E2DFD3]">
            <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#FCD14D] to-[#FBC02D] flex items-center justify-center text-[#0A2F1D] font-black border-2 border-white shadow-[0_4px_8px_rgba(251,192,45,0.4)] group-hover:scale-110 transition-transform duration-150">
              US
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-bold text-[#0A2F1D] leading-tight">Ujjawal S.</p>
              <p className="text-xs font-medium text-[#627768]">Verified Farmer</p>
            </div>
          </Link>
        </div>
      </aside> */}

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 h-full overflow-y-auto hide-scrollbar p-4 md:p-8 relative z-10 pb-32">
        
        {/* HEADER */}
        <header className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-8 transition-all duration-300 ease-out transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-[#0A2F1D] mb-1 drop-shadow-sm">Price Prediction Models</h1>
            <p className="text-[#627768] font-medium">Deep-learning market trajectories and seasonality charts.</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-4">
             <div className="glass-sidebar px-4 py-2 rounded-xl flex items-center space-x-3 border border-white shadow-sm hover:shadow-md transition-shadow">
               <span className="text-lg">🌾</span>
               <select className="bg-transparent font-bold text-[#0A2F1D] focus:outline-none appearance-none cursor-pointer pr-4" value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)}>
                 <option>Wheat (Lok-1)</option>
                 <option>Mustard Seed</option>
               </select>
               <span className="absolute right-4 text-[10px] text-[#10893E] pointer-events-none">▼</span>
             </div>
             <div className="glass-sidebar px-4 py-2 rounded-xl flex items-center space-x-3 border border-white shadow-sm hover:shadow-md transition-shadow">
               <span className="text-lg">📍</span>
               <select className="bg-transparent font-bold text-[#0A2F1D] focus:outline-none appearance-none cursor-pointer pr-4">
                 <option>Ludhiana APMC</option>
                 <option>Khanna APMC</option>
               </select>
               <span className="absolute right-4 text-[10px] text-[#10893E] pointer-events-none">▼</span>
             </div>
          </div>
        </header>

        {/* --- MASSIVE ANALYTICS CHART (FIXED PROPORTIONS) --- */}
        <div className={`chunky-3d-block p-6 md:p-8 w-full max-w-6xl mx-auto mb-8 transition-all duration-300 delay-100 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-black text-[#0A2F1D]">30-Day Trajectory</h2>
              <p className="text-[#627768] font-bold text-sm">Historical vs. AI Prediction</p>
            </div>
            <div className="text-right">
                <p className="text-[#627768] text-xs font-bold uppercase tracking-widest mb-1">Target Peak</p>
                <span className="block text-3xl md:text-4xl font-black text-[#10893E] drop-shadow-sm">₹2,550<span className="text-xl text-[#627768]">/q</span></span>
            </div>
          </div>

          {/* THE FIX: `aspect-[2/1] md:aspect-[3/1]` and `max-h-[320px]` ensure the graph stays sleek and cinematic, never stretching vertically */}
          <div className="embedded-screen w-full aspect-[2/1] md:aspect-[3/1] max-h-[320px] relative overflow-hidden flex items-end">
            <div className="animate-laser"></div>
            
            {/* Redrawn SVG Paths for a smooth, realistic market trend */}
            <svg viewBox="0 0 1000 300" className="w-full h-full overflow-visible p-4 md:p-8" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#10893E" strokeWidth="1" strokeOpacity="0.2" />
                </pattern>
                <linearGradient id="historyGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10893E" stopOpacity="0.5"/>
                  <stop offset="100%" stopColor="#10893E" stopOpacity="0.0"/>
                </linearGradient>
                <pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="10" height="10">
                  <path d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2" stroke="#FBC02D" strokeWidth="1" strokeOpacity="0.3" />
                </pattern>
              </defs>
              
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Grid Lines */}
              {[50, 125, 200, 275].map((y, i) => (
                <line key={i} x1="0" y1={y} x2="1000" y2={y} stroke="#10893E" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="4,4" />
              ))}

              {/* Data Lines */}
              <line x1="600" y1="0" x2="600" y2="300" stroke="#FBC02D" strokeWidth="2" strokeDasharray="6,4" opacity="0.5" />
              <rect x="560" y="10" width="80" height="24" rx="12" fill="#FBC02D" />
              <text x="600" y="26" fill="#0A2F1D" fontSize="12" fontWeight="bold" textAnchor="middle">TODAY</text>

              {/* Historic Path - Smoothed out */}
              <path d="M0,250 C150,260 250,180 400,190 C500,200 550,130 600,120 L600,300 L0,300 Z" fill="url(#historyGlow)" />
              <path d="M0,250 C150,260 250,180 400,190 C500,200 550,130 600,120" fill="none" stroke="#10893E" strokeWidth="5" strokeLinecap="round" className="drop-shadow-[0_6px_6px_rgba(16,137,62,0.5)]" />

              {/* Future Path - Smoothed out */}
              <path d="M600,120 C700,100 750,50 850,40 C900,35 950,50 1000,55 L1000,300 L600,300 Z" fill="url(#diagonalHatch)" />
              <path d="M600,120 C700,100 750,50 850,40 C900,35 950,50 1000,55" fill="none" stroke="#FBC02D" strokeWidth="5" strokeDasharray="10,10" strokeLinecap="round" className="drop-shadow-[0_8px_8px_rgba(251,192,45,0.6)]" />

              <circle cx="600" cy="120" r="7" fill="#fff" stroke="#10893E" strokeWidth="3" className="shadow-[0_0_10px_#fff]" />
              <circle cx="850" cy="40" r="9" fill="#FBC02D" stroke="#000" strokeWidth="3" className="animate-pulse shadow-[0_0_20px_#FBC02D]" />
            </svg>
          </div>
        </div>

        {/* --- MARKET DRIVERS --- */}
        <div className={`max-w-6xl mx-auto transition-all duration-300 delay-200 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-xl font-black text-[#0A2F1D] mb-4 drop-shadow-sm ml-2">Market Influencers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="chunky-3d-block p-5 group">
              <div className="flex justify-between items-start mb-2">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl shadow-[inset_0_2px_0_rgba(255,255,255,1),0_4px_10px_rgba(37,99,235,0.2)] group-hover:scale-110 transition-transform">⛈️</div>
                <div className="text-[10px] font-black text-[#10893E] bg-[#E9F3E8] px-2 py-1 rounded shadow-sm border border-[#CDE0C3] uppercase">High Impact</div>
              </div>
              <h3 className="font-bold text-[#0A2F1D] text-lg mt-3">Weather Patterns</h3>
              <p className="text-xs font-medium text-[#627768] mt-1">Expected unseasonal rain in neighboring states is predicted to lower overall supply.</p>
            </div>

            <div className="chunky-3d-block p-5 group">
              <div className="flex justify-between items-start mb-2">
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-2xl shadow-[inset_0_2px_0_rgba(255,255,255,1),0_4px_10px_rgba(249,115,22,0.2)] group-hover:scale-110 transition-transform">⛽</div>
                <div className="text-[10px] font-black text-[#D49800] bg-[#FFF9E6] px-2 py-1 rounded shadow-sm border border-[#FDE08B] uppercase">Med Impact</div>
              </div>
              <h3 className="font-bold text-[#0A2F1D] text-lg mt-3">Transport Costs</h3>
              <p className="text-xs font-medium text-[#627768] mt-1">Diesel prices remain stable, keeping buyer purchasing power strong in the region.</p>
            </div>

            <div className="chunky-3d-block p-5 group">
              <div className="flex justify-between items-start mb-2">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-2xl shadow-[inset_0_2px_0_rgba(255,255,255,1),0_4px_10px_rgba(147,51,234,0.2)] group-hover:scale-110 transition-transform">📉</div>
                <div className="text-[10px] font-black text-[#10893E] bg-[#E9F3E8] px-2 py-1 rounded shadow-sm border border-[#CDE0C3] uppercase">High Impact</div>
              </div>
              <h3 className="font-bold text-[#0A2F1D] text-lg mt-3">Historical Trend</h3>
              <p className="text-xs font-medium text-[#627768] mt-1">This specific 2-week window consistently sees a 4-6% price surge annually.</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}