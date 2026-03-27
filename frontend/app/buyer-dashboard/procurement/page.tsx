"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Filter, MapPin } from "lucide-react";

export default function ProcurementPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="p-4 md:p-8 relative z-10 w-full">
      {/* HEADER */}
      <header className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-10 transition-all duration-300 ease-out transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#0A2F1D] mb-1 drop-shadow-sm">Procurement Market</h1>
          <p className="text-[#627768] font-medium">Browse verified farmer harvests and secure your supply.</p>
        </div>
        
        {/* ACTION BUTTONS (BELL & NEW REQUEST LINKED HERE) */}
        <div className="mt-4 md:mt-0 flex space-x-4 items-center">
          
          {/* Linked Bell Icon */}
          <Link href="/buyer-dashboard/notifications">
            <button className="glass-panel p-3 rounded-xl text-xl hover:scale-110 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(10,47,29,0.1)] transition-all duration-150 relative group">
              <span className="group-hover:rotate-12 transition-transform inline-block">🔔</span>
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#FBC02D] rounded-full shadow-[0_0_8px_#FBC02D] animate-pulse"></span>
            </button>
          </Link>

          {/* Linked New Request Button */}
          <Link href="/buyer-dashboard/new-request">
            <button className="bg-[#10893E] text-white px-6 py-3 rounded-xl font-bold shadow-[0_6px_0_0_#0D7334] hover:shadow-[0_2px_0_0_#0D7334] hover:translate-y-[4px] active:translate-y-[6px] active:shadow-none transition-all duration-150">
              + New Request
            </button>
          </Link>

        </div>
      </header>

      {/* --- SEARCH & FILTER GLASS BAR --- */}
      <div className={`glass-panel p-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 items-center justify-between transition-all duration-300 ease-out transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex-1 w-full relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A9A90] w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search for crops, farmers, or regions..." 
            className="w-full pl-12 pr-4 py-3 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10893E] text-[#0A2F1D] font-medium placeholder-[#8A9A90] shadow-inner transition-colors duration-150"
          />
        </div>
        <div className="flex space-x-3 w-full md:w-auto overflow-x-auto hide-scrollbar pb-2 md:pb-0">
          {['All', '🌾 Wheat', '🌻 Mustard', '🥔 Potato'].map((filter, idx) => (
            <button key={idx} className={`px-5 py-3 rounded-xl font-bold whitespace-nowrap transition-all duration-150 ${idx === 0 ? 'bg-[#0A2F1D] text-white shadow-md' : 'bg-white/60 text-[#627768] hover:bg-white hover:text-[#0A2F1D] hover:shadow-sm border border-transparent hover:border-[#E2DFD3]'}`}>
              {filter}
            </button>
          ))}
          <button className="px-4 py-3 bg-white/60 text-[#627768] rounded-xl font-bold hover:bg-white hover:text-[#0A2F1D] transition-all duration-150 border border-transparent hover:border-[#E2DFD3] flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      {/* --- BENTO BOX GRID: FARMER HARVESTS --- */}
      <div className="mb-6 flex justify-between items-end">
        <h2 className="text-2xl font-black text-[#0A2F1D] drop-shadow-sm">Live Farmer Harvests</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        
        {/* FARMER CARD 1 */}
        <div className={`glass-panel p-6 rounded-[2rem] group hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(10,47,29,0.15)] transition-all duration-200 transform flex flex-col justify-between ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E2DFD3] to-white flex items-center justify-center text-xl shadow-sm border border-white">🧑🏽‍🌾</div>
                <div>
                  <h3 className="font-bold text-[#0A2F1D] leading-tight">Harpreet Singh</h3>
                  <span className="text-[10px] font-black text-[#10893E] bg-[#E9F3E8] px-2 py-0.5 rounded-sm border border-[#CDE0C3] tracking-wide uppercase">✓ Verified Farmer</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#627768] bg-white/80 px-2 py-1 rounded-md shadow-sm flex items-center gap-1"><MapPin className="w-3 h-3"/> 12 km</span>
              </div>
            </div>
            
            <div className="my-5 p-4 bg-white/60 rounded-2xl border border-white/80 shadow-inner group-hover:bg-white transition-colors duration-200">
              <p className="text-xs font-bold text-[#8A9A90] uppercase tracking-wider mb-1">Available Crop</p>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🌾</span>
                <span className="text-xl font-black text-[#0A2F1D]">Wheat (Lok-1)</span>
              </div>
              <div className="mt-3 flex justify-between items-end">
                <div>
                  <p className="text-xs font-medium text-[#627768]">Available Stock</p>
                  <p className="font-bold text-[#0A2F1D]">150 Quintals</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-[#627768]">Asking Price</p>
                  <p className="text-2xl font-black text-[#10893E]">₹2,450<span className="text-sm">/q</span></p>
                </div>
              </div>
            </div>
          </div>

          <button className="w-full py-3 bg-gradient-to-b from-[#FCD14D] to-[#FBC02D] text-[#0A2F1D] rounded-xl font-black shadow-[0_6px_0_0_#D49800,0_10px_20px_rgba(251,192,45,0.3)] hover:shadow-[0_2px_0_0_#D49800,0_10px_20px_rgba(251,192,45,0.4)] hover:translate-y-[4px] active:translate-y-[6px] active:shadow-none transition-all duration-150 border border-[#F5B921]">
            Send Offer
          </button>
        </div>

        {/* FARMER CARD 2 */}
        <div className={`glass-panel p-6 rounded-[2rem] group hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(10,47,29,0.15)] transition-all duration-200 transform flex flex-col justify-between ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E2DFD3] to-white flex items-center justify-center text-xl shadow-sm border border-white">👨🏽‍🌾</div>
                <div>
                  <h3 className="font-bold text-[#0A2F1D] leading-tight">Gurdeep Agro</h3>
                  <span className="text-[10px] font-black text-[#10893E] bg-[#E9F3E8] px-2 py-0.5 rounded-sm border border-[#CDE0C3] tracking-wide uppercase">✓ Verified Farmer</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#627768] bg-white/80 px-2 py-1 rounded-md shadow-sm flex items-center gap-1"><MapPin className="w-3 h-3"/> 45 km</span>
              </div>
            </div>
            
            <div className="my-5 p-4 bg-white/60 rounded-2xl border border-white/80 shadow-inner group-hover:bg-white transition-colors duration-200">
              <p className="text-xs font-bold text-[#8A9A90] uppercase tracking-wider mb-1">Available Crop</p>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🥔</span>
                <span className="text-xl font-black text-[#0A2F1D]">Potato (Kufri)</span>
              </div>
              <div className="mt-3 flex justify-between items-end">
                <div>
                  <p className="text-xs font-medium text-[#627768]">Available Stock</p>
                  <p className="font-bold text-[#0A2F1D]">80 Quintals</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-[#627768]">Asking Price</p>
                  <p className="text-2xl font-black text-[#10893E]">₹1,150<span className="text-sm">/q</span></p>
                </div>
              </div>
            </div>
          </div>

          <button className="w-full py-3 bg-gradient-to-b from-[#FCD14D] to-[#FBC02D] text-[#0A2F1D] rounded-xl font-black shadow-[0_6px_0_0_#D49800,0_10px_20px_rgba(251,192,45,0.3)] hover:shadow-[0_2px_0_0_#D49800,0_10px_20px_rgba(251,192,45,0.4)] hover:translate-y-[4px] active:translate-y-[6px] active:shadow-none transition-all duration-150 border border-[#F5B921]">
            Send Offer
          </button>
        </div>

        {/* FARMER CARD 3 (Premium Indicator) */}
        <div className={`bg-gradient-to-br from-[#14A049] to-[#0A2F1D] p-6 rounded-[2rem] border border-[#1A6B3D] text-white shadow-[0_15px_35px_rgba(10,47,29,0.3)] hover:shadow-[0_25px_50px_rgba(10,47,29,0.5)] transition-all duration-200 transform hover:-translate-y-2 flex flex-col justify-between relative overflow-hidden group ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-[#FBC02D] rounded-full mix-blend-screen filter blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl shadow-sm border border-white/20 backdrop-blur-sm">🌿</div>
                <div>
                  <h3 className="font-bold text-white leading-tight">Manjit Farms</h3>
                  <span className="text-[10px] font-black text-[#0A2F1D] bg-[#FBC02D] px-2 py-0.5 rounded-sm tracking-wide uppercase shadow-sm">⭐ Organic Certified</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-white/90 bg-black/20 px-2 py-1 rounded-md backdrop-blur-sm flex items-center gap-1"><MapPin className="w-3 h-3"/> 8 km</span>
              </div>
            </div>
            
            <div className="my-5 p-4 bg-black/20 rounded-2xl border border-white/10 shadow-inner group-hover:bg-black/30 transition-colors duration-200 backdrop-blur-sm">
              <p className="text-xs font-bold text-green-200 uppercase tracking-wider mb-1">Available Crop</p>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🌻</span>
                <span className="text-xl font-black text-white">Mustard Seed (Organic)</span>
              </div>
              <div className="mt-3 flex justify-between items-end">
                <div>
                  <p className="text-xs font-medium text-green-200">Available Stock</p>
                  <p className="font-bold text-white">40 Quintals</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-green-200">Asking Price</p>
                  <p className="text-2xl font-black text-[#FBC02D]">₹6,200<span className="text-sm">/q</span></p>
                </div>
              </div>
            </div>
          </div>

          <button className="w-full relative z-10 py-3 bg-white text-[#0A2F1D] rounded-xl font-black shadow-[0_6px_0_0_#CDE0C3,0_10px_20px_rgba(255,255,255,0.2)] hover:shadow-[0_2px_0_0_#CDE0C3,0_10px_20px_rgba(255,255,255,0.3)] hover:translate-y-[4px] active:translate-y-[6px] active:shadow-none transition-all duration-150">
            Send Offer
          </button>
        </div>

      </div>
    </main>
  );
}