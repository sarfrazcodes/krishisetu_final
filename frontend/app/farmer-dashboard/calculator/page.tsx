"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calculator, TrendingUp, TrendingDown, IndianRupee } from "lucide-react";

export default function CalculatorPage() {
  const [mounted, setMounted] = useState(false);
  
  // Interactive States
  const [landSize, setLandSize] = useState(10); 
  const [mandiPrice, setMandiPrice] = useState(2400); // Standard Wheat Price
  const [expenses, setExpenses] = useState(8500); 

  // Logic
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
    <main className="p-4 md:p-8 relative z-10 w-full animate-fade-in pb-24">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#0A2F1D] mb-1 drop-shadow-sm flex items-center gap-3">
            <Calculator className="w-8 h-8 text-[#10893E]" /> Yield & Profit Calculator
          </h1>
          <p className="text-[#627768] font-medium">Estimate your seasonal returns based on current market trends and input costs.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl">
        
        {/* LEFT COLUMN: CONTROLS */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-[#E2DFD3] shadow-sm p-6 md:p-8 rounded-[2rem]">
            <h2 className="text-xl font-black text-[#0A2F1D] mb-8">Harvest Variables</h2>
            
            {/* Control 1: Farm Size */}
            <div className="mb-8 p-6 bg-[#FDF8EE] rounded-2xl border border-[#E2DFD3]">
              <div className="flex justify-between items-end mb-4">
                <label className="font-bold text-[#0A2F1D] uppercase text-xs tracking-wider">Total Farm Area</label>
                <div className="text-2xl font-black text-[#10893E]">{landSize} <span className="text-sm">Acres</span></div>
              </div>
              <input 
                type="range" 
                min="1" max="50" 
                value={landSize} 
                onChange={(e) => setLandSize(parseInt(e.target.value))} 
                className="w-full h-2 bg-[#D6D0C4] rounded-lg appearance-none cursor-pointer accent-[#10893E]"
              />
            </div>

            {/* Control 2: Expected Price */}
            <div className="mb-8 p-6 bg-[#FDF8EE] rounded-2xl border border-[#E2DFD3]">
              <div className="flex justify-between items-end mb-4">
                <label className="font-bold text-[#0A2F1D] uppercase text-xs tracking-wider">Target Mandi Price</label>
                <div className="text-2xl font-black text-[#10893E]">₹{mandiPrice} <span className="text-sm">/ ql</span></div>
              </div>
              <input 
                type="range" 
                min="1500" max="4000" step="50"
                value={mandiPrice} 
                onChange={(e) => setMandiPrice(parseInt(e.target.value))} 
                className="w-full h-2 bg-[#D6D0C4] rounded-lg appearance-none cursor-pointer accent-[#FBC02D]"
              />
            </div>

            {/* Control 3: Expenses */}
            <div className="p-6 bg-[#FDF8EE] rounded-2xl border border-[#E2DFD3] flex items-center justify-between">
              <div>
                <label className="block font-bold text-[#8A9A90] uppercase text-xs tracking-wider mb-1">Production Cost / Acre</label>
                <p className="text-3xl font-black text-[#0A2F1D]">₹{expenses.toLocaleString()}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setExpenses(e => Math.max(0, e - 500))} className="w-12 h-12 rounded-xl bg-white border-2 border-[#E2DFD3] flex items-center justify-center text-3xl font-black text-[#0A2F1D] hover:border-[#10893E] hover:text-[#10893E] transition-colors shadow-sm">−</button>
                <button onClick={() => setExpenses(e => e + 500)} className="w-12 h-12 rounded-xl bg-white border-2 border-[#E2DFD3] flex items-center justify-center text-3xl font-black text-[#0A2F1D] hover:border-[#FBC02D] hover:text-[#FBC02D] transition-colors shadow-sm">+</button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RESULTS */}
        <div className="lg:col-span-5 flex flex-col justify-start">
          <motion.div 
            className={`p-1 rounded-[2.5rem] transition-all duration-300 shadow-xl
              ${netProfit >= 0 ? 'bg-gradient-to-br from-[#10893E] to-[#FBC02D]' : 'bg-gradient-to-br from-red-500 to-orange-400'}`}
          >
            <div className="bg-[#0A2F1D] rounded-[2.4rem] p-8 md:p-10 relative overflow-hidden text-center flex flex-col justify-center min-h-[400px]">
              <div className={`absolute inset-0 opacity-20 pointer-events-none 
                ${netProfit >= 0 ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#10893E] via-transparent to-transparent' : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-500 via-transparent to-transparent'}`}></div>
              
              <div className="relative z-10">
                <p className="text-white/60 font-black uppercase tracking-[0.2em] text-[10px] mb-4">Estimated Net Profit</p>
                <h2 className={`text-5xl md:text-6xl font-black tracking-tighter drop-shadow-lg ${netProfit >= 0 ? 'text-white' : 'text-red-400'}`}>
                  {netProfit >= 0 ? `₹${netProfit.toLocaleString()}` : `-₹${Math.abs(netProfit).toLocaleString()}`}
                </h2>
                
                <div className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-black text-sm my-8 shadow-lg 
                  ${netProfit >= 0 ? 'bg-[#10893E] text-white border border-[#14A049]' : 'bg-red-600 text-white border border-red-500'}`}>
                  {netProfit >= 0 ? <><TrendingUp className="w-4 h-4"/> ▲ {roi}% Return</> : <><TrendingDown className="w-4 h-4"/> Loss Projected</>}
                </div>
                
                <div className="grid grid-cols-2 gap-6 text-left border-t border-white/10 pt-8 mt-2">
                  <div>
                    <p className="text-[#8A9A90] text-[10px] font-black uppercase mb-1">Total Expense</p>
                    <p className="text-xl font-bold text-white">₹{totalCost.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#8A9A90] text-[10px] font-black uppercase mb-1">Estimated Yield</p>
                    <p className="text-xl font-bold text-[#FBC02D]">{totalYield} ql</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="mt-6 bg-white border border-[#E2DFD3] shadow-sm p-6 rounded-[2rem] flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-[#FDF8EE] flex items-center justify-center text-[#10893E] border border-[#E2DFD3]">
                <IndianRupee className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-[#8A9A90] uppercase tracking-wider">Break-Even Point</p>
                <p className="text-xl font-black text-[#0A2F1D]">₹{breakEven} <span className="text-xs font-bold text-[#627768] tracking-normal">/ quintal</span></p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}