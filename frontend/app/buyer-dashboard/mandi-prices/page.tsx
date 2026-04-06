"use client";

import React, { useState, useEffect } from "react";
import { Search, MapPin, TrendingUp, TrendingDown, ArrowRight, Scale } from "lucide-react";
import Link from "next/link";

const mandiData = [
  { id: 1, market: "Ludhiana Central", distance: "12 km", commodity: "Wheat", price: "₹2,275", unit: "q", trend: "+₹15", isUp: true, lastUpdated: "10 mins ago", icon: "🌾" },
  { id: 2, market: "Jalandhar APMC", distance: "45 km", commodity: "Potato", price: "₹1,100", unit: "q", trend: "-₹25", isUp: false, lastUpdated: "1 hour ago", icon: "🥔" },
  { id: 3, market: "Amritsar Market", distance: "80 km", commodity: "Mustard", price: "₹5,450", unit: "q", trend: "+₹30", isUp: true, lastUpdated: "20 mins ago", icon: "🌻" },
  { id: 4, market: "Khanna APMC", distance: "60 km", commodity: "Paddy", price: "₹2,203", unit: "q", trend: "-₹5", isUp: false, lastUpdated: "3 hours ago", icon: "🍚" }
];

export default function MandiRatesPage() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("All Crops");

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <main className="p-4 md:p-8 relative z-10 w-full animate-fade-in pb-24 overflow-x-hidden">
      
      <header className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-4xl font-black text-[#0A2F1D] mb-1 flex items-center gap-2">
          <Scale className="w-6 h-6 md:w-8 md:h-8 text-[#10893E]" /> Live Mandi Rates
        </h1>
        <p className="text-[#627768] font-medium text-sm md:text-base">Compare official regional prices.</p>
      </header>

      {/* SEARCH & FILTER (Dropdown instead of horizontal scroll) */}
      <div className="bg-white border border-[#E2DFD3] shadow-sm p-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A9A90] w-4 h-4" />
          <input 
            type="text" placeholder="Search commodity or mandi..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10893E] text-sm font-medium"
          />
        </div>
        
        <div className="relative w-full md:w-48">
          <select 
            value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)} 
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-[#0A2F1D] text-sm focus:outline-none appearance-none"
          >
            <option>All Crops</option><option>Wheat</option><option>Mustard</option><option>Potato</option>
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-[#8A9A90]">▼</span>
        </div>
      </div>

      {/* CHANGED TO grid-cols-2 for mobile! */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
        {mandiData.map((data) => (
          <div key={data.id} className="bg-white border border-[#E2DFD3] shadow-sm p-4 md:p-6 rounded-2xl md:rounded-[2rem] flex flex-col justify-between hover:-translate-y-1 transition-all">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-lg md:text-2xl shrink-0">
                  {data.icon}
                </div>
                <div>
                  <h3 className="font-black text-[#0A2F1D] text-sm md:text-lg leading-tight truncate">{data.commodity}</h3>
                  <span className="text-[8px] md:text-[10px] font-bold text-[#627768] uppercase bg-slate-50 px-1.5 py-0.5 rounded mt-0.5 inline-block">Per {data.unit}</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-1">
                  <div>
                    <p className="text-[8px] md:text-[10px] font-bold text-[#8A9A90] uppercase mb-0.5">Official Rate</p>
                    <h2 className="text-lg md:text-2xl font-black text-[#0A2F1D] leading-none">{data.price}</h2>
                  </div>
                  <div className={`flex items-center gap-0.5 font-black text-[10px] md:text-xs px-1.5 py-0.5 rounded w-fit ${data.isUp ? 'text-red-600 bg-red-50' : 'text-[#10893E] bg-[#10893E]/10'}`}>
                    {data.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />} {data.trend}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1 text-[10px] md:text-xs mb-4">
                <span className="font-bold text-[#0A2F1D] flex items-center gap-1 truncate"><MapPin className="w-3 h-3 text-[#10893E] shrink-0" /> {data.market}</span>
                <span className="font-bold text-[#627768] text-right">{data.distance} • {data.lastUpdated}</span>
              </div>
            </div>

            <Link href="/buyer-dashboard/procurement">
              <button className="w-full py-2 bg-white border border-[#E2DFD3] text-[#0A2F1D] rounded-lg font-bold hover:bg-[#10893E] hover:text-white transition-all flex items-center justify-center gap-1 text-xs md:text-sm">
                Source <ArrowRight className="w-3 h-3" />
              </button>
            </Link>
          </div>
        ))}
      </div>

    </main>
  );
}