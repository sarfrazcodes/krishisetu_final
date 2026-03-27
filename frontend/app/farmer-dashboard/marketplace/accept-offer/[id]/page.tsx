"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AcceptOfferPage({ params }: { params: { id: string } }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-10 relative overflow-hidden">
      {/* BACKGROUND ELEMENTS FOR DEPTH */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#10893E]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#FBC02D]/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* HEADER SECTION */}
      <div className={`max-w-6xl mx-auto transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <Link 
          href="/farmer-dashboard/marketplace"
          className="group text-[#10893E] font-bold flex items-center gap-2 mb-6 hover:translate-x-[-4px] transition-transform"
        >
          <span className="text-xl">←</span> Back to Marketplace
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-[#0A2F1D]">Confirm & Seal Deal</h1>
            <p className="text-[#627768] font-medium mt-1">You are generating a legally binding smart-contract for your harvest.</p>
          </div>
          {/* Progress Indicator */}
          <div className="flex items-center gap-3 bg-white/40 backdrop-blur-md p-2 rounded-2xl border border-white/60">
            <div className="flex items-center gap-2 px-3 py-1 bg-[#10893E] text-white rounded-lg text-sm font-bold">
              <span>1</span> Review
            </div>
            <div className="w-8 h-[2px] bg-[#0A2F1D]/10"></div>
            <div className="flex items-center gap-2 px-3 py-1 bg-[#0A2F1D]/5 text-[#0A2F1D]/40 rounded-lg text-sm font-bold">
              <span>2</span> Sign
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: THE OFFER CARD */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(10,47,29,0.05)] relative overflow-hidden group">
              {/* Decorative accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FBC02D]/20 to-transparent rounded-bl-[5rem]"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                {/* Offer Column */}
                <div className="space-y-8">
                  <section>
                    <h2 className="text-[10px] font-black tracking-[0.2em] text-[#10893E] uppercase mb-4">Offer Breakdown</h2>
                    <div className="bg-white/60 rounded-3xl p-6 border border-white/80 shadow-inner group-hover:bg-white/80 transition-colors">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-4xl bg-white p-3 rounded-2xl shadow-sm">🌾</span>
                        <div>
                          <p className="text-2xl font-black text-[#0A2F1D]">Wheat (Lok-1)</p>
                          <p className="text-sm font-bold text-[#627768]">Grade A • Verified Quality</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-[#0A2F1D]/5">
                        <p className="font-bold text-[#0A2F1D]">Unit Price</p>
                        <p className="text-2xl font-black text-[#10893E]">₹2,500 <span className="text-xs text-[#627768]">/ Quintal</span></p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-[10px] font-black tracking-[0.2em] text-[#10893E] uppercase mb-4">Buyer Verification</h2>
                    <div className="bg-white/60 rounded-3xl p-6 border border-white/80 shadow-inner group-hover:bg-white/80 transition-colors">
                      <p className="text-xl font-black text-[#0A2F1D]">Punjab Agro Foods</p>
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div className="text-xs font-bold text-[#627768]">
                          <p>Manager</p>
                          <p className="text-[#0A2F1D]">Ramesh Kumar</p>
                        </div>
                        <div className="text-xs font-bold text-[#627768]">
                          <p>Phone</p>
                          <p className="text-[#0A2F1D]">+91 98765 43210</p>
                        </div>
                      </div>
                      <p className="text-xs font-bold text-[#10893E] mt-4 flex items-center gap-1">
                        📍 12 km • Ludhiana Central Mandi
                      </p>
                    </div>
                  </section>
                </div>

                {/* Commitment Column */}
                <div className="flex flex-col justify-between">
                  <section className="space-y-6">
                    <h2 className="text-[10px] font-black tracking-[0.2em] text-[#10893E] uppercase mb-4">Your Commitment</h2>
                    
                    <div className="space-y-4">
                      <div className="group/input">
                        <label className="block text-xs font-black text-[#0A2F1D] mb-2 ml-1 uppercase opacity-60">Supply Quantity (q)</label>
                        <input 
                          type="number" 
                          defaultValue="100"
                          className="w-full px-6 py-4 rounded-2xl bg-white/80 border border-white focus:outline-none focus:ring-4 focus:ring-[#10893E]/10 text-[#0A2F1D] font-bold text-lg shadow-inner transition-all"
                        />
                      </div>

                      <div className="group/input">
                        <label className="block text-xs font-black text-[#0A2F1D] mb-2 ml-1 uppercase opacity-60">Delivery Date</label>
                        <input 
                          type="date" 
                          className="w-full px-6 py-4 rounded-2xl bg-white/80 border border-white focus:outline-none focus:ring-4 focus:ring-[#10893E]/10 text-[#0A2F1D] font-bold shadow-inner transition-all"
                        />
                      </div>
                    </div>
                  </section>

                  <div className="mt-10 pt-6 border-t-2 border-dashed border-[#0A2F1D]/10">
                    <div className="flex justify-between items-center mb-6">
                      <span className="font-bold text-[#627768]">Estimated Total:</span>
                      <span className="text-4xl font-black text-[#0A2F1D] drop-shadow-sm">₹2,50,000</span>
                    </div>
                    <button className="w-full bg-[#10893E] hover:bg-[#0A2F1D] text-white font-black py-5 rounded-2xl shadow-[0_10px_30px_rgba(16,137,62,0.3)] hover:shadow-[0_15px_40px_rgba(10,47,29,0.4)] transition-all duration-300 active:scale-[0.98] text-lg flex items-center justify-center gap-3 group">
                      Confirm & Generate Contract
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: SIDEBAR WIDGETS */}
          <div className="space-y-6">
            {/* Trust Badge Widget */}
            <div className="glass-panel p-6 rounded-[2rem] border-l-4 border-l-[#FBC02D]">
              <div className="text-3xl mb-3">🛡️</div>
              <h3 className="font-bold text-[#0A2F1D] mb-2 text-lg">KrishiSetu Guarantee</h3>
              <p className="text-sm text-[#627768] leading-relaxed">
                Your payment is secured in escrow. Funds are released immediately after the buyer verifies the quality at the Mandi.
              </p>
            </div>

            {/* Inventory Shortcut Widget */}
            <div className="glass-panel p-6 rounded-[2rem] bg-gradient-to-br from-white/40 to-[#E9F3E8]/40">
              <h3 className="font-bold text-[#0A2F1D] mb-4 text-sm uppercase tracking-wider">Your Inventory Status</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-[#627768]">Current Stock:</span>
                  <span className="text-[#0A2F1D]">450 q</span>
                </div>
                <div className="w-full h-2 bg-white/50 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-[#10893E] w-[22%]" />
                </div>
                <p className="text-[10px] text-[#627768] font-medium italic">
                  *This deal will utilize 22% of your available Wheat stock.
                </p>
              </div>
            </div>

            {/* Need Help Widget */}
            <div className="p-6 rounded-[2rem] bg-[#0A2F1D] text-white shadow-xl relative overflow-hidden group cursor-pointer transition-transform hover:scale-[1.02]">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
              <h3 className="font-bold mb-2 relative z-10 flex items-center gap-2">
                <span className="animate-pulse">🎧</span> Live Support
              </h3>
              <p className="text-xs text-white/70 relative z-10 mb-4">Confused about the contract terms? Talk to our market expert.</p>
              <button className="text-xs font-black text-[#FBC02D] uppercase tracking-widest relative z-10 group-hover:underline">
                Call Advisor Now
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}