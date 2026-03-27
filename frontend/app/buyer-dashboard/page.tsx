"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  TrendingUp, Truck, Package, Wallet, ArrowRight, MapPin, CheckCircle2 
} from "lucide-react";

export default function BuyerOverviewPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="p-4 md:p-8 relative z-10 w-full animate-fade-in">
      
      {/* HEADER */}
      <header className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-10 transition-all duration-300 ease-out transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#0A2F1D] mb-1 drop-shadow-sm">Procurement Overview</h1>
          <p className="text-[#627768] font-medium">Track incoming shipments and market intelligence.</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-4 items-center">
          <Link href="/buyer-dashboard/notifications">
            <button className="glass-panel p-3 rounded-xl text-xl hover:scale-110 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(10,47,29,0.1)] transition-all duration-150 relative group">
              <span className="group-hover:rotate-12 transition-transform inline-block">🔔</span>
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#FBC02D] rounded-full shadow-[0_0_8px_#FBC02D] animate-pulse"></span>
            </button>
          </Link>
          <Link href="/buyer-dashboard/procurement">
            <button className="bg-[#10893E] text-white px-6 py-3 rounded-xl font-bold shadow-[0_6px_0_0_#0D7334] hover:shadow-[0_2px_0_0_#0D7334] hover:translate-y-[4px] active:translate-y-[6px] active:shadow-none transition-all duration-150 flex items-center gap-2">
              <span>+ New Request</span>
            </button>
          </Link>
        </div>
      </header>

      {/* STATS BENTO BOX */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 transition-all duration-300 ease-out transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        
        {/* Stat Card 1 */}
        <div className="glass-panel p-6 rounded-[2rem] hover:-translate-y-1 transition-transform group">
          <div className="w-12 h-12 rounded-2xl bg-white/60 flex items-center justify-center mb-4 shadow-inner border border-white">
            <Wallet className="w-6 h-6 text-[#10893E]" />
          </div>
          <p className="text-sm font-bold text-[#627768] uppercase tracking-wider mb-1">Total Spend (Month)</p>
          <h3 className="text-3xl font-black text-[#0A2F1D]">₹14.5L</h3>
          <p className="text-xs font-bold text-[#10893E] mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12% from last month
          </p>
        </div>

        {/* Stat Card 2 */}
        <div className="glass-panel p-6 rounded-[2rem] hover:-translate-y-1 transition-transform group">
          <div className="w-12 h-12 rounded-2xl bg-white/60 flex items-center justify-center mb-4 shadow-inner border border-white">
            <Package className="w-6 h-6 text-[#FBC02D]" />
          </div>
          <p className="text-sm font-bold text-[#627768] uppercase tracking-wider mb-1">Volume Procured</p>
          <h3 className="text-3xl font-black text-[#0A2F1D]">850q</h3>
          <p className="text-xs font-bold text-[#627768] mt-2">Across 3 commodities</p>
        </div>

        {/* Stat Card 3 */}
        <div className="glass-panel p-6 rounded-[2rem] hover:-translate-y-1 transition-transform group">
          <div className="w-12 h-12 rounded-2xl bg-[#0A2F1D]/10 flex items-center justify-center mb-4 shadow-inner border border-white/50">
            <Truck className="w-6 h-6 text-[#0A2F1D]" />
          </div>
          <p className="text-sm font-bold text-[#627768] uppercase tracking-wider mb-1">Active Shipments</p>
          <h3 className="text-3xl font-black text-[#0A2F1D]">4</h3>
          <p className="text-xs font-bold text-[#10893E] mt-2">2 arriving today</p>
        </div>

        {/* Stat Card 4 (AI Highlight) */}
        <div className="bg-gradient-to-br from-[#10893E] to-[#0A2F1D] p-6 rounded-[2rem] shadow-[0_15px_30px_rgba(10,47,29,0.2)] text-white relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FBC02D] rounded-full blur-[40px] opacity-30"></div>
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4 shadow-inner border border-white/20 backdrop-blur-sm">
            <span className="text-2xl">🧠</span>
          </div>
          <p className="text-sm font-bold text-green-200 uppercase tracking-wider mb-1">AI Market Insight</p>
          <h3 className="text-xl font-black text-white leading-tight">Mustard prices dropping in Haryana.</h3>
          <p className="text-xs font-medium text-white/80 mt-2">Optimal time to source in 48 hours.</p>
        </div>

      </div>

      {/* MAIN CONTENT SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
        
        {/* LEFT COLUMN: ACTIVE SHIPMENTS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-2xl font-black text-[#0A2F1D] drop-shadow-sm">Incoming Shipments</h2>
            <Link href="/buyer-dashboard/orders" className="text-sm font-bold text-[#10893E] hover:underline flex items-center gap-1">
              View Tracking <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {/* Shipment Card 1 */}
            <div className="glass-panel p-6 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-[0_15px_30px_rgba(10,47,29,0.08)] transition-all">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/80 rounded-[1.5rem] shadow-inner border border-white flex items-center justify-center text-3xl">🌾</div>
                <div>
                  <h3 className="font-black text-lg text-[#0A2F1D]">Wheat (Lok-1) • 100q</h3>
                  <p className="text-sm font-bold text-[#627768] flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5" /> Farmer: Harpreet Singh (Ludhiana)
                  </p>
                </div>
              </div>
              
              <div className="flex-1 px-0 md:px-8 w-full">
                <div className="flex justify-between text-xs font-bold text-[#0A2F1D] mb-2">
                  <span>Dispatched</span>
                  <span className="text-[#10893E]">In Transit</span>
                  <span className="opacity-40">Delivered</span>
                </div>
                <div className="w-full h-2.5 bg-white/60 rounded-full shadow-inner overflow-hidden border border-white/80">
                  <div className="h-full bg-[#10893E] w-[60%] rounded-full relative">
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] animate-[slide_1s_linear_infinite]"></div>
                  </div>
                </div>
                <p className="text-xs text-right mt-1 font-bold text-[#627768]">ETA: 2 Hours</p>
              </div>

              <button className="px-4 py-3 bg-white/60 border border-white shadow-sm text-[#0A2F1D] rounded-xl font-bold hover:bg-white transition-all text-sm shrink-0">
                Contact Driver
              </button>
            </div>

            {/* Shipment Card 2 */}
            <div className="glass-panel p-6 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-[0_15px_30px_rgba(10,47,29,0.08)] transition-all">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/80 rounded-[1.5rem] shadow-inner border border-white flex items-center justify-center text-3xl">🥔</div>
                <div>
                  <h3 className="font-black text-lg text-[#0A2F1D]">Potato (Kufri) • 50q</h3>
                  <p className="text-sm font-bold text-[#627768] flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5" /> Farmer: Gurdeep Agro (Jalandhar)
                  </p>
                </div>
              </div>
              
              <div className="flex-1 px-0 md:px-8 w-full">
                <div className="flex justify-between text-xs font-bold text-[#0A2F1D] mb-2">
                  <span>Dispatched</span>
                  <span className="opacity-40">In Transit</span>
                  <span className="opacity-40">Delivered</span>
                </div>
                <div className="w-full h-2.5 bg-white/60 rounded-full shadow-inner overflow-hidden border border-white/80">
                  <div className="h-full bg-[#FBC02D] w-[15%] rounded-full"></div>
                </div>
                <p className="text-xs text-right mt-1 font-bold text-[#627768]">Loading at farm</p>
              </div>

              <button className="px-4 py-3 bg-white/60 border border-white shadow-sm text-[#0A2F1D] rounded-xl font-bold hover:bg-white transition-all text-sm shrink-0">
                View Details
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RECENT ACTIONS & VERIFICATIONS */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-[#0A2F1D] drop-shadow-sm mb-4">Network Actions</h2>
          
          <div className="glass-panel p-6 rounded-[2rem]">
             <h3 className="text-sm font-bold tracking-wider text-[#10893E] uppercase mb-4">Awaiting Action</h3>
             
             <div className="space-y-4">
               {/* Action Item */}
               <div className="bg-white/50 p-4 rounded-2xl border border-white/60 shadow-inner">
                 <div className="flex items-start justify-between">
                   <div>
                     <p className="font-bold text-[#0A2F1D]">Quality Verification</p>
                     <p className="text-xs text-[#627768] mt-1">Wheat delivery (ORD-441) is pending visual inspection approval.</p>
                   </div>
                   <span className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
                 </div>
                 <button className="mt-3 w-full py-2 bg-[#0A2F1D] text-white text-xs font-bold rounded-lg shadow-md hover:bg-[#10893E] transition-colors">
                   Review Photos & Approve
                 </button>
               </div>

               {/* Action Item */}
               <div className="bg-white/50 p-4 rounded-2xl border border-white/60 shadow-inner">
                 <div className="flex items-start justify-between">
                   <div>
                     <p className="font-bold text-[#0A2F1D]">Counter-Offer Received</p>
                     <p className="text-xs text-[#627768] mt-1">Farmer 'Manjit S.' countered your bid for 20q Mustard to ₹6,100/q.</p>
                   </div>
                   <span className="w-2 h-2 bg-[#FBC02D] rounded-full shadow-[0_0_8px_#FBC02D]"></span>
                 </div>
                 <button className="mt-3 w-full py-2 bg-white border border-[#EBE5D9] text-[#0A2F1D] text-xs font-bold rounded-lg shadow-sm hover:bg-[#FDF8EE] transition-colors">
                   View Offer
                 </button>
               </div>
             </div>
          </div>

          <div className="glass-panel p-6 rounded-[2rem] bg-gradient-to-br from-[#10893E]/5 to-transparent border-l-4 border-l-[#10893E]">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-5 h-5 text-[#10893E]" />
              <h3 className="font-bold text-[#0A2F1D]">Escrow Wallet Secured</h3>
            </div>
            <p className="text-xs text-[#627768] leading-relaxed">Your current escrow balance is ₹5.2L. Funds are ready for instant dispatch upon crop verification.</p>
            <Link href="/buyer-dashboard/wallet" className="inline-block mt-3 text-xs font-black text-[#10893E] hover:underline">Manage Funds →</Link>
          </div>

        </div>

      </div>
    </main>
  );
}