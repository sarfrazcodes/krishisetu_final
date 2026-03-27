"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, Filter, MapPin, ShieldCheck, Phone, Award
} from "lucide-react";
import Link from "next/link";

// --- MOCK DATA (Updated with Phone Numbers) ---
const farmerNetwork = [
  {
    id: "F-001",
    name: "Harpreet Singh",
    phone: "+91 98123 45678",
    location: "Ludhiana, Punjab",
    distance: "12 km",
    isVerified: true,
    isPremium: false,
    avatar: "🧑🏽‍🌾"
  },
  {
    id: "F-002",
    name: "Manjit Farms",
    phone: "+91 98765 11111",
    location: "Amritsar, Punjab",
    distance: "8 km",
    isVerified: true,
    isPremium: true,
    avatar: "🌿"
  },
  {
    id: "F-003",
    name: "Gurdeep Agro",
    phone: "+91 99887 66554",
    location: "Jalandhar, Punjab",
    distance: "45 km",
    isVerified: true,
    isPremium: false,
    avatar: "👨🏽‍🌾"
  },
  {
    id: "F-004",
    name: "Kisan Cooperative",
    phone: "+91 88776 55443",
    location: "Karnal, Haryana",
    distance: "120 km",
    isVerified: true,
    isPremium: true,
    avatar: "🤝"
  },
  {
    id: "F-005",
    name: "Ramesh Produce",
    phone: "+91 77665 44332",
    location: "Moga, Punjab",
    distance: "55 km",
    isVerified: false,
    isPremium: false,
    avatar: "🌾"
  }
];

export default function FarmerNetworkPage() {
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
            <ShieldCheck className="w-8 h-8 text-[#10893E]" /> Farmer Network
          </h1>
          <p className="text-[#627768] font-medium">Manage your sourcing partners and trusted suppliers.</p>
        </div>
        
        <div className="flex space-x-4 items-center">
          <Link href="/buyer-dashboard/notifications">
            <button className="bg-white border border-[#E2DFD3] shadow-sm p-3 rounded-xl text-xl hover:scale-110 hover:-translate-y-1 transition-all relative">
              🔔<span className="absolute top-2 right-2 w-2 h-2 bg-[#FBC02D] rounded-full shadow-[0_0_8px_#FBC02D]"></span>
            </button>
          </Link>
          {/* <button className="bg-[#10893E] text-white px-6 py-3 rounded-xl font-bold shadow-[0_6px_0_0_#0D7334] hover:shadow-[0_2px_0_0_#0D7334] hover:translate-y-[4px] active:translate-y-[6px] active:shadow-none transition-all duration-150">
            + Invite Farmer
          </button> */}
        </div>
      </header>

      {/* --- SEARCH & FILTER BAR --- */}
      <div className="bg-white border border-[#E2DFD3] shadow-sm p-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A9A90] w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by farmer name or location..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10893E] text-[#0A2F1D] font-medium shadow-inner transition-colors"
          />
        </div>
        
        <div className="flex space-x-3 w-full md:w-auto overflow-x-auto hide-scrollbar pb-2 md:pb-0">
          {['All Partners', 'Top Rated', 'Organic Certified'].map((filter, idx) => (
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
            <Filter className="w-4 h-4" /> Sort
          </button>
        </div>
      </div>

      {/* --- FARMER CONTACT GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {farmerNetwork.map((farmer) => (
          <div 
            key={farmer.id} 
            className={`bg-white border border-[#E2DFD3] shadow-sm p-6 rounded-[2.5rem] hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(10,47,29,0.08)] transition-all duration-300 group flex flex-col justify-between relative overflow-hidden ${
              farmer.isPremium ? 'border-t-4 border-t-[#FBC02D]' : ''
            }`}
          >
            {/* Premium Glow Effect */}
            {farmer.isPremium && (
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#FBC02D] rounded-full mix-blend-multiply filter blur-[50px] opacity-20 pointer-events-none"></div>
            )}

            <div>
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-white/80 border border-white flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                    {farmer.avatar}
                  </div>
                  <div>
                    <h3 className="font-black text-[#0A2F1D] text-xl leading-tight flex items-center gap-1">
                      {farmer.name} 
                      {farmer.isVerified && <ShieldCheck className="w-5 h-5 text-[#10893E]" />}
                    </h3>
                    {farmer.isPremium ? (
                      <span className="text-[10px] font-black text-[#0A2F1D] bg-[#FBC02D] px-2 py-0.5 rounded-sm tracking-wide uppercase shadow-sm flex items-center gap-1 mt-1 w-fit">
                        <Award className="w-3 h-3" /> Premium Partner
                      </span>
                    ) : (
                      <span className="text-[10px] font-black text-[#10893E] bg-[#E9F3E8] px-2 py-0.5 rounded-sm border border-[#CDE0C3] tracking-wide uppercase mt-1 inline-block">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Direct Contact Info Box */}
              <div className="bg-white/50 rounded-2xl p-5 border border-white/60 shadow-inner mb-6 relative z-10">
                <p className="text-xs font-bold text-[#8A9A90] uppercase tracking-wider mb-1">Direct Contact</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#10893E]/10 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-[#10893E]" />
                  </div>
                  <p className="font-black text-[#0A2F1D] text-xl tracking-wide">{farmer.phone}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm mb-6 relative z-10">
                <span className="font-bold text-[#0A2F1D] flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-[#10893E]" /> {farmer.location}
                </span>
                <span className="font-bold text-[#627768] bg-white/50 px-2 py-1 rounded-md">{farmer.distance}</span>
              </div>
            </div>

            {/* ACTION BUTTON (Only Call Now) */}
            <a 
              href={`tel:${farmer.phone.replace(/\s+/g, '')}`}
              className="w-full relative z-10 py-3.5 bg-gradient-to-b from-[#14A049] to-[#10893E] text-white rounded-xl font-black shadow-[0_4px_10px_rgba(16,137,62,0.3)] hover:shadow-[0_6px_15px_rgba(16,137,62,0.4)] hover:-translate-y-1 transition-all border border-[#0A2F1D]/20 flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" /> Call {farmer.name.split(' ')[0]}
            </a>
          </div>
        ))}
      </div>

    </main>
  );
}
