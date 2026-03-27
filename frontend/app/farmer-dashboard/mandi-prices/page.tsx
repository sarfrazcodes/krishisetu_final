"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function MandiPricesPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("All Crops");

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex h-screen bg-[#EBE5D9] overflow-hidden selection:bg-[#FBC02D] selection:text-[#0A2F1D] font-sans relative">
      
      {/* GLOBAL ANIMATIONS & 3D UTILITIES */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
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

        .glass-row {
          background: rgba(255, 255, 255, 0.3);
          border-top: 1px solid rgba(255, 255, 255, 0.8);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .bg-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.06'/%3E%3C/svg%3E");
        }
      `}} />

      {/* BACKGROUND GLOWS & NOISE */}
      <div className="absolute inset-0 bg-noise z-0 pointer-events-none"></div>
      <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] bg-[#10893E] rounded-full mix-blend-multiply filter blur-[140px] opacity-[0.12] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-15%] right-[-5%] w-[700px] h-[700px] bg-[#FBC02D] rounded-full mix-blend-multiply filter blur-[160px] opacity-[0.12] pointer-events-none z-0"></div>

      {/* --- FLOATING 3D SIDEBAR (Farmer View) --- */}
      {/* <aside className={`relative z-20 w-24 lg:w-64 h-[calc(100vh-2rem)] my-4 ml-4 glass-panel rounded-3xl flex flex-col justify-between py-8 transition-all duration-300 ease-out transform ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
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
          <Link href="/profile" className="flex items-center justify-center lg:justify-start space-x-3 p-2 rounded-2xl hover:bg-white/80 transition-all duration-150 border border-transparent hover:border-[#E2DFD3] hover:shadow-[0_5px_15px_rgba(10,47,29,0.08)] hover:-translate-y-1 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#FCD14D] to-[#FBC02D] flex items-center justify-center text-[#0A2F1D] font-black border-2 border-white shadow-[0_4px_8px_rgba(251,192,45,0.4)] group-hover:scale-110 transition-transform duration-150">
              HS
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-bold text-[#0A2F1D] leading-tight">Harpreet S.</p>
              <p className="text-xs font-medium text-[#627768]">Verified Farmer</p>
            </div>
          </Link>
        </div>
      </aside> */}

      {/* --- MAIN CONTENT AREA (DATA TERMINAL UI) --- */}
      <main className="flex-1 h-full overflow-y-auto hide-scrollbar p-4 md:p-8 relative z-10 flex flex-col">
        
        <header className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-6 transition-all duration-300 ease-out transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-[#0A2F1D] mb-1 drop-shadow-sm">Mandi Intel Terminal</h1>
            <p className="text-[#627768] font-medium">Real-time APMC prices and 7-day market trends.</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-4 items-center">
            <div className="glass-panel px-4 py-2 rounded-xl flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#10893E] animate-pulse shadow-[0_0_5px_#10893E]"></span>
              <span className="text-sm font-bold text-[#0A2F1D]">Data Synced: Just Now</span>
            </div>
          </div>
        </header>

        {/* --- HORIZONTAL MARKET HIGHLIGHTS (New UI Element) --- */}
        <div className={`flex space-x-4 overflow-x-auto hide-scrollbar mb-8 pb-2 transition-all duration-300 ease-out delay-100 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {[
            { label: "Top Gainer", crop: "Mustard", mandi: "Jalandhar", price: "₹5,450", change: "+5.2%", color: "text-[#10893E]", bg: "bg-[#E9F3E8]" },
            { label: "High Volume", crop: "Wheat", mandi: "Ludhiana", price: "₹2,275", change: "+1.2%", color: "text-[#10893E]", bg: "bg-[#E9F3E8]" },
            { label: "Top Loser", crop: "Cotton", mandi: "Bathinda", price: "₹6,800", change: "-2.1%", color: "text-red-500", bg: "bg-red-50" },
            { label: "Trending", crop: "Potato", mandi: "Jalandhar", price: "₹1,150", change: "+3.8%", color: "text-[#10893E]", bg: "bg-[#E9F3E8]" },
          ].map((stat, idx) => (
            <div key={idx} className="glass-panel min-w-[200px] p-4 rounded-2xl flex-shrink-0 group hover:-translate-y-1 transition-all duration-200 cursor-pointer">
              <p className="text-[10px] font-black text-[#627768] uppercase tracking-widest mb-2">{stat.label}</p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="font-bold text-[#0A2F1D] leading-tight">{stat.crop}</p>
                  <p className="text-xs font-medium text-[#8A9A90]">{stat.mandi}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-[#0A2F1D]">{stat.price}</p>
                  <p className={`text-[10px] font-bold ${stat.color} ${stat.bg} px-1.5 py-0.5 rounded-sm mt-0.5 inline-block`}>{stat.change}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- MAIN TERMINAL DATA TABLE --- */}
        <div className={`flex-1 glass-panel rounded-[2rem] flex flex-col overflow-hidden transition-all duration-300 ease-out delay-200 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          
          {/* Table Header Controls */}
          <div className="p-4 md:p-6 border-b border-white/40 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/30 backdrop-blur-md">
            
            {/* Tab Toggles */}
            <div className="flex space-x-1 bg-white/50 p-1 rounded-xl shadow-inner w-full md:w-auto overflow-x-auto hide-scrollbar">
              {['All Crops', 'My Favorites', 'Nearby Mandis'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all duration-150 ${
                    activeTab === tab 
                    ? 'bg-white text-[#0A2F1D] shadow-[0_2px_10px_rgba(10,47,29,0.1)]' 
                    : 'text-[#627768] hover:text-[#0A2F1D]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search and Filter */}
            <div className="flex w-full md:w-auto space-x-3">
              <div className="relative flex-1 md:w-64">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">🔍</span>
                <input 
                  type="text" 
                  placeholder="Search crop or mandi..." 
                  className="w-full pl-9 pr-4 py-2 text-sm bg-white/70 border border-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10893E] text-[#0A2F1D] font-medium placeholder-[#8A9A90] shadow-inner transition-colors duration-150"
                />
              </div>
              <button className="px-4 py-2 bg-white/70 text-[#0A2F1D] border border-white rounded-xl text-sm font-bold shadow-sm hover:bg-white transition-all duration-150 flex items-center">
                <span>📍 Punjab</span> <span className="ml-2 text-xs">▼</span>
              </button>
            </div>
          </div>

          {/* The Data Grid */}
          <div className="flex-1 overflow-auto hide-scrollbar relative">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-[#EBE5D9]/90 backdrop-blur-xl z-10 shadow-sm">
                <tr>
                  <th className="py-4 px-6 text-xs font-black text-[#627768] uppercase tracking-widest">Commodity</th>
                  <th className="py-4 px-6 text-xs font-black text-[#627768] uppercase tracking-widest">APMC / Mandi</th>
                  <th className="py-4 px-6 text-xs font-black text-[#627768] uppercase tracking-widest text-right">Min (₹)</th>
                  <th className="py-4 px-6 text-xs font-black text-[#627768] uppercase tracking-widest text-right">Max (₹)</th>
                  <th className="py-4 px-6 text-xs font-black text-[#0A2F1D] uppercase tracking-widest text-right">Modal Avg (₹)</th>
                  <th className="py-4 px-6 text-xs font-black text-[#627768] uppercase tracking-widest text-center">7-Day Trend</th>
                  <th className="py-4 px-6 text-xs font-black text-[#627768] uppercase tracking-widest text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { icon: "🌾", name: "Wheat (Lok-1)", mandi: "Ludhiana", min: "2,200", max: "2,350", modal: "2,275", trend: "up", change: "+1.2%" },
                  { icon: "🌾", name: "Wheat (Other)", mandi: "Khanna", min: "2,150", max: "2,280", modal: "2,203", trend: "down", change: "-0.5%" },
                  { icon: "🌻", name: "Mustard", mandi: "Jalandhar", min: "5,300", max: "5,600", modal: "5,450", trend: "up", change: "+3.1%" },
                  { icon: "🌿", name: "Cotton (Desi)", mandi: "Moga", min: "6,900", max: "7,150", modal: "7,020", trend: "up", change: "+1.8%" },
                  { icon: "🥔", name: "Potato", mandi: "Amritsar", min: "1,000", max: "1,200", modal: "1,100", trend: "neutral", change: "0.0%" },
                  { icon: "🧅", name: "Onion", mandi: "Patiala", min: "1,800", max: "2,400", modal: "2,150", trend: "down", change: "-4.2%" },
                  { icon: "🍅", name: "Tomato", mandi: "Ludhiana", min: "1,500", max: "2,800", modal: "2,100", trend: "up", change: "+8.5%" },
                  { icon: "🌽", name: "Maize", mandi: "Khanna", min: "2,050", max: "2,180", modal: "2,110", trend: "neutral", change: "+0.1%" },
                ].map((row, idx) => (
                  <tr key={idx} className="glass-row hover:bg-white/60 transition-colors duration-150 group cursor-pointer">
                    
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl bg-white/50 w-8 h-8 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200">{row.icon}</span>
                        <span className="font-bold text-[#0A2F1D]">{row.name}</span>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6 text-[#627768] font-medium group-hover:text-[#0A2F1D] transition-colors duration-150">
                      {row.mandi}
                    </td>
                    
                    <td className="py-4 px-6 text-right font-medium text-[#8A9A90]">
                      {row.min}
                    </td>
                    
                    <td className="py-4 px-6 text-right font-medium text-[#8A9A90]">
                      {row.max}
                    </td>
                    
                    <td className="py-4 px-6 text-right">
                      <span className="font-black text-[#0A2F1D] text-lg">{row.modal}</span>
                    </td>
                    
                    {/* Inline SVG Sparkline */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col items-center justify-center">
                        <svg width="60" height="20" viewBox="0 0 60 20" className="overflow-visible">
                          {row.trend === 'up' && (
                            <path d="M0,15 L15,12 L30,14 L45,5 L60,2" fill="none" stroke="#10893E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_2px_3px_rgba(16,137,62,0.4)]" />
                          )}
                          {row.trend === 'down' && (
                            <path d="M0,5 L15,8 L30,6 L45,15 L60,18" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_2px_3px_rgba(239,68,68,0.4)]" />
                          )}
                          {row.trend === 'neutral' && (
                            <path d="M0,10 L15,9 L30,11 L45,10 L60,10" fill="none" stroke="#FBC02D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_2px_3px_rgba(251,192,45,0.4)]" />
                          )}
                        </svg>
                        <span className={`text-[10px] font-bold mt-1 ${row.trend === 'up' ? 'text-[#10893E]' : row.trend === 'down' ? 'text-red-500' : 'text-[#D49800]'}`}>
                          {row.change}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-center">
                      <button className="opacity-0 group-hover:opacity-100 px-3 py-1.5 bg-[#0A2F1D] text-white text-xs font-bold rounded-lg shadow-md hover:bg-[#10893E] hover:-translate-y-0.5 transition-all duration-150">
                        Sell Now
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </main>
    </div>
  );
}