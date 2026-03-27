"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function MarketplacePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="p-4 md:p-8 relative z-10 w-full">
      {/* HEADER */}
      <header className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-10 transition-all duration-300 ease-out transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#0A2F1D] mb-1 drop-shadow-sm">Direct Marketplace</h1>
          <p className="text-[#627768] font-medium">Connect with verified buyers and negotiate better prices.</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-4 items-center">
         <Link href="/farmer-dashboard/notifications">
  <button className="glass-panel p-3 rounded-xl text-xl hover:scale-110 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(10,47,29,0.1)] transition-all duration-150 relative group">
    {/* The Bell Icon */}
    <span className="group-hover:rotate-12 transition-transform inline-block">🔔</span>
    
    {/* The Notification Dot (Gold #FBC02D) */}
    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#FBC02D] rounded-full shadow-[0_0_8px_#FBC02D] animate-pulse"></span>
    
    {/* Optional: Tooltip on hover */}
    <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-[#0A2F1D] text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
      View Alerts
    </span>
  </button>
</Link>
        </div>
      </header>

      {/* --- SEARCH & FILTER GLASS BAR --- */}
      <div className={`glass-panel p-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 items-center justify-between transition-all duration-300 ease-out transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex-1 w-full relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
          <input 
            type="text" 
            placeholder="Search for crops, buyers, or locations..." 
            className="w-full pl-12 pr-4 py-3 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10893E] text-[#0A2F1D] font-medium placeholder-[#8A9A90] shadow-inner transition-colors duration-150"
          />
        </div>
        <div className="flex space-x-3 w-full md:w-auto overflow-x-auto hide-scrollbar pb-2 md:pb-0">
          {['All', '🌾 Wheat', '🌻 Mustard', '🥔 Potato'].map((filter, idx) => (
            <button key={idx} className={`px-5 py-3 rounded-xl font-bold whitespace-nowrap transition-all duration-150 ${idx === 0 ? 'bg-[#0A2F1D] text-white shadow-md' : 'bg-white/60 text-[#627768] hover:bg-white hover:text-[#0A2F1D] hover:shadow-sm border border-transparent hover:border-[#E2DFD3]'}`}>
              {filter}
            </button>
          ))}
          <button className="px-4 py-3 bg-white/60 text-[#627768] rounded-xl font-bold hover:bg-white hover:text-[#0A2F1D] transition-all duration-150 border border-transparent hover:border-[#E2DFD3] flex items-center">
            <span className="mr-2">⚙️</span> Filters
          </button>
        </div>
      </div>

      {/* --- BENTO BOX GRID: BUYER DEMANDS --- */}
      <div className="mb-6 flex justify-between items-end">
        <h2 className="text-2xl font-black text-[#0A2F1D] drop-shadow-sm">Live Buyer Demands</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        
        {/* BUYER CARD 1 */}
        <div className={`glass-panel p-6 rounded-[2rem] group hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(10,47,29,0.15)] transition-all duration-200 transform flex flex-col justify-between ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E2DFD3] to-white flex items-center justify-center text-xl shadow-sm border border-white">🏢</div>
                <div>
                  <h3 className="font-bold text-[#0A2F1D] leading-tight">Punjab Agro Foods</h3>
                  <span className="text-[10px] font-black text-[#10893E] bg-[#E9F3E8] px-2 py-0.5 rounded-sm border border-[#CDE0C3] tracking-wide uppercase">✓ Verified Buyer</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#627768] bg-white/80 px-2 py-1 rounded-md shadow-sm">📍 12 km</span>
              </div>
            </div>
            
            <div className="my-5 p-4 bg-white/60 rounded-2xl border border-white/80 shadow-inner group-hover:bg-white transition-colors duration-200">
              <p className="text-xs font-bold text-[#8A9A90] uppercase tracking-wider mb-1">Looking For</p>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🌾</span>
                <span className="text-xl font-black text-[#0A2F1D]">Wheat (Lok-1)</span>
              </div>
              <div className="mt-3 flex justify-between items-end">
                <div>
                  <p className="text-xs font-medium text-[#627768]">Quantity Required</p>
                  <p className="font-bold text-[#0A2F1D]">100 Quintals</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-[#627768]">Offered Price</p>
                  <p className="text-2xl font-black text-[#10893E]">₹2,500<span className="text-sm">/q</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Area: Contact Details & Accept Button */}
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#0A2F1D]/5">
            <div className="flex flex-col text-sm">
              <span className="font-bold text-[#0A2F1D] flex items-center gap-1">👤 Ramesh Kumar</span>
              <span className="font-semibold text-[#627768] flex items-center gap-1">📞 +91 98765 43210</span>
            </div>
            <Link 
              href="/farmer-dashboard/marketplace/accept-offer/offer-1"
              className="w-1/2 text-center py-3 bg-gradient-to-b from-[#FCD14D] to-[#FBC02D] text-[#0A2F1D] rounded-xl font-black shadow-[0_6px_0_0_#D49800,0_10px_20px_rgba(251,192,45,0.3)] hover:shadow-[0_2px_0_0_#D49800,0_10px_20px_rgba(251,192,45,0.4)] hover:translate-y-[4px] active:translate-y-[6px] active:shadow-none transition-all duration-150 border border-[#F5B921]"
            >
              Accept Offer
            </Link>
          </div>
        </div>

        {/* BUYER CARD 2 */}
        <div className={`glass-panel p-6 rounded-[2rem] group hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(10,47,29,0.15)] transition-all duration-200 transform flex flex-col justify-between ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E2DFD3] to-white flex items-center justify-center text-xl shadow-sm border border-white">🏭</div>
                <div>
                  <h3 className="font-bold text-[#0A2F1D] leading-tight">North India Mills</h3>
                  <span className="text-[10px] font-black text-[#10893E] bg-[#E9F3E8] px-2 py-0.5 rounded-sm border border-[#CDE0C3] tracking-wide uppercase">✓ Verified Buyer</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#627768] bg-white/80 px-2 py-1 rounded-md shadow-sm">📍 45 km</span>
              </div>
            </div>
            
            <div className="my-5 p-4 bg-white/60 rounded-2xl border border-white/80 shadow-inner group-hover:bg-white transition-colors duration-200">
              <p className="text-xs font-bold text-[#8A9A90] uppercase tracking-wider mb-1">Looking For</p>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🌻</span>
                <span className="text-xl font-black text-[#0A2F1D]">Mustard Seed</span>
              </div>
              <div className="mt-3 flex justify-between items-end">
                <div>
                  <p className="text-xs font-medium text-[#627768]">Quantity Required</p>
                  <p className="font-bold text-[#0A2F1D]">50 Quintals</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-[#627768]">Offered Price</p>
                  <p className="text-2xl font-black text-[#10893E]">₹6,050<span className="text-sm">/q</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Area: Contact Details & Accept Button */}
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#0A2F1D]/5">
            <div className="flex flex-col text-sm">
              <span className="font-bold text-[#0A2F1D] flex items-center gap-1">👤 Harpreet Singh</span>
              <span className="font-semibold text-[#627768] flex items-center gap-1">📞 +91 98765 11111</span>
            </div>
            <Link 
              href="/farmer-dashboard/marketplace/accept-offer/offer-2"
              className="w-1/2 text-center py-3 bg-gradient-to-b from-[#FCD14D] to-[#FBC02D] text-[#0A2F1D] rounded-xl font-black shadow-[0_6px_0_0_#D49800,0_10px_20px_rgba(251,192,45,0.3)] hover:shadow-[0_2px_0_0_#D49800,0_10px_20px_rgba(251,192,45,0.4)] hover:translate-y-[4px] active:translate-y-[6px] active:shadow-none transition-all duration-150 border border-[#F5B921]"
            >
              Accept Offer
            </Link>
          </div>
        </div>

        {/* BUYER CARD 3 (Premium Indicator) */}
        <div className={`bg-gradient-to-br from-[#14A049] to-[#0A2F1D] p-6 rounded-[2rem] border border-[#1A6B3D] text-white shadow-[0_15px_35px_rgba(10,47,29,0.3)] hover:shadow-[0_25px_50px_rgba(10,47,29,0.5)] transition-all duration-200 transform hover:-translate-y-2 flex flex-col justify-between relative overflow-hidden group ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-[#FBC02D] rounded-full mix-blend-screen filter blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl shadow-sm border border-white/20 backdrop-blur-sm">📦</div>
                <div>
                  <h3 className="font-bold text-white leading-tight">Fresh Retail Chain</h3>
                  <span className="text-[10px] font-black text-[#0A2F1D] bg-[#FBC02D] px-2 py-0.5 rounded-sm tracking-wide uppercase shadow-sm">⭐ Premium Buyer</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-white/90 bg-black/20 px-2 py-1 rounded-md backdrop-blur-sm">📍 8 km</span>
              </div>
            </div>
            
            <div className="my-5 p-4 bg-black/20 rounded-2xl border border-white/10 shadow-inner group-hover:bg-black/30 transition-colors duration-200 backdrop-blur-sm">
              <p className="text-xs font-bold text-green-200 uppercase tracking-wider mb-1">Looking For Urgent Delivery</p>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🥔</span>
                <span className="text-xl font-black text-white">Potato (Kufri)</span>
              </div>
              <div className="mt-3 flex justify-between items-end">
                <div>
                  <p className="text-xs font-medium text-green-200">Quantity Required</p>
                  <p className="font-bold text-white">20 Quintals</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-green-200">Offered Price</p>
                  <p className="text-2xl font-black text-[#FBC02D]">₹1,250<span className="text-sm">/q</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Area for Premium Card: Contact Details & Accept Button */}
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/10 relative z-10">
            <div className="flex flex-col text-sm">
              <span className="font-bold text-white flex items-center gap-1">👤 Priya Sharma</span>
              <span className="font-semibold text-green-200 flex items-center gap-1">📞 +91 98765 22222</span>
            </div>
            <Link 
              href="/farmer-dashboard/marketplace/accept-offer/offer-3"
              className="w-1/2 text-center py-3 bg-white text-[#0A2F1D] rounded-xl font-black shadow-[0_6px_0_0_#CDE0C3,0_10px_20px_rgba(255,255,255,0.2)] hover:shadow-[0_2px_0_0_#CDE0C3,0_10px_20px_rgba(255,255,255,0.3)] hover:translate-y-[4px] active:translate-y-[6px] active:shadow-none transition-all duration-150"
            >
              Accept Offer
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}