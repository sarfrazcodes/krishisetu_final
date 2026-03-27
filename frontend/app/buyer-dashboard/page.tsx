"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function BuyerDashboard() {
  const [mounted, setMounted] = useState(false);
  const [greeting, setGreeting] = useState("Welcome");

  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

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
          box-shadow: 
            0 15px 35px rgba(10, 47, 29, 0.1), 
            inset 0 2px 0 rgba(255, 255, 255, 0.8);
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
          {[
            { name: "Procurement", icon: "📦", link: "/buyer-dashboard", active: true },
            { name: "My Demands", icon: "📋", link: "#", active: false },
            { name: "Contracts", icon: "🤝", link: "#", active: false },
            { name: "Mandi Intel", icon: "📈", link: "/mandi-prices", active: false },
            { name: "Quality Check", icon: "🔍", link: "#", active: false },
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
          <Link href="/profile" className="flex items-center justify-center lg:justify-start space-x-3 p-2 rounded-2xl hover:bg-white/80 transition-all duration-150 border border-transparent hover:border-[#E2DFD3] hover:shadow-[0_5px_15px_rgba(10,47,29,0.08)] hover:-translate-y-1 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#E2DFD3] to-white flex items-center justify-center text-[#0A2F1D] font-black border-2 border-white shadow-sm group-hover:scale-110 transition-transform duration-150">
              RK
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-bold text-[#0A2F1D] leading-tight">Rajesh K.</p>
              <p className="text-xs font-medium text-[#627768]">Verified Buyer</p>
            </div>
          </Link>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 h-full overflow-y-auto hide-scrollbar p-4 md:p-8 relative z-10">
        
        <header className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-10 transition-all duration-300 ease-out transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-[#0A2F1D] mb-1 drop-shadow-sm">{greeting}, Rajesh!</h1>
            <p className="text-[#627768] font-medium">Your procurement overview for North India Mills.</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-4 items-center">
            <button className="glass-panel p-3 rounded-xl text-xl hover:scale-110 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(10,47,29,0.1)] transition-all duration-150 relative">
              🔔<span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
            </button>
            
            <button className="bg-[#10893E] text-white px-6 py-3 rounded-xl font-bold shadow-[0_6px_0_0_#0D7334] hover:shadow-[0_2px_0_0_#0D7334] hover:translate-y-[4px] active:translate-y-[6px] active:shadow-none transition-all duration-150">
              + Post Requirement
            </button>
          </div>
        </header>

        {/* --- BENTO BOX GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-20">
          
          {/* STAT CARD 1: Sourcing Volume */}
          <div className={`md:col-span-4 glass-panel p-6 rounded-3xl group hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(10,47,29,0.15)] transition-all duration-200 transform ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white to-[#E9F3E8] flex items-center justify-center text-2xl shadow-[inset_0_2px_0_rgba(255,255,255,1),0_4px_10px_rgba(16,137,62,0.1)] group-hover:scale-110 transition-all duration-200">📦</div>
              <span className="text-xs font-bold text-[#10893E] bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm border border-[#CDE0C3]">85% of Target</span>
            </div>
            <p className="text-[#627768] font-bold text-sm uppercase tracking-wide">Procured This Month</p>
            <h2 className="text-3xl font-black text-[#0A2F1D] mt-1 drop-shadow-sm">4,250 <span className="text-xl text-[#627768]">Quintals</span></h2>
          </div>

          {/* STAT CARD 2: Savings */}
          <div className={`md:col-span-4 glass-panel p-6 rounded-3xl group hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(10,47,29,0.15)] transition-all duration-200 transform ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white to-[#FFF9E6] flex items-center justify-center text-2xl shadow-[inset_0_2px_0_rgba(255,255,255,1),0_4px_10px_rgba(251,192,45,0.2)] group-hover:scale-110 transition-all duration-200">💰</div>
              <span className="text-xs font-bold text-[#D49800] bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm border border-[#FDE08B]">▲ 4.2% Saved</span>
            </div>
            <p className="text-[#627768] font-bold text-sm uppercase tracking-wide">Savings vs Mandi Avg</p>
            <h2 className="text-3xl font-black text-[#0A2F1D] mt-1 drop-shadow-sm">₹1.8L</h2>
          </div>

          {/* 3D CHUNKY ACTION CARD: Logistics */}
          <div className={`md:col-span-4 bg-gradient-to-b from-[#14A049] to-[#0A2F1D] p-6 rounded-3xl text-white shadow-[0_10px_0_0_#062013,0_20px_40px_rgba(10,47,29,0.4)] hover:shadow-[0_4px_0_0_#062013,0_15px_30px_rgba(10,47,29,0.6)] hover:translate-y-[6px] relative overflow-hidden group transition-all duration-200 transform cursor-pointer ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <span className="absolute inset-0 w-full h-full -translate-x-[150%] skew-x-[-25deg] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-[150%] transition-transform duration-700 ease-out z-0"></span>
            <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-[#FBC02D] rounded-full mix-blend-screen filter blur-[40px] opacity-40 group-hover:opacity-80 group-hover:scale-125 transition-all duration-300"></div>
            
            <div className="relative z-10 flex items-center justify-between mb-2">
              <h3 className="text-xl font-black drop-shadow-md">Active Shipments</h3>
              <span className="text-3xl drop-shadow-lg transform group-hover:scale-110 transition-transform duration-200">🚚</span>
            </div>
            <p className="text-green-100 text-sm font-medium mb-5 relative z-10 drop-shadow-sm">3 trucks arriving today.</p>
            
            <button className="w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] rounded-xl font-bold text-white transition-colors duration-150 relative z-10 flex items-center justify-center">
              Track Traceability 
              <span className="ml-2 inline-block transform group-hover:translate-x-1.5 transition-transform duration-200">→</span>
            </button>
          </div>

          {/* --- LARGE MARKET TREND CHART --- */}
          <div className={`md:col-span-8 glass-panel p-6 md:p-8 rounded-[2rem] relative overflow-hidden group hover:shadow-[0_25px_50px_rgba(10,47,29,0.15)] transition-all duration-200 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex justify-between items-end mb-6 relative z-10">
              <div>
                <h2 className="text-2xl font-black text-[#0A2F1D] drop-shadow-sm">Wheat Procurement Cost</h2>
                <p className="text-[#627768] font-bold text-sm mt-1">Your Avg Cost vs Market Price</p>
              </div>
              <div className="text-right">
                <span className="block text-3xl md:text-4xl font-black text-[#10893E] drop-shadow-sm">₹2,210<span className="text-xl text-[#627768]">/q</span></span>
              </div>
            </div>

            {/* Glowing SVG Area Chart - Adjusted for Buyer context */}
            <div className="w-full h-48 md:h-64 relative z-10">
              <svg viewBox="0 0 800 200" className="w-full h-full drop-shadow-[0_15px_15px_rgba(16,137,62,0.2)] overflow-visible" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10893E" stopOpacity="0.4"/>
                    <stop offset="100%" stopColor="#10893E" stopOpacity="0.0"/>
                  </linearGradient>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#10893E"/>
                    <stop offset="100%" stopColor="#10893E"/>
                  </linearGradient>
                </defs>
                <line x1="0" y1="50" x2="800" y2="50" stroke="#E2DFD3" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="0" y1="100" x2="800" y2="100" stroke="#E2DFD3" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="0" y1="150" x2="800" y2="150" stroke="#E2DFD3" strokeWidth="1" strokeDasharray="5,5" />
                
                {/* Your Cost Line */}
                <path 
                  d="M0,100 C150,110 300,90 450,100 C600,110 700,95 800,90" 
                  fill="none" 
                  stroke="url(#lineGradient)" 
                  strokeWidth="5" 
                  strokeLinecap="round"
                  className="animate-subtle-float drop-shadow-[0_8px_8px_rgba(16,137,62,0.6)]"
                />
                
                {/* Market Price Line (Dashed red/gray to show they are beating the market) */}
                <path 
                  d="M0,80 C150,85 300,60 450,70 C600,60 700,50 800,45" 
                  fill="none" 
                  stroke="#8A9A90" 
                  strokeWidth="3" 
                  strokeDasharray="8,8"
                  strokeLinecap="round"
                  className="animate-subtle-float"
                />
                
                <circle cx="800" cy="90" r="8" fill="#10893E" stroke="#fff" strokeWidth="4" className="shadow-[0_0_15px_#10893E]" />
              </svg>
            </div>
            
            <div className="flex justify-between items-center text-xs font-black text-[#8A9A90] mt-4 uppercase tracking-widest relative z-10">
              <div className="flex space-x-4">
                <span className="flex items-center"><div className="w-3 h-1 bg-[#10893E] mr-2"></div> Your Cost</span>
                <span className="flex items-center"><div className="w-3 h-1 bg-[#8A9A90] border-t border-dashed mr-2"></div> Mandi Avg</span>
              </div>
              <span className="text-[#10893E] drop-shadow-sm">Today</span>
            </div>
          </div>

          {/* --- TOP MATCHED FARMERS WIDGET --- */}
          <div className={`md:col-span-4 glass-panel p-6 md:p-8 rounded-[2rem] flex flex-col transition-all duration-200 transform hover:shadow-[0_25px_50px_rgba(10,47,29,0.15)] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-[#0A2F1D] drop-shadow-sm">Matched Sellers</h3>
              <span className="text-xs font-bold text-[#627768] hover:text-[#10893E] cursor-pointer transition-colors">View All</span>
            </div>
            
            <div className="space-y-4 flex-1">
              {[
                { name: "Gurpreet S.", crop: "Wheat", qty: "120q", rating: "4.9", dist: "12km" },
                { name: "Aminder Singh", crop: "Wheat", qty: "85q", rating: "4.8", dist: "18km" },
                { name: "Sukhdev V.", crop: "Mustard", qty: "40q", rating: "4.9", dist: "25km" },
                { name: "Rajinder Farm", crop: "Potato", qty: "200q", rating: "4.7", dist: "8km" }
              ].map((farmer, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white/50 rounded-2xl hover:bg-white hover:shadow-[0_8px_20px_rgba(10,47,29,0.08)] hover:-translate-y-1 transition-all duration-150 cursor-pointer group border border-white/40 hover:border-white">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-b from-[#FCD14D] to-[#FBC02D] rounded-full flex items-center justify-center text-[#0A2F1D] font-black border-2 border-white shadow-sm group-hover:scale-110 transition-transform duration-200">
                      {farmer.name.charAt(0)}
                    </div>
                    <div>
                      <span className="block font-bold text-[#0A2F1D] leading-tight">{farmer.name}</span>
                      <span className="text-xs font-medium text-[#627768]">{farmer.crop} • {farmer.qty}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-[#10893E]">⭐ {farmer.rating}</div>
                    <div className="text-xs font-bold text-[#8A9A90]">{farmer.dist}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}