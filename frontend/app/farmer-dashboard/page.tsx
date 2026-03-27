// app/farmer-dashboard/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function FarmerDashboardOverview() {
  const [mounted, setMounted] = useState(false);
  const [greeting, setGreeting] = useState("Welcome");

  // Mount animations and time-based greeting
  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <main className="p-4 md:p-8">
      
      <header className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-10 transition-all duration-300 ease-out transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#0A2F1D] mb-1 drop-shadow-sm">{greeting}, Harpreet!</h1>
          <p className="text-[#627768] font-medium">Here is what the markets are doing today.</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-4 items-center">
          <button className="glass-panel p-3 rounded-xl text-xl hover:scale-110 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(10,47,29,0.1)] transition-all duration-150">
            🔍
          </button>
          <button className="glass-panel p-3 rounded-xl text-xl hover:scale-110 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(10,47,29,0.1)] transition-all duration-150 relative">
            🔔<span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#FBC02D] rounded-full shadow-[0_0_8px_#FBC02D]"></span>
          </button>
          
          {/* LINK TO THE NEW LISTING PAGE WE BUILT! */}
          <Link href="/farmer-dashboard/new-listing">
            <button className="bg-[#10893E] text-white px-6 py-3 rounded-xl font-bold shadow-[0_6px_0_0_#0D7334] hover:shadow-[0_2px_0_0_#0D7334] hover:translate-y-[4px] active:translate-y-[6px] active:shadow-none transition-all duration-150">
              + New Listing
            </button>
          </Link>
        </div>
      </header>

      {/* --- BENTO BOX GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-20">
        
        {/* STAT CARD 1 */}
        <div className={`md:col-span-4 glass-panel p-6 rounded-3xl group hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(10,47,29,0.15)] transition-all duration-200 transform ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white to-[#E9F3E8] flex items-center justify-center text-2xl shadow-[inset_0_2px_0_rgba(255,255,255,1),0_4px_10px_rgba(16,137,62,0.1)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-200">🌾</div>
            <span className="text-xs font-bold text-[#10893E] bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm border border-[#CDE0C3]">▲ +12.5%</span>
          </div>
          <p className="text-[#627768] font-bold text-sm uppercase tracking-wide">Est. Harvest Value</p>
          <h2 className="text-3xl font-black text-[#0A2F1D] mt-1 drop-shadow-sm">₹4,25,000</h2>
        </div>

        {/* STAT CARD 2 */}
        <div className={`md:col-span-4 glass-panel p-6 rounded-3xl group hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(10,47,29,0.15)] transition-all duration-200 transform ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white to-[#FFF9E6] flex items-center justify-center text-2xl shadow-[inset_0_2px_0_rgba(255,255,255,1),0_4px_10px_rgba(251,192,45,0.2)] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-200">👀</div>
            <span className="text-xs font-bold text-[#D49800] bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm border border-[#FDE08B]">High Demand</span>
          </div>
          <p className="text-[#627768] font-bold text-sm uppercase tracking-wide">Interested Buyers</p>
          <h2 className="text-3xl font-black text-[#0A2F1D] mt-1 drop-shadow-sm">24 Active</h2>
        </div>

        {/* 3D CHUNKY ACTION CARD: AI Quick Scan */}
        <div className={`md:col-span-4 bg-gradient-to-b from-[#14A049] to-[#0A2F1D] p-6 rounded-3xl text-white shadow-[0_10px_0_0_#062013,0_20px_40px_rgba(10,47,29,0.4)] hover:shadow-[0_4px_0_0_#062013,0_15px_30px_rgba(10,47,29,0.6)] hover:translate-y-[6px] relative overflow-hidden group transition-all duration-200 transform cursor-pointer ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <span className="absolute inset-0 w-full h-full -translate-x-[150%] skew-x-[-25deg] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-[150%] transition-transform duration-700 ease-out z-0"></span>
          <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-[#FBC02D] rounded-full mix-blend-screen filter blur-[40px] opacity-40 group-hover:opacity-80 group-hover:scale-125 transition-all duration-300"></div>
          
          <div className="relative z-10 flex items-center justify-between mb-2">
            <h3 className="text-xl font-black drop-shadow-md">AI Market Scan</h3>
            <span className="text-3xl drop-shadow-lg transform group-hover:scale-110 transition-transform duration-200">🤖</span>
          </div>
          <p className="text-green-100 text-sm font-medium mb-5 relative z-10 drop-shadow-sm">Wheat prices peaking in 4 days.</p>
          
          <Link href="/farmer-dashboard/ai-advisor">
            <button className="w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] rounded-xl font-bold text-white transition-colors duration-150 relative z-10 flex items-center justify-center">
              Run Full Analysis 
              <span className="ml-2 inline-block transform group-hover:translate-x-1.5 transition-transform duration-200">→</span>
            </button>
          </Link>
        </div>

        {/* --- LARGE AI CHART WIDGET --- */}
        <div className={`md:col-span-8 glass-panel p-6 md:p-8 rounded-[2rem] relative overflow-hidden group hover:shadow-[0_25px_50px_rgba(10,47,29,0.15)] transition-all duration-200 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex justify-between items-end mb-6 relative z-10">
            <div>
              <h2 className="text-2xl font-black text-[#0A2F1D] drop-shadow-sm">Wheat Forecast</h2>
              <p className="text-[#627768] font-bold text-sm mt-1">Ludhiana APMC • 7 Day Projection</p>
            </div>
            <div className="text-right">
              <span className="block text-3xl md:text-4xl font-black text-[#10893E] drop-shadow-sm">₹2,450<span className="text-xl text-[#627768]">/q</span></span>
            </div>
          </div>

          <div className="w-full h-48 md:h-64 relative z-10">
            <svg viewBox="0 0 800 200" className="w-full h-full drop-shadow-[0_15px_15px_rgba(16,137,62,0.2)] overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10893E" stopOpacity="0.5"/>
                  <stop offset="100%" stopColor="#10893E" stopOpacity="0.0"/>
                </linearGradient>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10893E"/>
                  <stop offset="70%" stopColor="#10893E"/>
                  <stop offset="100%" stopColor="#FBC02D"/>
                </linearGradient>
              </defs>
              <line x1="0" y1="50" x2="800" y2="50" stroke="#E2DFD3" strokeWidth="1" strokeDasharray="5,5" />
              <line x1="0" y1="100" x2="800" y2="100" stroke="#E2DFD3" strokeWidth="1" strokeDasharray="5,5" />
              <line x1="0" y1="150" x2="800" y2="150" stroke="#E2DFD3" strokeWidth="1" strokeDasharray="5,5" />
              
              <path d="M0,150 C100,160 200,120 300,90 C400,60 500,100 600,40 C700,-20 800,20 800,20 L800,200 L0,200 Z" fill="url(#chartGlow)" className="animate-subtle-float"/>
              <path d="M0,150 C100,160 200,120 300,90 C400,60 500,100 600,40 C700,-20 800,20 800,20" fill="none" stroke="url(#lineGradient)" strokeWidth="5" strokeLinecap="round" className="animate-subtle-float drop-shadow-[0_8px_8px_rgba(16,137,62,0.6)]"/>
              <circle cx="800" cy="20" r="8" fill="#FBC02D" stroke="#fff" strokeWidth="4" className="animate-pulse shadow-[0_0_15px_#FBC02D]" />
            </svg>
          </div>
          
          <div className="flex justify-between text-xs font-black text-[#8A9A90] mt-2 uppercase tracking-widest relative z-10">
            <span>Past</span>
            <span>Today</span>
            <span className="text-[#FBC02D] drop-shadow-sm">Next Week</span>
          </div>
        </div>

        {/* --- LIVE MANDI WIDGET --- */}
        <div className={`md:col-span-4 glass-panel p-6 md:p-8 rounded-[2rem] flex flex-col transition-all duration-200 transform hover:shadow-[0_25px_50px_rgba(10,47,29,0.15)] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-[#0A2F1D] drop-shadow-sm">Live Prices</h3>
            <span className="flex items-center text-xs font-bold text-[#10893E] bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full shadow-inner border border-[#CDE0C3]">
              <span className="w-2 h-2 rounded-full bg-[#10893E] animate-pulse mr-1.5 shadow-[0_0_5px_#10893E]"></span>
              LIVE
            </span>
          </div>
          
          <div className="space-y-4 flex-1">
            {[
              { crop: "Mustard", price: "₹5,875", change: "+1.8%", icon: "🌻", up: true },
              { crop: "Cotton", price: "₹6,600", change: "-0.5%", icon: "🌿", up: false },
              { crop: "Potato", price: "₹1,100", change: "+2.7%", icon: "🥔", up: true },
              { crop: "Rice", price: "₹2,900", change: "+0.4%", icon: "🌾", up: true }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-white/50 rounded-2xl hover:bg-white hover:shadow-[0_8px_20px_rgba(10,47,29,0.08)] hover:-translate-y-1 transition-all duration-150 cursor-pointer group border border-white/40 hover:border-white">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-white to-[#EAE4D4] rounded-xl flex items-center justify-center text-2xl shadow-[inset_0_2px_0_rgba(255,255,255,0.8),0_2px_5px_rgba(0,0,0,0.05)] group-hover:scale-110 group-hover:rotate-6 transition-transform duration-200">{item.icon}</div>
                  <span className="font-bold text-[#0A2F1D]">{item.crop}</span>
                </div>
                <div className="text-right">
                  <div className="font-black text-[#0A2F1D]">{item.price}</div>
                  <div className={`text-xs font-bold ${item.up ? 'text-[#10893E]' : 'text-red-500'}`}>
                    {item.up ? '▲' : '▼'} {item.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}