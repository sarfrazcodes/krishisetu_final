"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  TrendingUp, Truck, Package, Wallet, ArrowRight, MapPin, CheckCircle2 
} from "lucide-react";

export default function BuyerOverviewPage() {
  const [mounted, setMounted] = useState(false);
  const [userName, setUserName] = useState("Buyer");
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.name) setUserName(parsed.name.split(" ")[0]);
      } catch(e) {}
    }
  }, []);

  return (
    <main className="p-4 md:p-8 relative z-10 w-full animate-fade-in max-w-7xl mx-auto overflow-x-hidden">
      
      {/* HEADER */}
      <header className={`flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 md:mb-10 transition-all duration-300 ease-out transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="mb-4 lg:mb-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0A2F1D] mb-1 tracking-tight">Welcome, {userName}!</h1>
          <p className="text-[#627768] font-semibold text-sm md:text-lg">Track incoming shipments and market intelligence.</p>
        </div>
        
        <div className="flex flex-wrap gap-3 items-center w-full lg:w-auto">
          <Link href="/buyer-dashboard/notifications">
            <button className="bg-white border border-[#E2DFD3] shadow-sm p-3 md:p-3.5 rounded-xl text-xl hover:bg-slate-50 transition-all relative group">
              <span className="group-hover:rotate-12 transition-transform inline-block">🔔</span>
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border-2 border-white"></span>
            </button>
          </Link>
          <Link href="/buyer-dashboard/procurement" className="flex-1 sm:flex-none">
            <button className="w-full bg-[#10893E] text-white px-4 md:px-6 py-3 md:py-3.5 rounded-xl font-bold shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
              <span className="text-lg">+</span>
              <span className="whitespace-nowrap">New Request</span>
            </button>
          </Link>
        </div>
      </header>

      {/* STATS BENTO BOX (Responsive grid logic applied here) */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10 transition-all duration-300 ease-out transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        
        <div className="bg-white border border-[#E2DFD3] shadow-sm p-5 md:p-6 rounded-2xl md:rounded-[2rem] group">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform">
            <Wallet className="w-5 h-5 md:w-6 md:h-6 text-[#10893E]" />
          </div>
          <p className="text-xs md:text-sm font-bold text-[#627768] uppercase tracking-wider mb-1">Total Spend</p>
          <h3 className="text-2xl md:text-3xl font-black text-[#0A2F1D] tracking-tight">₹14.5L</h3>
          <p className="text-[10px] md:text-xs font-bold text-[#10893E] mt-1 md:mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12% from last month
          </p>
        </div>

        <div className="bg-white border border-[#E2DFD3] shadow-sm p-5 md:p-6 rounded-2xl md:rounded-[2rem] group">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform">
            <Package className="w-5 h-5 md:w-6 md:h-6 text-[#D49800]" />
          </div>
          <p className="text-xs md:text-sm font-bold text-[#627768] uppercase tracking-wider mb-1">Volume Procured</p>
          <h3 className="text-2xl md:text-3xl font-black text-[#0A2F1D] tracking-tight">850q</h3>
          <p className="text-[10px] md:text-xs font-bold text-[#627768] mt-1 md:mt-2">Across 3 commodities</p>
        </div>

        <div className="bg-white border border-[#E2DFD3] shadow-sm p-5 md:p-6 rounded-2xl md:rounded-[2rem] group">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#EBE5D9] flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform">
            <Truck className="w-5 h-5 md:w-6 md:h-6 text-[#0A2F1D]" />
          </div>
          <p className="text-xs md:text-sm font-bold text-[#627768] uppercase tracking-wider mb-1">Shipments</p>
          <h3 className="text-2xl md:text-3xl font-black text-[#0A2F1D] tracking-tight">4</h3>
          <p className="text-[10px] md:text-xs font-bold text-[#10893E] mt-1 md:mt-2">2 arriving today</p>
        </div>

        <div className="bg-gradient-to-br from-[#10893E] to-[#0A2F1D] p-5 md:p-6 rounded-2xl md:rounded-[2rem] text-white relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FBC02D] rounded-full blur-[40px] opacity-30"></div>
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/10 flex items-center justify-center mb-3 md:mb-4 border border-white/20 backdrop-blur-sm">
            <span className="text-xl md:text-2xl">🧠</span>
          </div>
          <p className="text-xs md:text-sm font-bold text-green-200 uppercase tracking-wider mb-1">AI Insight</p>
          <h3 className="text-base md:text-xl font-black text-white leading-tight">Mustard prices dropping.</h3>
          <p className="text-[10px] md:text-xs font-medium text-white/80 mt-1 md:mt-2">Optimal time to source in 48h.</p>
        </div>
      </div>

      {/* MAIN CONTENT SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 pb-20">
        
        {/* LEFT COLUMN: ACTIVE SHIPMENTS */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <div className="flex justify-between items-end mb-2 md:mb-4">
            <h2 className="text-xl md:text-2xl font-black text-[#0A2F1D] drop-shadow-sm">Incoming Shipments</h2>
            <Link href="/buyer-dashboard/orders" className="text-xs md:text-sm font-bold text-[#10893E] hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
            </Link>
          </div>

          <div className="space-y-4 w-full">
            {/* Shipment Card 1 */}
            <div className="bg-white border border-[#E2DFD3] shadow-sm p-4 md:p-6 rounded-2xl md:rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 w-full overflow-hidden">
              <div className="flex items-center gap-3 md:gap-4 shrink-0">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-[#FDF8EE] rounded-xl md:rounded-[1.5rem] flex items-center justify-center text-2xl md:text-3xl">🌾</div>
                <div>
                  <h3 className="font-black text-base md:text-lg text-[#0A2F1D] truncate">Wheat (Lok-1) • 100q</h3>
                  <p className="text-xs md:text-sm font-bold text-[#627768] flex items-center gap-1 mt-1 truncate">
                    <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0" /> Harpreet Singh (Ludhiana)
                  </p>
                </div>
              </div>
              
              <div className="flex-1 w-full min-w-0">
                <div className="flex justify-between text-[10px] md:text-xs font-bold text-[#0A2F1D] mb-1.5 md:mb-2">
                  <span>Dispatched</span>
                  <span className="text-[#10893E]">Transit</span>
                  <span className="opacity-40">Delivered</span>
                </div>
                <div className="w-full h-2 md:h-2.5 bg-[#FDF8EE] border border-[#E2DFD3] rounded-full overflow-hidden">
                  <div className="h-full bg-[#10893E] w-[60%] rounded-full relative"></div>
                </div>
                <p className="text-[10px] md:text-xs text-right mt-1 font-bold text-[#627768]">ETA: 2 Hours</p>
              </div>

              {/* Made full width on mobile so it doesn't break out */}
              <button className="w-full md:w-auto px-4 py-2.5 md:py-3 bg-white border border-[#E2DFD3] text-[#0A2F1D] rounded-xl font-bold hover:bg-slate-50 transition-all text-xs md:text-sm shrink-0">
                Contact Driver
              </button>
            </div>

            {/* Shipment Card 2 */}
            <div className="bg-white border border-[#E2DFD3] shadow-sm p-4 md:p-6 rounded-2xl md:rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 w-full overflow-hidden">
              <div className="flex items-center gap-3 md:gap-4 shrink-0">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-[#FDF8EE] rounded-xl md:rounded-[1.5rem] flex items-center justify-center text-2xl md:text-3xl">🥔</div>
                <div>
                  <h3 className="font-black text-base md:text-lg text-[#0A2F1D] truncate">Potato (Kufri) • 50q</h3>
                  <p className="text-xs md:text-sm font-bold text-[#627768] flex items-center gap-1 mt-1 truncate">
                    <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0" /> Gurdeep Agro (Jalandhar)
                  </p>
                </div>
              </div>
              
              <div className="flex-1 w-full min-w-0">
                <div className="flex justify-between text-[10px] md:text-xs font-bold text-[#0A2F1D] mb-1.5 md:mb-2">
                  <span>Dispatched</span>
                  <span className="opacity-40">Transit</span>
                  <span className="opacity-40">Delivered</span>
                </div>
                <div className="w-full h-2 md:h-2.5 bg-[#FDF8EE] border border-[#E2DFD3] rounded-full overflow-hidden">
                  <div className="h-full bg-[#F5B921] w-[15%] rounded-full"></div>
                </div>
                <p className="text-[10px] md:text-xs text-right mt-1 font-bold text-[#627768]">Loading at farm</p>
              </div>

              <button className="w-full md:w-auto px-4 py-2.5 md:py-3 bg-white border border-[#E2DFD3] text-[#0A2F1D] rounded-xl font-bold hover:bg-slate-50 transition-all text-xs md:text-sm shrink-0">
                View Details
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4 md:space-y-6">
          <h2 className="text-xl md:text-2xl font-black text-[#0A2F1D] drop-shadow-sm mb-2 md:mb-4">Network Actions</h2>
          
          <div className="bg-white border border-[#E2DFD3] shadow-sm p-4 md:p-6 rounded-2xl md:rounded-[2rem]">
             <h3 className="text-xs md:text-sm font-bold tracking-wider text-[#10893E] uppercase mb-3 md:mb-4">Awaiting Action</h3>
             
             <div className="space-y-3 md:space-y-4">
               <div className="bg-slate-50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-[#E2DFD3]">
                 <div className="flex items-start justify-between">
                   <div className="pr-2">
                     <p className="font-bold text-[#0A2F1D] text-sm md:text-base">Quality Verification</p>
                     <p className="text-[10px] md:text-xs text-[#627768] mt-1">Wheat delivery (ORD-441) is pending visual inspection approval.</p>
                   </div>
                   <span className="w-2 h-2 bg-red-500 rounded-full shrink-0 mt-1"></span>
                 </div>
                 <button className="mt-3 w-full py-2 bg-[#0A2F1D] text-white text-[10px] md:text-xs font-bold rounded-lg shadow-sm hover:bg-[#10893E] transition-colors">
                   Review & Approve
                 </button>
               </div>
             </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 shadow-sm p-4 md:p-6 rounded-2xl md:rounded-[2rem] border-l-4 border-l-[#10893E]">
            <div className="flex items-center gap-2 md:gap-3 mb-2">
              <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-[#10893E]" />
              <h3 className="font-bold text-sm md:text-base text-[#0A2F1D]">Escrow Wallet Secured</h3>
            </div>
            <p className="text-[10px] md:text-xs text-[#627768] leading-relaxed">Your escrow balance is ₹5.2L. Funds are ready for dispatch upon crop verification.</p>
          </div>
        </div>

      </div>
    </main>
  );
}