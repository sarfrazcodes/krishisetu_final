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
    <main className="flex-1 h-full p-4 md:p-8 relative z-10 flex flex-col w-full overflow-x-hidden">
      
      <header className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-6 transition-all duration-300 ease-out transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0A2F1D] mb-1 drop-shadow-sm">Mandi Intel Terminal</h1>
          <p className="text-[#627768] font-medium text-sm md:text-base">Real-time APMC prices and 7-day market trends.</p>
        </div>
        
        <div className="bg-white border border-[#E2DFD3] shadow-sm px-3 md:px-4 py-2 rounded-xl flex items-center space-x-2 w-full md:w-auto justify-center md:justify-start">
          <span className="w-2 h-2 rounded-full bg-[#10893E] animate-pulse shadow-[0_0_5px_#10893E]"></span>
          <span className="text-xs md:text-sm font-bold text-[#0A2F1D]">Data Synced: Just Now</span>
        </div>
      </header>

      {/* --- HORIZONTAL MARKET HIGHLIGHTS --- */}
      <div className={`flex space-x-3 md:space-x-4 overflow-x-auto hide-scrollbar mb-6 md:mb-8 pb-2 w-full transition-all duration-300 ease-out delay-100 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {[
          { label: "Top Gainer", crop: "Mustard", mandi: "Jalandhar", price: "₹5,450", change: "+5.2%", color: "text-[#10893E]", bg: "bg-[#E9F3E8]" },
          { label: "High Volume", crop: "Wheat", mandi: "Ludhiana", price: "₹2,275", change: "+1.2%", color: "text-[#10893E]", bg: "bg-[#E9F3E8]" },
          { label: "Top Loser", crop: "Cotton", mandi: "Bathinda", price: "₹6,800", change: "-2.1%", color: "text-red-500", bg: "bg-red-50" },
          { label: "Trending", crop: "Potato", mandi: "Jalandhar", price: "₹1,150", change: "+3.8%", color: "text-[#10893E]", bg: "bg-[#E9F3E8]" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white border border-[#E2DFD3] shadow-sm min-w-[180px] md:min-w-[200px] p-3 md:p-4 rounded-xl md:rounded-2xl flex-shrink-0 group hover:-translate-y-1 transition-all duration-200 cursor-pointer">
            <p className="text-[8px] md:text-[10px] font-black text-[#627768] uppercase tracking-widest mb-1 md:mb-2">{stat.label}</p>
            <div className="flex justify-between items-end">
              <div>
                <p className="font-bold text-[#0A2F1D] text-sm md:text-base leading-tight">{stat.crop}</p>
                <p className="text-[10px] md:text-xs font-medium text-[#8A9A90]">{stat.mandi}</p>
              </div>
              <div className="text-right">
                <p className="font-black text-[#0A2F1D] text-sm md:text-base">{stat.price}</p>
                <p className={`text-[8px] md:text-[10px] font-bold ${stat.color} ${stat.bg} px-1.5 py-0.5 rounded-sm mt-0.5 inline-block`}>{stat.change}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- MAIN TERMINAL DATA TABLE --- */}
      <div className={`flex-1 bg-white border border-[#E2DFD3] shadow-sm rounded-2xl md:rounded-[2rem] flex flex-col overflow-hidden transition-all duration-300 ease-out delay-200 transform w-full ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* Table Header Controls */}
        <div className="p-3 md:p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 md:gap-4 bg-white">
          
          {/* Tab Toggles (Scrollable) */}
          <div className="flex space-x-1 bg-slate-50 p-1 rounded-xl w-full lg:w-auto overflow-x-auto hide-scrollbar">
            {['All Crops', 'My Favorites', 'Nearby Mandis'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-bold whitespace-nowrap transition-all duration-150 shrink-0 ${
                  activeTab === tab ? 'bg-white text-[#0A2F1D] shadow-sm border border-gray-200' : 'text-[#627768] hover:text-[#0A2F1D]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row w-full lg:w-auto space-y-2 sm:space-y-0 sm:space-x-2 md:space-x-3">
            <div className="relative flex-1 sm:w-64">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">🔍</span>
              <input type="text" placeholder="Search crop or mandi..." className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10893E] text-[#0A2F1D] font-medium placeholder-[#8A9A90] transition-colors" />
            </div>
            <button className="px-4 py-2 bg-slate-50 text-[#0A2F1D] border border-gray-200 rounded-xl text-sm font-bold hover:bg-white transition-all flex justify-center items-center">
              <span>📍 Punjab</span> <span className="ml-2 text-xs">▼</span>
            </button>
          </div>
        </div>

        {/* The Data Grid - Force horizontal scroll on mobile */}
        <div className="flex-1 w-full overflow-x-auto hide-scrollbar relative">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="sticky top-0 bg-slate-50 z-10 border-b border-gray-200">
              <tr>
                <th className="py-3 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-black text-[#627768] uppercase tracking-widest">Commodity</th>
                <th className="py-3 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-black text-[#627768] uppercase tracking-widest">APMC / Mandi</th>
                <th className="py-3 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-black text-[#627768] uppercase tracking-widest text-right">Min (₹)</th>
                <th className="py-3 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-black text-[#627768] uppercase tracking-widest text-right">Max (₹)</th>
                <th className="py-3 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-black text-[#0A2F1D] uppercase tracking-widest text-right">Modal Avg (₹)</th>
                <th className="py-3 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-black text-[#627768] uppercase tracking-widest text-center">7-Day Trend</th>
                <th className="py-3 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-black text-[#627768] uppercase tracking-widest text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { icon: "🌾", name: "Wheat (Lok-1)", mandi: "Ludhiana", min: "2,200", max: "2,350", modal: "2,275", trend: "up", change: "+1.2%" },
                { icon: "🌻", name: "Mustard", mandi: "Jalandhar", min: "5,300", max: "5,600", modal: "5,450", trend: "up", change: "+3.1%" },
                { icon: "🥔", name: "Potato", mandi: "Amritsar", min: "1,000", max: "1,200", modal: "1,100", trend: "neutral", change: "0.0%" },
                { icon: "🧅", name: "Onion", mandi: "Patiala", min: "1,800", max: "2,400", modal: "2,150", trend: "down", change: "-4.2%" }
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-slate-50 transition-colors duration-150 group cursor-pointer">
                  <td className="py-3 md:py-4 px-4 md:px-6">
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <span className="text-lg md:text-xl bg-white border border-gray-100 w-6 h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center shadow-sm">{row.icon}</span>
                      <span className="font-bold text-sm md:text-base text-[#0A2F1D]">{row.name}</span>
                    </div>
                  </td>
                  <td className="py-3 md:py-4 px-4 md:px-6 text-[#627768] text-sm md:text-base font-medium">{row.mandi}</td>
                  <td className="py-3 md:py-4 px-4 md:px-6 text-right text-sm md:text-base font-medium text-[#8A9A90]">{row.min}</td>
                  <td className="py-3 md:py-4 px-4 md:px-6 text-right text-sm md:text-base font-medium text-[#8A9A90]">{row.max}</td>
                  <td className="py-3 md:py-4 px-4 md:px-6 text-right"><span className="font-black text-[#0A2F1D] text-base md:text-lg">{row.modal}</span></td>
                  <td className="py-3 md:py-4 px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center">
                      <span className={`text-[10px] font-bold ${row.trend === 'up' ? 'text-[#10893E]' : row.trend === 'down' ? 'text-red-500' : 'text-[#D49800]'}`}>{row.change}</span>
                    </div>
                  </td>
                  <td className="py-3 md:py-4 px-4 md:px-6 text-center">
                    <div className="px-2 md:px-3 py-1 bg-[#0A2F1D] text-white text-[10px] md:text-xs font-bold rounded-md shadow-md inline-block">
                      {row.trend === 'up' ? 'Rise' : row.trend === 'down' ? 'Fall' : 'Stable'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}