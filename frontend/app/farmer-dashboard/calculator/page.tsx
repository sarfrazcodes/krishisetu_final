"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function CalculatorPage() {
  const [mounted, setMounted] = useState(false);
  
  // Interactive States
  const [landSize, setLandSize] = useState(10); 
  const [mandiPrice, setMandiPrice] = useState(2275);
  const [expenses, setExpenses] = useState(8500); 

  // Logic
  const yieldPerAcre = 18; 
  const totalYield = landSize * yieldPerAcre;
  const totalCost = expenses * landSize;
  const totalRevenue = totalYield * mandiPrice;
  const netProfit = totalRevenue - totalCost;
  const roi = ((netProfit / totalCost) * 100).toFixed(1);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex h-screen bg-[#EBE5D9] overflow-hidden selection:bg-[#FBC02D] selection:text-[#0A2F1D] font-sans relative">
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .glass-sidebar {
          background: rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255, 255, 255, 0.95);
          border-left: 1px solid rgba(255, 255, 255, 0.95);
          box-shadow: 0 15px 35px rgba(10, 47, 29, 0.1), inset 0 2px 0 rgba(255, 255, 255, 0.8);
        }

        .chunky-card {
          background: #F4F1E8;
          border-radius: 2rem;
          border: 2px solid #D4C392;
          box-shadow: 0 10px 0 0 #D4C392, 0 20px 30px rgba(0,0,0,0.1);
          transition: all 0.15s ease-out;
        }
        .chunky-card:hover {
          transform: translateY(2px);
          box-shadow: 0 6px 0 0 #D4C392, 0 10px 20px rgba(0,0,0,0.1);
        }

        .dial-inset {
          background: #EBE5D9;
          box-shadow: inset 4px 4px 8px rgba(0,0,0,0.08), inset -4px -4px 8px rgba(255,255,255,0.8);
          border-radius: 1.5rem;
        }

        .mech-btn {
          background: #F4F1E8;
          border: 2px solid #D4C392;
          box-shadow: 0 4px 0 0 #D4C392;
          transition: all 0.1s ease;
        }
        .mech-btn:active {
          transform: translateY(2px);
          box-shadow: 0 1px 0 0 #D4C392;
        }

        input[type=range] { -webkit-appearance: none; width: 100%; background: transparent; }
        input[type=range]::-webkit-slider-runnable-track {
          width: 100%; height: 10px; background: #D4C392; border-radius: 5px;
        }
        input[type=range]::-webkit-slider-thumb {
          height: 26px; width: 26px; border-radius: 50%; background: #0A2F1D; 
          border: 3px solid #FBC02D; -webkit-appearance: none; margin-top: -8px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2); cursor: pointer;
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
        .animate-glow { animation: pulse-glow 2s infinite ease-in-out; }
      `}} />

      <div className="absolute inset-0 bg-noise z-0 pointer-events-none opacity-40"></div>
      
      {/* --- SIDEBAR --- */}
      <aside className={`relative z-20 w-24 lg:w-64 h-[calc(100vh-2rem)] my-4 ml-4 glass-sidebar rounded-3xl flex flex-col justify-between py-8 transition-all duration-300 ease-out transform ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
        <div className="px-0 lg:px-8 flex justify-center lg:justify-start items-center">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0A2F1D] to-[#10893E] rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-150">
              <span className="w-4 h-4 bg-[#FBC02D] rounded-full"></span>
            </div>
            <span className="hidden lg:block text-2xl font-black text-[#0A2F1D] tracking-tight">Krishi<span className="text-[#10893E]">Setu</span></span>
          </Link>
        </div>

        <nav className="flex-1 mt-12 px-4 space-y-3">
          {[
            { name: "Dashboard", icon: "📊", link: "/farmer-dashboard", active: false },
            { name: "Marketplace", icon: "🤝", link: "/marketplace", active: false },
            { name: "AI Advisor", icon: "🤖", link: "/advisor", active: false },
            { name: "Price Forecast", icon: "🔮", link: "/price-prediction", active: false },
            { name: "Calculator", icon: "🧮", link: "/calculator", active: true },
            { name: "Mandi Prices", icon: "📈", link: "/mandi-prices", active: false },
            { name: "Traceability", icon: "🌱", link: "/traceability", active: false },
          ].map((nav, idx) => (
            <Link key={idx} href={nav.link} className={`flex items-center justify-center lg:justify-start space-x-4 px-4 py-4 rounded-2xl transition-all duration-150 font-bold ${
              nav.active ? 'bg-[#0A2F1D] text-white shadow-xl scale-105' : 'text-[#627768] hover:bg-white/80 hover:text-[#0A2F1D]'
            }`}>
              <span className="text-xl">{nav.icon}</span>
              <span className="hidden lg:block">{nav.name}</span>
            </Link>
          ))}
        </nav>

        {/* PROFILE BADGE - RESTORED */}
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
      <main className="flex-1 h-full overflow-y-auto hide-scrollbar p-6 md:p-12 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
          
          <div className="lg:col-span-7 space-y-8">
            <header className="transition-all duration-300 transform">
              <h1 className="text-4xl font-black text-[#0A2F1D] mb-1 tracking-tight drop-shadow-sm">Profit Strategy Engine</h1>
              <p className="text-[#627768] font-bold">Tune your inputs to calculate seasonal ROI.</p>
            </header>

            <div className="chunky-card p-8 space-y-10">
              <h2 className="text-sm font-black text-[#0A2F1D] uppercase tracking-[0.2em] border-b border-[#D4C392] pb-4">Adjustable Variables</h2>
              
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-28 h-28 dial-inset flex items-center justify-center relative flex-shrink-0 group">
                   <svg className="absolute inset-0 w-full h-full -rotate-90">
                     <circle cx="56" cy="56" r="44" fill="transparent" stroke="#D4C392" strokeWidth="8" opacity="0.3" />
                     <circle cx="56" cy="56" r="44" fill="transparent" stroke="#10893E" strokeWidth="8" strokeDasharray="276" strokeDashoffset={276 - (276 * landSize) / 50} strokeLinecap="round" className="transition-all duration-200" />
                   </svg>
                   <span className="text-2xl font-black text-[#0A2F1D] group-hover:scale-110 transition-transform">{landSize}</span>
                </div>
                <div className="flex-1 w-full">
                  <label className="block font-black text-[#0A2F1D] text-xs uppercase mb-3">Farm Area (Acres)</label>
                  <input type="range" min="1" max="50" value={landSize} onChange={(e) => setLandSize(parseInt(e.target.value))} />
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-28 h-28 dial-inset flex items-center justify-center relative flex-shrink-0 group">
                   <svg className="absolute inset-0 w-full h-full -rotate-90">
                     <circle cx="56" cy="56" r="44" fill="transparent" stroke="#D4C392" strokeWidth="8" opacity="0.3" />
                     <circle cx="56" cy="56" r="44" fill="transparent" stroke="#FBC02D" strokeWidth="8" strokeDasharray="276" strokeDashoffset={276 - (276 * (mandiPrice - 1800)) / 1200} strokeLinecap="round" className="transition-all duration-200" />
                   </svg>
                   <span className="text-lg font-black text-[#0A2F1D] group-hover:scale-110 transition-transform">₹{mandiPrice}</span>
                </div>
                <div className="flex-1 w-full">
                  <label className="block font-black text-[#0A2F1D] text-xs uppercase mb-3">Target Sale Price (Per Quintal)</label>
                  <input type="range" min="1800" max="3000" step="10" value={mandiPrice} onChange={(e) => setMandiPrice(parseInt(e.target.value))} />
                </div>
              </div>

              <div className="dial-inset p-6 flex items-center justify-between border border-white/40">
                <div>
                  <label className="block font-black text-[#627768] uppercase text-[10px] tracking-widest mb-1">Production Cost / Acre</label>
                  <p className="text-2xl font-black text-[#0A2F1D]">₹{expenses.toLocaleString()}</p>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setExpenses(e => Math.max(0, e - 500))} className="mech-btn w-14 h-14 rounded-2xl flex items-center justify-center text-3xl font-black text-[#0A2F1D] hover:bg-white">−</button>
                  <button onClick={() => setExpenses(e => e + 500)} className="mech-btn w-14 h-14 rounded-2xl flex items-center justify-center text-3xl font-black text-[#0A2F1D] hover:bg-white">+</button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 h-full flex flex-col justify-center">
            <div className={`relative p-1 rounded-[3rem] transition-all duration-200 transform ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} ${netProfit >= 0 ? 'bg-gradient-to-br from-[#10893E] to-[#FBC02D]' : 'bg-gradient-to-br from-red-600 to-orange-500'} shadow-[0_20px_50px_rgba(0,0,0,0.15)]`}>
              <div className="bg-[#0A2F1D] rounded-[2.8rem] p-10 relative overflow-hidden text-center flex flex-col justify-center min-h-[420px]">
                <div className={`absolute inset-0 opacity-20 animate-glow pointer-events-none ${netProfit >= 0 ? 'bg-gradient-to-tr from-[#10893E] via-transparent to-[#FBC02D]' : 'bg-gradient-to-tr from-red-500 via-transparent to-orange-400'}`}></div>
                <div className="relative z-10">
                  <p className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px] mb-4">Season P&L Projection</p>
                  <h2 className={`text-6xl font-black tracking-tighter drop-shadow-lg ${netProfit >= 0 ? 'text-white' : 'text-red-400'}`}>
                    {netProfit >= 0 ? `₹${netProfit.toLocaleString()}` : `-₹${Math.abs(netProfit).toLocaleString()}`}
                  </h2>
                  <div className={`inline-flex items-center px-6 py-2 rounded-full font-black text-sm my-8 shadow-lg ${netProfit >= 0 ? 'bg-[#10893E] text-white' : 'bg-red-600 text-white'}`}>
                    {netProfit >= 0 ? `▲ ${roi}% ROI` : `LOSS PROJECTED`}
                  </div>
                  <div className="grid grid-cols-2 gap-8 text-left border-t border-white/10 pt-8">
                    <div className="group">
                      <p className="text-white/30 text-[10px] font-black uppercase mb-1">Total Expense</p>
                      <p className="text-xl font-bold text-white transition-transform group-hover:scale-105">₹{totalCost.toLocaleString()}</p>
                    </div>
                    <div className="text-right group">
                      <p className="text-white/30 text-[10px] font-black uppercase mb-1">Estimated Yield</p>
                      <p className="text-xl font-bold text-[#FBC02D] transition-transform group-hover:scale-105">{totalYield}q</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 chunky-card p-6 bg-white/50 backdrop-blur-md flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">📉</div>
                <div>
                  <p className="text-[10px] font-black text-[#627768] uppercase">Critical Break-Even</p>
                  <p className="text-lg font-black text-[#0A2F1D]">₹{Math.round(totalCost/totalYield)} <span className="text-xs text-[#627768]">/ Quintal</span></p>
                </div>
              </div>
              <Link href="/mandi-prices" className="bg-[#0A2F1D] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#10893E] transition-colors">Market Prices →</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}