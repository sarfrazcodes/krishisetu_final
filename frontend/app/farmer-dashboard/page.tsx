"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function FarmerDashboardOverview() {
  const [mounted, setMounted] = useState(false);
  const [greeting, setGreeting] = useState("Welcome");
  const [userName, setUserName] = useState("Farmer");
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.name) setUserName(parsed.name.split(" ")[0]);
      } catch(e) {}
    }
  }, []);

  return (
    <main className="p-4 md:p-8 max-w-7xl mx-auto overflow-x-hidden w-full">
      
      <header className={`flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 md:mb-10 transition-all duration-300 ease-out transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="mb-4 lg:mb-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0A2F1D] mb-1 tracking-tight">{greeting}, {userName}!</h1>
          <p className="text-[#627768] font-semibold text-sm md:text-lg">Here is your farm's market overview today.</p>
        </div>
        
        {/* Mobile optimized buttons: flex-wrap ensures they don't break the screen */}
        <div className="flex flex-wrap gap-3 items-center w-full lg:w-auto">
          <button className="bg-white border border-[#E2DFD3] shadow-sm p-3 rounded-xl text-lg md:text-xl hover:bg-slate-50 transition-all">
            🔍
          </button>
          
          <Link href="/farmer-dashboard/notifications">
            <button className="bg-white border border-[#E2DFD3] shadow-sm p-3 rounded-xl text-lg md:text-xl hover:bg-slate-50 transition-all relative group">
              <span className="group-hover:rotate-12 transition-transform inline-block">🔔</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse border-2 border-white"></span>
            </button>
          </Link>
          
          <Link href="/farmer-dashboard/new-listing" className="flex-1 sm:flex-none">
            <button className="w-full bg-[#10893E] text-white px-4 md:px-6 py-3 rounded-xl font-bold shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
              <span className="text-lg">+</span>
              <span className="whitespace-nowrap">New Listing</span>
            </button>
          </Link>
        </div>
      </header>

      {/* --- BENTO BOX GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-6 pb-20">
        
        {/* STAT CARD 1 */}
        <div className={`lg:col-span-6 bg-white border border-[#E2DFD3] shadow-sm p-5 md:p-6 rounded-2xl md:rounded-3xl group transition-all duration-200 transform ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-emerald-50 text-[#10893E] flex items-center justify-center text-xl md:text-2xl">🌾</div>
            <span className="text-xs md:text-sm font-bold text-[#10893E] bg-emerald-50 px-2 py-1 rounded-lg">▲ +12.5%</span>
          </div>
          <p className="text-[#627768] font-bold text-xs md:text-sm uppercase tracking-wide">Est. Harvest Value</p>
          <h2 className="text-3xl md:text-4xl font-black text-[#0A2F1D] mt-1 tracking-tight">₹4,25,000</h2>
        </div>

        {/* STAT CARD 2 */}
        <div className={`lg:col-span-6 bg-white border border-[#E2DFD3] shadow-sm p-5 md:p-6 rounded-2xl md:rounded-3xl group transition-all duration-200 transform ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl md:text-2xl">👀</div>
            <span className="text-xs md:text-sm font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-lg">High Demand</span>
          </div>
          <p className="text-[#627768] font-bold text-xs md:text-sm uppercase tracking-wide">Interested Buyers</p>
          <h2 className="text-3xl md:text-4xl font-black text-[#0A2F1D] mt-1 tracking-tight">24 Active</h2>
        </div>

        {/* --- LARGE AI CHART WIDGET --- */}
        <div className={`sm:col-span-2 lg:col-span-8 bg-white border border-[#E2DFD3] shadow-sm p-4 md:p-8 rounded-2xl md:rounded-[2rem] relative overflow-hidden group transition-all duration-200 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 relative z-10 gap-2">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-[#0A2F1D]">Wheat Forecast</h2>
              <p className="text-[#627768] font-bold text-xs md:text-sm mt-1">Ludhiana APMC • 7 Day Projection</p>
            </div>
            <div className="sm:text-right">
              <span className="block text-2xl md:text-3xl lg:text-4xl font-black text-[#10893E]">₹2,450<span className="text-lg md:text-xl text-[#627768]">/q</span></span>
            </div>
          </div>

          <div className="w-full h-32 sm:h-48 md:h-64 relative z-10 overflow-hidden">
            <svg viewBox="0 0 800 200" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10893E" stopOpacity="0.15"/>
                  <stop offset="100%" stopColor="#10893E" stopOpacity="0.0"/>
                </linearGradient>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10893E"/>
                  <stop offset="70%" stopColor="#10893E"/>
                  <stop offset="100%" stopColor="#FBC02D"/>
                </linearGradient>
              </defs>
              <line x1="0" y1="50" x2="800" y2="50" stroke="#FDF8EE" strokeWidth="2" strokeDasharray="5,5" />
              <line x1="0" y1="100" x2="800" y2="100" stroke="#FDF8EE" strokeWidth="2" strokeDasharray="5,5" />
              <line x1="0" y1="150" x2="800" y2="150" stroke="#FDF8EE" strokeWidth="2" strokeDasharray="5,5" />
              <path d="M0,150 C100,160 200,120 300,90 C400,60 500,100 600,40 C700,-20 800,20 800,20 L800,200 L0,200 Z" fill="url(#chartGlow)" />
              <path d="M0,150 C100,160 200,120 300,90 C400,60 500,100 600,40 C700,-20 800,20 800,20" fill="none" stroke="url(#lineGradient)" strokeWidth="4" strokeLinecap="round" />
              <circle cx="800" cy="20" r="6" fill="#FBC02D" stroke="#fff" strokeWidth="3" />
            </svg>
          </div>
          
          <div className="flex justify-between text-[10px] md:text-xs font-black text-[#8A9A90] mt-2 uppercase tracking-widest relative z-10">
            <span>Past</span>
            <span>Today</span>
            <span className="text-[#FBC02D]">Next Week</span>
          </div>
        </div>

        {/* --- LIVE MANDI WIDGET --- */}
        <div className={`sm:col-span-2 lg:col-span-4 bg-white border border-[#E2DFD3] shadow-sm p-4 md:p-6 lg:p-8 rounded-2xl md:rounded-[2rem] flex flex-col transition-all duration-200 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h3 className="text-lg md:text-xl font-black text-[#0A2F1D]">Live Prices</h3>
            <span className="flex items-center text-[10px] md:text-xs font-bold text-[#10893E] bg-emerald-50 px-2 py-1 rounded-full">
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#10893E] animate-pulse mr-1.5"></span>
              LIVE
            </span>
          </div>
          
          <div className="space-y-2 md:space-y-4 flex-1">
            {[
              { crop: "Mustard", price: "₹5,875", change: "+1.8%", icon: "🌻", up: true },
              { crop: "Cotton", price: "₹6,600", change: "-0.5%", icon: "🌿", up: false },
              { crop: "Potato", price: "₹1,100", change: "+2.7%", icon: "🥔", up: true },
              { crop: "Rice", price: "₹2,900", change: "+0.4%", icon: "🌾", up: true }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 md:py-3 border-b border-[#FDF8EE] last:border-0 hover:bg-slate-50 transition-colors px-1 md:px-2 rounded-xl cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-[#FDF8EE] rounded-lg flex items-center justify-center text-lg md:text-xl">{item.icon}</div>
                  <span className="font-bold text-[#0A2F1D] text-sm md:text-lg">{item.crop}</span>
                </div>
                <div className="text-right">
                  <div className="font-black text-[#0A2F1D] text-sm md:text-lg">{item.price}</div>
                  <div className={`text-xs md:text-sm font-bold ${item.up ? 'text-[#10893E]' : 'text-red-500'}`}>
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