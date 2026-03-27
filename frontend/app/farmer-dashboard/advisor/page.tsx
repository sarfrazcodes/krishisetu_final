"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdvisorPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex h-screen bg-[#EBE5D9] overflow-hidden selection:bg-[#FBC02D] selection:text-[#0A2F1D] font-sans relative">
      
      {/* EXTREME 3D ANIMATIONS & UTILITIES */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(1deg); }
        }
        .animate-float { animation: float 5s ease-in-out infinite; }
        
        @keyframes radar-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-radar {
          background: conic-gradient(from 0deg, transparent 70%, rgba(251, 192, 45, 0.4) 100%);
          animation: radar-spin 3s linear infinite;
          border-radius: 50%;
        }

        .glass-sidebar {
          background: rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255, 255, 255, 0.95);
          border-left: 1px solid rgba(255, 255, 255, 0.95);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          border-right: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 15px 35px rgba(10, 47, 29, 0.1), inset 0 2px 0 rgba(255, 255, 255, 0.8);
        }

        .chunky-3d-block {
          background: #FDF8EE;
          border: 2px solid #E2DFD3;
          border-radius: 2rem;
          box-shadow: 
            0 12px 0 0 #D4C392, 
            0 25px 35px rgba(10, 47, 29, 0.15), 
            inset 0 4px 10px rgba(255, 255, 255, 1); 
          transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .chunky-3d-block:hover {
          transform: translateY(-4px);
          box-shadow: 
            0 16px 0 0 #D4C392,
            0 35px 50px rgba(10, 47, 29, 0.2),
            inset 0 4px 10px rgba(255, 255, 255, 1);
        }
        
        .bg-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E");
        }
      `}} />

      <div className="absolute inset-0 bg-noise z-0 pointer-events-none"></div>
      <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-[#10893E] rounded-full mix-blend-multiply filter blur-[150px] opacity-20 pointer-events-none z-0 animate-pulse"></div>
      
      {/* --- SIDEBAR --- */}
      <aside className={`relative z-20 w-24 lg:w-64 h-[calc(100vh-2rem)] my-4 ml-4 glass-sidebar rounded-3xl flex flex-col justify-between py-8 transition-all duration-300 ease-out transform ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
        <div className="px-0 lg:px-8 flex justify-center lg:justify-start items-center">
          <Link href="/" className="flex items-center space-x-3 group">
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
          <Link href="/profile" className="flex items-center justify-center lg:justify-start space-x-3 p-2 rounded-2xl hover:bg-white/80 transition-all duration-150 group border border-transparent hover:border-[#E2DFD3]">
            <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#FCD14D] to-[#FBC02D] flex items-center justify-center text-[#0A2F1D] font-black border-2 border-white shadow-[0_4px_8px_rgba(251,192,45,0.4)] group-hover:scale-110 transition-transform duration-150">
              US
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-bold text-[#0A2F1D] leading-tight">Ujjawal S.</p>
              <p className="text-xs font-medium text-[#627768]">Verified Farmer</p>
            </div>
          </Link>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 h-full overflow-y-auto hide-scrollbar p-4 md:p-8 relative z-10 pb-32">
        <header className={`mb-10 transition-all duration-300 ease-out transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <h1 className="text-3xl md:text-4xl font-black text-[#0A2F1D] mb-1 drop-shadow-sm">Sell/Wait Advisor</h1>
          <p className="text-[#627768] font-medium">Instant AI recommendations for your current inventory.</p>
        </header>

        {/* TOP ROW: VERDICT & INVENTORY */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* THE HOLD VERDICT */}
          <div className={`chunky-3d-block bg-gradient-to-b from-[#14A049] to-[#0A2F1D] border-[#062013] !shadow-[0_15px_0_0_#04120A,0_30px_50px_rgba(10,47,29,0.5),inset_0_4px_10px_rgba(255,255,255,0.2)] hover:!shadow-[0_8px_0_0_#04120A,0_20px_40px_rgba(10,47,29,0.6),inset_0_4px_10px_rgba(255,255,255,0.2)] hover:!translate-y-[7px] p-8 text-center relative overflow-hidden group cursor-pointer animate-float transition-all duration-300 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-[#FBC02D]/20 rounded-full flex items-center justify-center opacity-30">
              <div className="w-48 h-48 border border-[#FBC02D]/30 rounded-full flex items-center justify-center">
                <div className="w-full h-full animate-radar"></div>
              </div>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <span className="px-4 py-1.5 bg-[#FBC02D]/20 border border-[#FBC02D] text-[#FBC02D] font-black text-xs uppercase tracking-widest rounded-full mb-4 shadow-[0_0_10px_rgba(251,192,45,0.3)]">
                Primary Harvest: Wheat
              </span>
              <h2 className="text-7xl font-black text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)] mb-2">HOLD</h2>
              <p className="text-green-100 font-bold text-lg drop-shadow-md">Peak expected in <span className="text-[#FBC02D]">12 days</span>.</p>
              
              <div className="w-full h-px bg-white/20 my-6"></div>
              
              <button className="bg-[#FBC02D] text-[#0A2F1D] px-8 py-3 rounded-xl font-black shadow-[0_6px_0_0_#D49800] hover:translate-y-[4px] hover:shadow-[0_2px_0_0_#D49800] transition-all duration-150 w-full">
                Set Auto-Sell Alert at ₹2,550
              </button>
            </div>
          </div>

          {/* INVENTORY ACTION PLAN */}
          <div className={`chunky-3d-block p-6 md:p-8 flex flex-col transition-all duration-300 delay-100 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-2xl font-black text-[#0A2F1D] mb-6 drop-shadow-sm">Secondary Inventory</h2>
            
            <div className="space-y-4 flex-1">
              {/* Sell Now Card */}
              <div className="p-4 bg-white/80 rounded-2xl border-2 border-red-200 shadow-[0_4px_10px_rgba(239,68,68,0.1)] flex justify-between items-center group hover:bg-white hover:border-red-300 hover:-translate-y-1 transition-all duration-150 cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl bg-red-50 w-12 h-12 rounded-xl flex items-center justify-center shadow-inner">🥔</div>
                  <div>
                    <h3 className="font-bold text-[#0A2F1D] text-lg leading-tight">Potato (50q)</h3>
                    <p className="text-xs font-bold text-red-500 bg-white inline-block px-2 py-0.5 rounded border border-red-100 mt-1 shadow-sm">▼ Price Dropping</p>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-black text-red-600">SELL</h2>
                  <p className="text-xs font-bold text-[#8A9A90] mt-1 group-hover:text-red-500 transition-colors">Find Buyers →</p>
                </div>
              </div>

              {/* Hold Card */}
              <div className="p-4 bg-white/80 rounded-2xl border-2 border-[#CDE0C3] shadow-[0_4px_10px_rgba(16,137,62,0.05)] flex justify-between items-center group hover:bg-white hover:border-[#10893E] hover:-translate-y-1 transition-all duration-150 cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl bg-[#E9F3E8] w-12 h-12 rounded-xl flex items-center justify-center shadow-inner">🌻</div>
                  <div>
                    <h3 className="font-bold text-[#0A2F1D] text-lg leading-tight">Mustard (20q)</h3>
                    <p className="text-xs font-bold text-[#10893E] bg-white inline-block px-2 py-0.5 rounded border border-[#CDE0C3] mt-1 shadow-sm">▲ Rising Slowly</p>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-black text-[#0A2F1D]">WAIT</h2>
                  <p className="text-xs font-bold text-[#8A9A90] mt-1 group-hover:text-[#10893E]">Peak in 5 days</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* --- NEW SECTION 1: FINANCIAL IMPACT CALCULATOR --- */}
        <div className={`chunky-3d-block p-6 md:p-8 mb-8 transition-all duration-300 delay-200 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-2xl font-black text-[#0A2F1D]">Financial Impact (Wheat)</h2>
              <p className="text-[#627768] font-medium text-sm">Based on your current 100 quintal inventory.</p>
            </div>
            <div className="mt-4 md:mt-0 bg-[#E9F3E8] border border-[#10893E] px-4 py-2 rounded-xl shadow-sm">
              <span className="text-sm font-bold text-[#10893E]">Net Profit by Waiting:</span>
              <span className="ml-2 text-xl font-black text-[#10893E]">+ ₹27,500</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Scenario 1: Sell Today */}
            <div className="flex-1 bg-white/60 rounded-2xl p-5 border border-white shadow-inner relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-full bg-[#8A9A90]"></div>
              <p className="text-xs font-bold text-[#8A9A90] uppercase tracking-widest mb-1">Scenario A</p>
              <h3 className="text-xl font-black text-[#0A2F1D] mb-4">Sell Today</h3>
              
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-medium text-[#627768]">Current Rate</span>
                <span className="font-bold text-[#0A2F1D]">₹2,275/q</span>
              </div>
              <div className="w-full bg-[#E2DFD3] h-2 rounded-full mb-4">
                <div className="bg-[#8A9A90] h-2 rounded-full w-[70%]"></div>
              </div>
              
              <div className="flex justify-between items-center pt-3 border-t border-[#E2DFD3]">
                <span className="font-bold text-[#0A2F1D]">Total Revenue</span>
                <span className="text-2xl font-black text-[#0A2F1D]">₹2,27,500</span>
              </div>
            </div>

            {/* Scenario 2: Sell at Peak */}
            <div className="flex-1 bg-[#0A2F1D] rounded-2xl p-5 border border-[#1A6B3D] shadow-xl relative overflow-hidden text-white group">
              <div className="absolute top-0 right-0 w-2 h-full bg-[#FBC02D] shadow-[0_0_15px_#FBC02D]"></div>
              <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-[#10893E] rounded-full mix-blend-screen filter blur-[30px] opacity-30 group-hover:opacity-50 transition-opacity"></div>
              
              <p className="text-xs font-bold text-[#FBC02D] uppercase tracking-widest mb-1 drop-shadow-sm">Scenario B (Recommended)</p>
              <h3 className="text-xl font-black text-white mb-4">Wait 12 Days</h3>
              
              <div className="flex justify-between items-end mb-2 relative z-10">
                <span className="text-sm font-medium text-green-100">Predicted Peak</span>
                <span className="font-bold text-[#FBC02D]">₹2,550/q</span>
              </div>
              <div className="w-full bg-[#1A6B3D] h-2 rounded-full mb-4 relative z-10">
                <div className="bg-[#FBC02D] h-2 rounded-full w-full shadow-[0_0_8px_#FBC02D]"></div>
              </div>
              
              <div className="flex justify-between items-center pt-3 border-t border-white/20 relative z-10">
                <span className="font-bold text-white">Total Revenue</span>
                <span className="text-2xl font-black text-[#FBC02D]">₹2,55,000</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- NEW SECTION 2: ADVISOR'S HOLDING CHECKLIST --- */}
        <div className={`transition-all duration-300 delay-300 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-xl font-black text-[#0A2F1D] mb-4 drop-shadow-sm ml-2">While You Wait: Advisor Tasks</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="chunky-3d-block p-5 group hover:-translate-y-2 cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-400"></div>
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-xl shadow-inner border border-blue-100">💧</div>
                <span className="text-[10px] font-black text-blue-600 bg-blue-100 px-2 py-0.5 rounded border border-blue-200 uppercase">Action Needed</span>
              </div>
              <h3 className="font-bold text-[#0A2F1D] mb-1">Check Moisture</h3>
              <p className="text-xs font-medium text-[#627768] leading-relaxed">Ensure wheat moisture remains below 12% to prevent spoilage during the 12-day hold.</p>
            </div>

            <div className="chunky-3d-block p-5 group hover:-translate-y-2 cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#FBC02D]"></div>
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 rounded-full bg-[#FFF9E6] flex items-center justify-center text-xl shadow-inner border border-[#FDE08B]">🤝</div>
                <span className="text-[10px] font-black text-[#D49800] bg-[#FFF9E6] px-2 py-0.5 rounded border border-[#FDE08B] uppercase">Suggested</span>
              </div>
              <h3 className="font-bold text-[#0A2F1D] mb-1">Lock Future Contract</h3>
              <p className="text-xs font-medium text-[#627768] leading-relaxed">2 buyers are willing to sign a contract today for delivery in 12 days at ₹2,500/q.</p>
            </div>

            <div className="chunky-3d-block p-5 group hover:-translate-y-2 cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#10893E]"></div>
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 rounded-full bg-[#E9F3E8] flex items-center justify-center text-xl shadow-inner border border-[#CDE0C3]">🏢</div>
                <span className="text-[10px] font-black text-[#10893E] bg-[#E9F3E8] px-2 py-0.5 rounded border border-[#CDE0C3] uppercase">FYI</span>
              </div>
              <h3 className="font-bold text-[#0A2F1D] mb-1">Storage Overhead</h3>
              <p className="text-xs font-medium text-[#627768] leading-relaxed">Holding 100q for 12 days will cost approx. ₹800. Net profit calculation already accounts for this.</p>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}