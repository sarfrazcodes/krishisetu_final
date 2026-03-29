"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingDown, TrendingUp, BrainCircuit, BarChart3, ArrowRight, Calendar, MapPin
} from "lucide-react";
import Link from "next/link";

// --- MOCK DATA ---
const aiInsights = [
  {
    id: 1,
    commodity: "Basmati Rice",
    prediction: "Steady Decline Expected",
    confidence: "91%",
    action: "Wait 2 days before bulk buying",
    reason: "New stock arrivals in Central mandis are causing a temporary surplus, driving prices down.",
    isPositiveForBuyer: true,
  },
  {
    id: 2,
    commodity: "Soybean",
    prediction: "High Volatility Upcoming",
    confidence: "82%",
    action: "Lock in current rates",
    reason: "Global market fluctuations are expected to spike local prices within the next 48 hours.",
    isPositiveForBuyer: false,
  }
];

// Mock chart data points (0-100 scale for CSS height)
const chartData = [
  { day: "Mon", price: 3100, height: "40%" },
  { day: "Tue", price: 3150, height: "50%" },
  { day: "Wed", price: 3200, height: "60%" },
  { day: "Thu", price: 3180, height: "55%" },
  { day: "Fri", price: 3250, height: "70%" },
  { day: "Sat", price: 3350, height: "90%", isPrediction: true },
  { day: "Sun", price: 3400, height: "100%", isPrediction: true },
];

export default function MarketAnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState("Wheat (Lok-1)");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="p-4 md:p-8 relative z-10 w-full animate-fade-in pb-24">

      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#0A2F1D] mb-1 drop-shadow-sm">Market Analytics</h1>
          <p className="text-[#627768] font-medium">Predictive pricing and AI-driven procurement strategies.</p>
        </div>

        <div className="flex space-x-4 items-center">
          <Link href="/buyer-dashboard/notifications">
            <button className="bg-white border border-[#E2DFD3] shadow-sm p-3 rounded-xl text-xl hover:scale-110 hover:-translate-y-1 transition-all relative">
              🔔<span className="absolute top-2 right-2 w-2 h-2 bg-[#FBC02D] rounded-full shadow-[0_0_8px_#FBC02D]"></span>
            </button>
          </Link>
        </div>
      </header>

      {/* CROP SELECTOR */}
      <div className="flex space-x-3 mb-8 overflow-x-auto hide-scrollbar pb-2">
        {['Wheat (Lok-1)', 'Mustard Seed', 'Potato (Kufri)', 'Basmati Rice'].map((crop) => (
          <button
            key={crop}
            onClick={() => setSelectedCrop(crop)}
            className={`px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all duration-300 ${selectedCrop === crop
                ? 'bg-[#0A2F1D] text-[#FDF8EE] shadow-[0_8px_15px_rgba(10,47,29,0.3)] scale-105'
                : 'bg-white border border-[#E2DFD3] shadow-sm text-[#627768] hover:bg-white hover:text-[#0A2F1D] border border-transparent hover:border-[#E2DFD3]'
              }`}
          >
            {crop}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT/MAIN COLUMN: PREDICTIVE CHART */}
        <div className="lg:col-span-2 space-y-8">

          <div className="bg-white border border-[#E2DFD3] shadow-sm p-6 md:p-8 rounded-[2rem] hover:shadow-[0_15px_30px_rgba(10,47,29,0.05)] transition-all">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-black text-[#0A2F1D] flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-[#10893E]" /> 7-Day Price Forecast
                </h2>
                <p className="text-sm font-bold text-[#627768] mt-1">{selectedCrop} • Punjab Region</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold tracking-wider text-[#627768] uppercase">Current Avg Price</p>
                <h3 className="text-3xl font-black text-[#10893E]">₹3,250<span className="text-lg text-[#0A2F1D] opacity-50">/q</span></h3>
              </div>
            </div>

            {/* CUSTOM CSS CHART */}
            <div className="h-64 mt-4 relative flex items-end justify-between gap-2 md:gap-4 pt-10">
              {/* Horizontal grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="w-full border-t border-[#0A2F1D] border-dashed"></div>
                <div className="w-full border-t border-[#0A2F1D] border-dashed"></div>
                <div className="w-full border-t border-[#0A2F1D] border-dashed"></div>
                <div className="w-full border-t border-[#0A2F1D] border-solid"></div>
              </div>

              {chartData.map((data, idx) => (
                <div key={idx} className="relative flex flex-col items-center flex-1 group z-10 h-full justify-end">
                  {/* Tooltip */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0A2F1D] text-white text-xs font-bold py-1 px-2 rounded-lg whitespace-nowrap z-20 pointer-events-none shadow-lg">
                    ₹{data.price}
                  </div>

                  {/* Bar */}
                  <div
                    className={`w-full max-w-[40px] rounded-t-xl transition-all duration-700 ease-out group-hover:brightness-110 ${data.isPrediction
                        ? "bg-gradient-to-t from-[#FCD14D] to-[#FBC02D] shadow-[0_0_15px_rgba(251,192,45,0.4)]"
                        : "bg-gradient-to-t from-[#14A049] to-[#10893E] shadow-[0_0_15px_rgba(16,137,62,0.3)]"
                      }`}
                    style={{ height: data.height }}
                  >
                    {data.isPrediction && (
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:10px_10px] animate-[slide_1s_linear_infinite] rounded-t-xl opacity-50"></div>
                    )}
                  </div>
                  <span className={`mt-3 text-xs font-bold ${data.isPrediction ? 'text-[#FBC02D] drop-shadow-sm' : 'text-[#627768]'}`}>
                    {data.day}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-6 mt-6 pt-6 border-t border-[#0A2F1D]/10">
              <div className="flex items-center gap-2 text-xs font-bold text-[#627768]">
                <div className="w-3 h-3 rounded bg-[#10893E]"></div> Historical Data
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#627768]">
                <div className="w-3 h-3 rounded bg-[#FBC02D]"></div> AI Prediction
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI INSIGHTS */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-[#0A2F1D] drop-shadow-sm flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-[#FBC02D]" /> AI Sourcing Engine
          </h2>

          <div className="space-y-4">
            {aiInsights.map((insight) => (
              <div
                key={insight.id}
                className={`p-6 rounded-[2rem] shadow-lg relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 border-l-4 ${insight.isPositiveForBuyer
                    ? 'bg-gradient-to-br from-[#10893E]/5 to-white border-[#10893E]'
                    : 'bg-gradient-to-br from-red-500/5 to-white border-red-500'
                  }`}
              >
                {/* Background decorative blob */}
                <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[40px] opacity-20 pointer-events-none ${insight.isPositiveForBuyer ? 'bg-[#10893E]' : 'bg-red-500'
                  }`}></div>

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black tracking-widest text-[#627768] uppercase bg-white/60 px-2 py-1 rounded-md shadow-sm">
                      {insight.commodity}
                    </span>
                    <span className="text-xs font-black bg-[#0A2F1D] text-white px-2 py-1 rounded-lg">
                      {insight.confidence} Accuracy
                    </span>
                  </div>

                  <h3 className={`text-xl font-black mb-1 flex items-center gap-2 ${insight.isPositiveForBuyer ? 'text-[#10893E]' : 'text-red-600'
                    }`}>
                    {insight.isPositiveForBuyer ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                    {insight.prediction}
                  </h3>

                  <p className="text-sm font-medium text-[#0A2F1D]/80 mb-4">
                    {insight.reason}
                  </p>

                  <div className="bg-white/80 border border-white p-3 rounded-xl shadow-inner">
                    <p className="text-xs font-bold text-[#627768] uppercase tracking-wider mb-1">Recommended Action</p>
                    <p className="font-black text-[#0A2F1D] text-sm flex items-center justify-between">
                      {insight.action}
                      <ArrowRight className="w-4 h-4 text-[#10893E]" />
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
