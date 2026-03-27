"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, Filter, MapPin, TrendingUp, TrendingDown, ArrowRight, Scale 
} from "lucide-react";
import Link from "next/link";

// --- MOCK DATA ---
const mandiData = [
  {
    id: 1,
    market: "Ludhiana Central Mandi",
    distance: "12 km",
    commodity: "Wheat (Lok-1)",
    price: "₹2,275",
    unit: "Quintal",
    trend: "+₹15",
    isUp: true,
    lastUpdated: "10 mins ago",
    icon: "🌾"
  },
  {
    id: 2,
    market: "Jalandhar APMC",
    distance: "45 km",
    commodity: "Potato (Kufri)",
    price: "₹1,100",
    unit: "Quintal",
    trend: "-₹25",
    isUp: false,
    lastUpdated: "1 hour ago",
    icon: "🥔"
  },
  {
    id: 3,
    market: "Amritsar Grain Market",
    distance: "80 km",
    commodity: "Mustard Seed",
    price: "₹5,450",
    unit: "Quintal",
    trend: "+₹30",
    isUp: true,
    lastUpdated: "20 mins ago",
    icon: "🌻"
  },
  {
    id: 4,
    market: "Khanna APMC",
    distance: "60 km",
    commodity: "Paddy (Grade A)",
    price: "₹2,203",
    unit: "Quintal",
    trend: "-₹5",
    isUp: false,
    lastUpdated: "3 hours ago",
    icon: "🍚"
  },
  {
    id: 5,
    market: "Karnal Mandi",
    distance: "120 km",
    commodity: "Basmati Rice",
    price: "₹4,100",
    unit: "Quintal",
    trend: "+₹50",
    isUp: true,
    lastUpdated: "Just now",
    icon: "🌾"
  },
  {
    id: 6,
    market: "Moga Produce Market",
    distance: "55 km",
    commodity: "Cotton",
    price: "₹6,800",
    unit: "Quintal",
    trend: "-₹110",
    isUp: false,
    lastUpdated: "5 hours ago",
    icon: "🌱"
  }
];

export default function MandiRatesPage() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="p-4 md:p-8 relative z-10 w-full animate-fade-in pb-24">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#0A2F1D] mb-1 drop-shadow-sm flex items-center gap-3">
            <Scale className="w-8 h-8 text-[#10893E]" /> Live Mandi Rates
          </h1>
          <p className="text-[#627768] font-medium">Compare official regional prices to negotiate better deals.</p>
        </div>
        
        <div className="flex space-x-4 items-center">
          <Link href="/buyer-dashboard/notifications">
            <button className="bg-white border border-[#E2DFD3] shadow-sm p-3 rounded-xl text-xl hover:scale-110 hover:-translate-y-1 transition-all relative">
              🔔<span className="absolute top-2 right-2 w-2 h-2 bg-[#FBC02D] rounded-full shadow-[0_0_8px_#FBC02D]"></span>
            </button>
          </Link>
        </div>
      </header>

      {/* --- SEARCH & FILTER BAR --- */}
      <div className="bg-white border border-[#E2DFD3] shadow-sm p-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A9A90] w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by commodity or market location..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10893E] text-[#0A2F1D] font-medium shadow-inner transition-colors"
          />
        </div>
        
        <div className="flex space-x-3 w-full md:w-auto overflow-x-auto hide-scrollbar pb-2 md:pb-0">
          {['All Crops', 'Wheat', 'Mustard', 'Potato'].map((filter, idx) => (
            <button 
              key={idx} 
              className={`px-5 py-3 rounded-xl font-bold whitespace-nowrap transition-all duration-150 ${
                idx === 0 
                ? 'bg-[#0A2F1D] text-white shadow-md' 
                : 'bg-white/60 text-[#627768] hover:bg-white hover:text-[#0A2F1D] border border-transparent hover:border-[#E2DFD3]'
              }`}
            >
              {filter}
            </button>
          ))}
          <button className="px-4 py-3 bg-white/60 text-[#627768] rounded-xl font-bold hover:bg-white hover:text-[#0A2F1D] transition-all duration-150 border border-transparent hover:border-[#E2DFD3] flex items-center gap-2">
            <Filter className="w-4 h-4" /> Distance
          </button>
        </div>
      </div>

      {/* --- LIVE RATES GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mandiData.map((data) => (
          <div 
            key={data.id} 
            className="bg-white border border-[#E2DFD3] shadow-sm p-6 rounded-[2rem] hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(10,47,29,0.08)] transition-all duration-300 group flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-[1rem] bg-white/80 border border-white flex items-center justify-center text-2xl shadow-inner group-hover:rotate-6 transition-transform">
                    {data.icon}
                  </div>
                  <div>
                    <h3 className="font-black text-[#0A2F1D] text-lg leading-tight">{data.commodity}</h3>
                    <span className="text-[10px] font-bold text-[#627768] uppercase tracking-wider bg-white/50 px-2 py-0.5 rounded-md mt-1 inline-block">
                      Per {data.unit}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white/40 rounded-2xl p-4 border border-white/60 shadow-inner mb-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs font-bold text-[#8A9A90] uppercase tracking-wider mb-1">Official Rate</p>
                    <h2 className="text-3xl font-black text-[#0A2F1D] leading-none">{data.price}</h2>
                  </div>
                  <div className={`flex items-center gap-1 font-black text-sm px-2 py-1 rounded-lg ${
                    data.isUp ? 'text-red-600 bg-red-50' : 'text-[#10893E] bg-[#10893E]/10'
                  }`}>
                    {data.isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {data.trend}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-bold text-[#0A2F1D] flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-[#10893E]" /> {data.market}
                </span>
                <span className="font-bold text-[#627768]">{data.distance}</span>
              </div>
              <p className="text-[10px] text-right font-bold text-[#8A9A90] uppercase tracking-widest">
                Updated {data.lastUpdated}
              </p>
            </div>

            <Link href="/buyer-dashboard/procurement">
              <button className="mt-5 w-full py-3 bg-white border border-[#EBE5D9] text-[#0A2F1D] rounded-xl font-bold shadow-sm hover:bg-[#10893E] hover:text-white hover:border-[#10893E] transition-all flex items-center justify-center gap-2 group/btn">
                Source Nearby <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        ))}
      </div>

    </main>
  );
}
