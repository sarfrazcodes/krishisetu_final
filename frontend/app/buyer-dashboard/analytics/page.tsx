"use client";

import React, { useState, useEffect } from "react";
import { TrendingDown, TrendingUp, BrainCircuit, BarChart3, ArrowRight } from "lucide-react";

const aiInsights = [
  { id: 1, commodity: "Basmati Rice", prediction: "Steady Decline Expected", confidence: "91%", action: "Wait 2 days before bulk buying", reason: "New stock arrivals in Central mandis are causing a temporary surplus.", isPositiveForBuyer: true },
  { id: 2, commodity: "Soybean", prediction: "High Volatility Upcoming", confidence: "82%", action: "Lock in current rates", reason: "Global market fluctuations are expected to spike local prices.", isPositiveForBuyer: false }
];

const chartData = [
  { day: "Mon", price: 3100, height: "40%" }, { day: "Tue", price: 3150, height: "50%" }, { day: "Wed", price: 3200, height: "60%" },
  { day: "Thu", price: 3180, height: "55%" }, { day: "Fri", price: 3250, height: "70%" },
  { day: "Sat", price: 3350, height: "90%", isPrediction: true }, { day: "Sun", price: 3400, height: "100%", isPrediction: true },
];

export default function MarketAnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState("Wheat (Lok-1)");

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <main className="p-4 md:p-8 relative z-10 w-full animate-fade-in pb-24 overflow-x-hidden">

      <header className="mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-[#0A2F1D] mb-1">Market Analytics</h1>
        <p className="text-[#627768] font-medium text-sm md:text-base">Predictive pricing and AI-driven procurement strategies.</p>
      </header>

      {/* CHANGED: Switched horizontal buttons to a mobile-friendly dropdown! */}
      <div className="mb-6 md:mb-8 relative w-full sm:w-64">
        <select 
          value={selectedCrop} 
          onChange={(e) => setSelectedCrop(e.target.value)} 
          className="w-full px-4 py-3 bg-white border border-[#E2DFD3] rounded-xl font-bold text-[#0A2F1D] text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#10893E] appearance-none"
        >
          <option value="Wheat (Lok-1)">Wheat (Lok-1)</option>
          <option value="Mustard Seed">Mustard Seed</option>
          <option value="Potato (Kufri)">Potato (Kufri)</option>
          <option value="Basmati Rice">Basmati Rice</option>
        </select>
        <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-[#8A9A90]">▼</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* PREDICTIVE CHART */}
        <div className="lg:col-span-2 space-y-8 w-full">
          <div className="bg-white border border-[#E2DFD3] shadow-sm p-4 md:p-8 rounded-2xl md:rounded-[2rem] w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-start mb-6 md:mb-8 gap-2">
              <div>
                <h2 className="text-xl md:text-2xl font-black text-[#0A2F1D] flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#10893E]" /> Forecast
                </h2>
                <p className="text-xs md:text-sm font-bold text-[#627768] mt-1">{selectedCrop} • Punjab</p>
              </div>
              <div className="sm:text-right">
                <p className="text-[10px] md:text-xs font-bold tracking-wider text-[#627768] uppercase">Current Avg Price</p>
                <h3 className="text-2xl md:text-3xl font-black text-[#10893E]">₹3,250<span className="text-sm md:text-lg text-[#0A2F1D] opacity-50">/q</span></h3>
              </div>
            </div>

            <div className="h-48 md:h-64 mt-2 relative flex items-end justify-between gap-1 sm:gap-2 pt-10 w-full">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="w-full border-t border-[#0A2F1D] border-dashed"></div><div className="w-full border-t border-[#0A2F1D] border-dashed"></div><div className="w-full border-t border-[#0A2F1D] border-solid"></div>
              </div>
              {chartData.map((data, idx) => (
                <div key={idx} className="relative flex flex-col items-center flex-1 group z-10 h-full justify-end min-w-0">
                  <div className={`w-full max-w-[20px] sm:max-w-[40px] rounded-t-md transition-all ${data.isPrediction ? "bg-gradient-to-t from-[#FCD14D] to-[#FBC02D]" : "bg-gradient-to-t from-[#14A049] to-[#10893E]"}`} style={{ height: data.height }}></div>
                  <span className={`mt-2 text-[10px] md:text-xs font-bold ${data.isPrediction ? 'text-[#FBC02D]' : 'text-[#627768]'}`}>{data.day}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-6 pt-4 border-t border-[#0A2F1D]/10">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#627768]"><div className="w-2 h-2 rounded bg-[#10893E]"></div> History</div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#627768]"><div className="w-2 h-2 rounded bg-[#FBC02D]"></div> Prediction</div>
            </div>
          </div>
        </div>

        {/* AI INSIGHTS */}
        <div className="space-y-4 md:space-y-6 w-full">
          <h2 className="text-xl md:text-2xl font-black text-[#0A2F1D] flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-[#FBC02D]" /> AI Engine
          </h2>
          <div className="space-y-4">
            {aiInsights.map((insight) => (
              <div key={insight.id} className={`p-5 md:p-6 rounded-2xl md:rounded-[2rem] shadow-sm border-l-4 ${insight.isPositiveForBuyer ? 'bg-white border-[#10893E]' : 'bg-white border-red-500'}`}>
                <div className="flex justify-between items-start mb-2 gap-2">
                  <span className="text-[9px] md:text-[10px] font-black text-[#627768] uppercase bg-slate-100 px-2 py-1 rounded-md shrink-0">{insight.commodity}</span>
                  <span className="text-[10px] font-black bg-[#0A2F1D] text-white px-2 py-1 rounded-lg shrink-0">{insight.confidence}</span>
                </div>
                <h3 className={`text-base md:text-lg font-black mb-2 flex items-center gap-1.5 ${insight.isPositiveForBuyer ? 'text-[#10893E]' : 'text-red-600'}`}>
                  {insight.isPositiveForBuyer ? <TrendingDown className="w-4 h-4 shrink-0" /> : <TrendingUp className="w-4 h-4 shrink-0" />} {insight.prediction}
                </h3>
                <p className="text-xs md:text-sm font-medium text-[#0A2F1D]/80 mb-4">{insight.reason}</p>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                  <p className="text-[10px] font-bold text-[#627768] uppercase mb-1">Action</p>
                  <p className="font-black text-[#0A2F1D] text-xs md:text-sm flex items-center justify-between">{insight.action} <ArrowRight className="w-3 h-3 text-[#10893E] shrink-0" /></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}