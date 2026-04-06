"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calculator, TrendingUp, TrendingDown, IndianRupee } from "lucide-react";

export default function CalculatorPage() {
  const [mounted, setMounted] = useState(false);
  
  const [landSize, setLandSize] = useState(10); 
  const [mandiPrice, setMandiPrice] = useState(2400);
  const [expenses, setExpenses] = useState(8500); 

  const yieldPerAcre = 18; 
  const totalYield = landSize * yieldPerAcre;
  const totalCost = expenses * landSize;
  const totalRevenue = totalYield * mandiPrice;
  const netProfit = totalRevenue - totalCost;
  const roi = totalCost > 0 ? ((netProfit / totalCost) * 100).toFixed(1) : "0.0";
  const breakEven = totalYield > 0 ? Math.round(totalCost / totalYield) : 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="p-4 md:p-8 relative z-10 w-full animate-fade-in pb-24 overflow-x-hidden">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0A2F1D] mb-1 drop-shadow-sm flex items-center gap-2 md:gap-3">
            <Calculator className="w-6 h-6 md:w-8 md:h-8 text-[#10893E]" /> Yield & Profit Calculator
          </h1>
          <p className="text-[#627768] font-medium text-sm md:text-base">Estimate your seasonal returns based on current market trends and input costs.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 max-w-6xl">
        
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-[#E2DFD3] shadow-sm p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-[2rem]">
            <h2 className="text-lg md:text-xl font-black text-[#0A2F1D] mb-6 md:mb-8">Harvest Variables</h2>
            
            <div className="mb-6 md:mb-8 p-4 md:p-6 bg-[#FDF8EE] rounded-xl md:rounded-2xl border border-[#E2DFD3]">
              <div className="flex justify-between items-end mb-4">
                <label className="font-bold text-[#0A2F1D] uppercase text-[10px] md:text-xs tracking-wider">Total Farm Area</label>
                <div className="text-xl md:text-2xl font-black text-[#10893E]">{landSize} <span className="text-xs md:text-sm">Acres</span></div>
              </div>
              <input 
                type="range" min="1" max="50" value={landSize} 
                onChange={(e) => setLandSize(parseInt(e.target.value))} 
                className="w-full h-2 bg-[#D6D0C4] rounded-lg appearance-none cursor-pointer accent-[#10893E]"
              />
            </div>

            <div className="mb-6 md:mb-8 p-4 md:p-6 bg-[#FDF8EE] rounded-xl md:rounded-2xl border border-[#E2DFD3]">
              <div className="flex justify-between items-end mb-4">
                <label className="font-bold text-[#0A2F1D] uppercase text-[10px] md:text-xs tracking-wider">Target Mandi Price</label>
                <div className="text-xl md:text-2xl font-black text-[#10893E]">₹{mandiPrice} <span className="text-xs md:text-sm">/ ql</span></div>
              </div>
              <input 
                type="range" min="1500" max="4000" step="50" value={mandiPrice} 
                onChange={(e) => setMandiPrice(parseInt(e.target.value))} 
                className="w-full h-2 bg-[#D6D0C4] rounded-lg appearance-none cursor-pointer accent-[#FBC02D]"
              />
            </div>

            <div className="p-4 md:p-6 bg-[#FDF8EE] rounded-xl md:rounded-2xl border border-[#E2DFD3] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <label className="block font-bold text-[#8A9A90] uppercase text-[10px] md:text-xs tracking-wider mb-1">Production Cost / Acre</label>
                <p className="text-2xl md:text-3xl font-black text-[#0A2F1D]">₹{expenses.toLocaleString()}</p>
              </div>
              <div className="flex gap-2 md:gap-3">
                <button onClick={() => setExpenses(e => Math.max(0, e - 500))} className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white border-2 border-[#E2DFD3] flex items-center justify-center text-2xl md:text-3xl font-black text-[#0A2F1D] hover:border-[#10893E] hover:text-[#10893E] transition-colors shadow-sm">−</button>
                <button onClick={() => setExpenses(e => e + 500)} className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white border-2 border-[#E2DFD3] flex items-center justify-center text-2xl md:text-3xl font-black text-[#0A2F1D] hover:border-[#FBC02D] hover:text-[#FBC02D] transition-colors shadow-sm">+</button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-start">
          <motion.div 
            className={`p-1 rounded-[2rem] md:rounded-[2.5rem] transition-all duration-300 shadow-xl
              ${netProfit >= 0 ? 'bg-gradient-to-br from-[#10893E] to-[#FBC02D]' : 'bg-gradient-to-br from-red-500 to-orange-400'}`}
          >
            <div className="bg-[#0A2F1D] rounded-[1.9rem] md:rounded-[2.4rem] p-6 md:p-10 relative overflow-hidden text-center flex flex-col justify-center min-h-[300px] md:min-h-[400px]">
              <div className={`absolute inset-0 opacity-20 pointer-events-none 
                ${netProfit >= 0 ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#10893E] via-transparent to-transparent' : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-500 via-transparent to-transparent'}`}></div>
              
              <div className="relative z-10">
                <p className="text-white/60 font-black uppercase tracking-widest md:tracking-[0.2em] text-[8px] md:text-[10px] mb-2 md:mb-4">Estimated Net Profit</p>
                <h2 className={`text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter drop-shadow-lg break-words ${netProfit >= 0 ? 'text-white' : 'text-red-400'}`}>
                  {netProfit >= 0 ? `₹${netProfit.toLocaleString()}` : `-₹${Math.abs(netProfit).toLocaleString()}`}
                </h2>
                
                <div className={`inline-flex items-center gap-1.5 md:gap-2 px-4 md:px-6 py-2 md:py-2.5 rounded-full font-black text-xs md:text-sm my-6 md:my-8 shadow-lg 
                  ${netProfit >= 0 ? 'bg-[#10893E] text-white border border-[#14A049]' : 'bg-red-600 text-white border border-red-500'}`}>
                  {netProfit >= 0 ? <><TrendingUp className="w-3 h-3 md:w-4 md:h-4"/> ▲ {roi}% Return</> : <><TrendingDown className="w-3 h-3 md:w-4 md:h-4"/> Loss Projected</>}
                </div>
                
                <div className="grid grid-cols-2 gap-4 md:gap-6 text-left border-t border-white/10 pt-6 md:pt-8 mt-2">
                  <div>
                    <p className="text-[#8A9A90] text-[8px] md:text-[10px] font-black uppercase mb-1">Total Expense</p>
                    <p className="text-lg md:text-xl font-bold text-white truncate">₹{totalCost.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#8A9A90] text-[8px] md:text-[10px] font-black uppercase mb-1">Estimated Yield</p>
                    <p className="text-lg md:text-xl font-bold text-[#FBC02D] truncate">{totalYield} ql</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="mt-4 md:mt-6 bg-white border border-[#E2DFD3] shadow-sm p-4 md:p-6 rounded-2xl md:rounded-[2rem] flex items-center justify-between">
            <div className="flex items-center space-x-3 md:space-x-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#FDF8EE] flex items-center justify-center text-[#10893E] border border-[#E2DFD3]">
                <IndianRupee className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <p className="text-[8px] md:text-[10px] font-black text-[#8A9A90] uppercase tracking-wider">Break-Even Point</p>
                <p className="text-lg md:text-xl font-black text-[#0A2F1D]">₹{breakEven} <span className="text-[10px] md:text-xs font-bold text-[#627768] tracking-normal">/ quintal</span></p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}