"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function MarketplacePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex h-screen bg-[#EBE5D9] overflow-hidden selection:bg-[#FBC02D] selection:text-[#0A2F1D] font-sans relative">
      
      {/* GLOBAL ANIMATIONS & 3D UTILITIES */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .glass-panel {
          background: rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255, 255, 255, 0.95);
          border-left: 1px solid rgba(255, 255, 255, 0.95);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          border-right: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 
            0 15px 35px rgba(10, 47, 29, 0.1), 
            inset 0 2px 0 rgba(255, 255, 255, 0.8);
        }
        
        .bg-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.06'/%3E%3C/svg%3E");
        }
      `}} />

      {/* BACKGROUND GLOWS & NOISE */}
      <div className="absolute inset-0 bg-noise z-0 pointer-events-none"></div>
      <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] bg-[#10893E] rounded-full mix-blend-multiply filter blur-[140px] opacity-[0.12] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-15%] right-[-5%] w-[700px] h-[700px] bg-[#FBC02D] rounded-full mix-blend-multiply filter blur-[160px] opacity-[0.12] pointer-events-none z-0"></div>

      {/* --- FLOATING 3D SIDEBAR --- */}
      {/* Reduced duration to 300ms for a snappier entrance */}
      <aside className={`relative z-20 w-24 lg:w-64 h-[calc(100vh-2rem)] my-4 ml-4 glass-panel rounded-3xl flex flex-col justify-between py-8 transition-all duration-300 ease-out transform ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
        
        <div className="px-0 lg:px-8 flex justify-center lg:justify-start items-center">
          <Link href="/farmer-dashboard" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0A2F1D] to-[#10893E] rounded-xl flex items-center justify-center shadow-[0_4px_10px_rgba(10,47,29,0.3),inset_0_2px_0_rgba(255,255,255,0.3)] transform group-hover:rotate-12 transition-transform duration-150">
              <span className="w-4 h-4 bg-[#FBC02D] rounded-full shadow-inner"></span>
            </div>
            <span className="hidden lg:block text-2xl font-black text-[#0A2F1D] tracking-tight drop-shadow-sm">Krishi<span className="text-[#10893E]">Setu</span></span>
          </Link>
        </div>

        <nav className="flex-1 mt-12 px-4 space-y-3">
          {[
  { name: "Dashboard", icon: "📊", link: "/farmer-dashboard", active: false },
  { name: "Marketplace", icon: "🤝", link: "/marketplace", active: false },
  { name: "AI Advisor", icon: "🤖", link: "/advisor", active: false },
  { name: "Price Forecast", icon: "🔮", link: "/price-prediction", active: false },
  { name: "Calculator", icon: "🧮", link: "/calculator", active: false }, // Add this!
  { name: "Mandi Prices", icon: "📈", link: "/mandi-prices", active: false },
  { name: "Traceability", icon: "🌱", link: "/traceability", active: false },
].map((nav, idx) => (
            <Link key={idx} href={nav.link} className={`flex items-center justify-center lg:justify-start space-x-4 px-4 py-4 rounded-2xl transition-all duration-150 font-bold ${
              nav.active 
              ? 'bg-gradient-to-b from-[#0A2F1D] to-[#062013] text-[#FDF8EE] shadow-[0_8px_15px_rgba(10,47,29,0.4),inset_0_1px_0_rgba(255,255,255,0.2)] scale-105' 
              : 'text-[#627768] hover:bg-white/80 hover:text-[#0A2F1D] hover:shadow-[0_5px_15px_rgba(10,47,29,0.08)] hover:-translate-y-1'
            }`}>
              <span className="text-xl drop-shadow-md">{nav.icon}</span>
              <span className="hidden lg:block">{nav.name}</span>
            </Link>
          ))}
        </nav>

        <div className="px-4 mt-auto">
          <Link href="/profile" className="flex items-center justify-center lg:justify-start space-x-3 p-2 rounded-2xl hover:bg-white/80 transition-all duration-150 border border-transparent hover:border-[#E2DFD3] hover:shadow-[0_5px_15px_rgba(10,47,29,0.08)] hover:-translate-y-1 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#FCD14D] to-[#FBC02D] flex items-center justify-center text-[#0A2F1D] font-black border-2 border-white shadow-[0_4px_8px_rgba(251,192,45,0.4)] group-hover:scale-110 transition-transform duration-150">
              HS
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-bold text-[#0A2F1D] leading-tight">Harpreet S.</p>
              <p className="text-xs font-medium text-[#627768]">Verified Farmer</p>
            </div>
          </Link>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 h-full overflow-y-auto hide-scrollbar p-4 md:p-8 relative z-10">
        
        {/* Removed delays, set to duration-300 */}
        <header className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-10 transition-all duration-300 ease-out transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-[#0A2F1D] mb-1 drop-shadow-sm">Direct Marketplace</h1>
            <p className="text-[#627768] font-medium">Connect with verified buyers and negotiate better prices.</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-4 items-center">
            <button className="glass-panel p-3 rounded-xl text-xl hover:scale-110 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(10,47,29,0.1)] transition-all duration-150 relative">
              🔔<span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#FBC02D] rounded-full shadow-[0_0_8px_#FBC02D]"></span>
            </button>
            <button className="bg-[#10893E] text-white px-6 py-3 rounded-xl font-bold shadow-[0_6px_0_0_#0D7334] hover:shadow-[0_2px_0_0_#0D7334] hover:translate-y-[4px] active:translate-y-[6px] active:shadow-none transition-all duration-150">
              + Post Harvest
            </button>
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
          <span className="text-sm font-bold text-[#10893E] hover:underline cursor-pointer transition-all duration-150">View Map</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          
          {/* BUYER CARD 1 */}
          {/* Removed delay classes and reduced transition duration to 200ms for instantaneous hover response */}
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

            {/* Action Buttons */}
            <div className="flex space-x-3 mt-2">
              <button className="w-1/3 py-3 bg-white/80 text-[#0A2F1D] rounded-xl font-bold shadow-sm hover:bg-white hover:shadow-md transition-all duration-150 border border-[#E2DFD3]">
                Chat
              </button>
              <button className="w-2/3 bg-gradient-to-b from-[#FCD14D] to-[#FBC02D] text-[#0A2F1D] rounded-xl font-black shadow-[0_6px_0_0_#D49800,0_10px_20px_rgba(251,192,45,0.3)] hover:shadow-[0_2px_0_0_#D49800,0_10px_20px_rgba(251,192,45,0.4)] hover:translate-y-[4px] active:translate-y-[6px] active:shadow-none transition-all duration-150 border border-[#F5B921]">
                Accept Offer
              </button>
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

            {/* Action Buttons */}
            <div className="flex space-x-3 mt-2">
              <button className="w-1/3 py-3 bg-white/80 text-[#0A2F1D] rounded-xl font-bold shadow-sm hover:bg-white hover:shadow-md transition-all duration-150 border border-[#E2DFD3]">
                Chat
              </button>
              <button className="w-2/3 bg-gradient-to-b from-[#FCD14D] to-[#FBC02D] text-[#0A2F1D] rounded-xl font-black shadow-[0_6px_0_0_#D49800,0_10px_20px_rgba(251,192,45,0.3)] hover:shadow-[0_2px_0_0_#D49800,0_10px_20px_rgba(251,192,45,0.4)] hover:translate-y-[4px] active:translate-y-[6px] active:shadow-none transition-all duration-150 border border-[#F5B921]">
                Accept Offer
              </button>
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

            {/* Action Buttons for Premium Card */}
            <div className="flex space-x-3 mt-2 relative z-10">
              <button className="w-1/3 py-3 bg-white/10 text-white rounded-xl font-bold shadow-sm hover:bg-white/20 transition-all duration-150 border border-white/20 backdrop-blur-sm">
                Chat
              </button>
              <button className="w-2/3 bg-white text-[#0A2F1D] rounded-xl font-black shadow-[0_6px_0_0_#CDE0C3,0_10px_20px_rgba(255,255,255,0.2)] hover:shadow-[0_2px_0_0_#CDE0C3,0_10px_20px_rgba(255,255,255,0.3)] hover:translate-y-[4px] active:translate-y-[6px] active:shadow-none transition-all duration-150">
                Accept Offer
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}