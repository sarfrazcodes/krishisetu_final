"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, MapPin, ShieldCheck, Phone, Award } from "lucide-react";
import Link from "next/link";

const farmerNetwork = [
  { id: "F-001", name: "Harpreet Singh", phone: "+91 98123 45678", location: "Ludhiana", distance: "12 km", isVerified: true, isPremium: false, avatar: "🧑🏽‍🌾" },
  { id: "F-002", name: "Manjit Farms", phone: "+91 98765 11111", location: "Amritsar", distance: "8 km", isVerified: true, isPremium: true, avatar: "🌿" },
  { id: "F-003", name: "Gurdeep Agro", phone: "+91 99887 66554", location: "Jalandhar", distance: "45 km", isVerified: true, isPremium: false, avatar: "👨🏽‍🌾" },
  { id: "F-004", name: "Kisan Coop", phone: "+91 88776 55443", location: "Karnal", distance: "120 km", isVerified: true, isPremium: true, avatar: "🤝" }
];

export default function FarmerNetworkPage() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <main className="p-4 md:p-8 relative z-10 w-full animate-fade-in pb-24 overflow-x-hidden">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0A2F1D] mb-1 drop-shadow-sm flex items-center gap-2 md:gap-3">
            <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-[#10893E]" /> Farmer Network
          </h1>
          <p className="text-[#627768] font-medium text-sm md:text-base">Manage your sourcing partners and trusted suppliers.</p>
        </div>
        <Link href="/buyer-dashboard/notifications">
          <button className="bg-white border border-[#E2DFD3] shadow-sm p-3 rounded-xl text-lg md:text-xl hover:-translate-y-1 transition-all relative">
            🔔<span className="absolute top-2 right-2 w-2 h-2 bg-[#FBC02D] rounded-full"></span>
          </button>
        </Link>
      </header>

      {/* SEARCH & FILTER */}
      <div className="bg-white border border-[#E2DFD3] shadow-sm p-4 rounded-2xl md:rounded-[2rem] mb-6 md:mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A9A90] w-5 h-5" />
          <input type="text" placeholder="Search farmer or location..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10893E] text-[#0A2F1D] font-medium shadow-inner text-sm md:text-base" />
        </div>
        <div className="flex space-x-2 md:space-x-3 w-full lg:w-auto overflow-x-auto hide-scrollbar pb-2 lg:pb-0">
          {['All Partners', 'Top Rated', 'Organic'].map((filter, idx) => (
            <button key={idx} className={`px-4 md:px-5 py-2 md:py-3 rounded-xl font-bold whitespace-nowrap text-sm md:text-base transition-all shrink-0 ${idx === 0 ? 'bg-[#0A2F1D] text-white' : 'bg-slate-50 text-[#627768] border border-slate-200'}`}>
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* FARMER CONTACT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {farmerNetwork.map((farmer) => (
          <div key={farmer.id} className={`bg-white border border-[#E2DFD3] shadow-sm p-5 md:p-6 rounded-2xl md:rounded-[2rem] hover:-translate-y-1 transition-all flex flex-col justify-between relative overflow-hidden ${farmer.isPremium ? 'border-t-4 border-t-[#FBC02D]' : ''}`}>
            {farmer.isPremium && <div className="absolute top-0 right-0 w-24 h-24 bg-[#FBC02D] rounded-full blur-[40px] opacity-20 pointer-events-none"></div>}

            <div>
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6 relative z-10">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl md:text-3xl shadow-inner">
                  {farmer.avatar}
                </div>
                <div>
                  <h3 className="font-black text-[#0A2F1D] text-lg md:text-xl flex items-center gap-1">
                    {farmer.name} {farmer.isVerified && <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-[#10893E]" />}
                  </h3>
                  {farmer.isPremium ? (
                    <span className="text-[8px] md:text-[10px] font-black text-[#0A2F1D] bg-[#FBC02D] px-2 py-0.5 rounded-sm uppercase flex items-center gap-1 mt-1 w-fit"><Award className="w-3 h-3" /> Premium</span>
                  ) : (
                    <span className="text-[8px] md:text-[10px] font-black text-[#10893E] bg-[#E9F3E8] px-2 py-0.5 rounded-sm border border-[#CDE0C3] uppercase mt-1 inline-block">✓ Verified</span>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 shadow-inner mb-4 md:mb-6">
                <p className="text-[10px] font-bold text-[#8A9A90] uppercase tracking-wider mb-1">Direct Contact</p>
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#10893E]/10 flex items-center justify-center"><Phone className="w-3 h-3 md:w-4 md:h-4 text-[#10893E]" /></div>
                  <p className="font-black text-[#0A2F1D] text-base md:text-xl">{farmer.phone}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs md:text-sm mb-4 md:mb-6">
                <span className="font-bold text-[#0A2F1D] flex items-center gap-1 truncate"><MapPin className="w-3 h-3 md:w-4 md:h-4 text-[#10893E] shrink-0" /> {farmer.location}</span>
                <span className="font-bold text-[#627768] bg-slate-100 px-2 py-1 rounded-md shrink-0">{farmer.distance}</span>
              </div>
            </div>

            <a href={`tel:${farmer.phone.replace(/\s+/g, '')}`} className="w-full py-3 bg-[#10893E] text-white rounded-xl font-bold shadow-md hover:bg-[#0A2F1D] transition-colors flex items-center justify-center gap-2 text-sm md:text-base">
              <Phone className="w-4 h-4" /> Call {farmer.name.split(' ')[0]}
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}