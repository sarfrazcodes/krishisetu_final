"use client";

import { useEffect, useState } from "react";
import { LineChart, Calendar, TrendingUp, AlertTriangle } from "lucide-react";

export default function PricePredictionPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState("Wheat (Lok-1)");
  const [selectedMandi, setSelectedMandi] = useState("Ludhiana APMC");

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
            <LineChart className="w-8 h-8 text-[#10893E]" /> Price Forecast Model
          </h1>
          <p className="text-[#627768] font-medium">AI-driven trajectory plotting aligned with historical market datasets.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
          <div className="bg-white px-4 py-3 rounded-xl border border-[#E2DFD3] shadow-sm flex items-center space-x-3">
            <span className="text-lg">🌾</span>
            <select 
              value={selectedCrop} 
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="bg-transparent font-bold text-[#0A2F1D] focus:outline-none appearance-none cursor-pointer pr-4"
            >
              <option>Wheat (Lok-1)</option>
              <option>Basmati Rice</option>
              <option>Mustard Seed</option>
              <option>Soybean</option>
              <option>Cotton</option>
            </select>
          </div>
          <div className="bg-white px-4 py-3 rounded-xl border border-[#E2DFD3] shadow-sm flex items-center space-x-3">
            <span className="text-lg">📍</span>
            <select 
              value={selectedMandi}
              onChange={(e) => setSelectedMandi(e.target.value)}
              className="bg-transparent font-bold text-[#0A2F1D] focus:outline-none appearance-none cursor-pointer pr-4"
            >
              <option>Ludhiana APMC</option>
              <option>Khanna APMC</option>
              <option>Karnal Mandi</option>
              <option>Delhi Azadpur</option>
            </select>
          </div>
        </div>
      </header>

      {/* GRAPH CONTAINER */}
      <div className="bg-white border border-[#E2DFD3] shadow-sm p-6 md:p-8 rounded-[2rem] mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-[#0A2F1D]/5 pb-6">
          <div>
            <h2 className="text-xl font-black text-[#0A2F1D] flex items-center gap-2 mb-1">
              <Calendar className="w-5 h-5 text-[#10893E]" /> 30-Day Predictive Trajectory
            </h2>
            <p className="text-[#627768] font-bold text-sm">Historical Data vs. AI Projection for {selectedCrop}</p>
          </div>
          <div className="bg-[#FDF8EE] border border-[#E2DFD3] p-4 rounded-xl text-right">
            <p className="text-[#8A9A90] text-xs font-bold uppercase tracking-widest mb-1">Projected Peak Date</p>
            <span className="block text-2xl font-black text-[#10893E]">₹2,550<span className="text-sm font-bold text-[#627768]">/q</span></span>
          </div>
        </div>

        {/* CUSTOM SVG GRAPH */}
        <div className="w-full aspect-[2/1] md:aspect-[3/1] max-h-[350px] relative bg-[#061A10] rounded-2xl overflow-hidden shadow-inner border border-[#0A2F1D] flex items-end">
          <svg viewBox="0 0 1000 300" className="w-full h-full overflow-visible p-4 md:p-8" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#10893E" strokeWidth="1" strokeOpacity="0.15" />
              </pattern>
              <linearGradient id="historyGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10893E" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#10893E" stopOpacity="0.0"/>
              </linearGradient>
              <pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="10" height="10">
                <path d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2" stroke="#FBC02D" strokeWidth="1" strokeOpacity="0.2" />
              </pattern>
            </defs>
            
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Grid Lines */}
            {[50, 125, 200, 275].map((y, i) => (
              <line key={i} x1="0" y1={y} x2="1000" y2={y} stroke="#10893E" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="4,4" />
            ))}

            <line x1="600" y1="0" x2="600" y2="300" stroke="#FBC02D" strokeWidth="2" strokeDasharray="6,4" opacity="0.6" />
            <rect x="560" y="10" width="80" height="24" rx="12" fill="#FBC02D" />
            <text x="600" y="26" fill="#0A2F1D" fontSize="12" fontWeight="bold" textAnchor="middle">TODAY</text>

            {/* Historic Path */}
            <path d="M0,250 C150,260 250,180 400,190 C500,200 550,130 600,120 L600,300 L0,300 Z" fill="url(#historyGlow)" />
            <path d="M0,250 C150,260 250,180 400,190 C500,200 550,130 600,120" fill="none" stroke="#10893E" strokeWidth="4" strokeLinecap="round" />

            {/* AI Future Path */}
            <path d="M600,120 C700,100 750,50 850,40 C900,35 950,50 1000,55 L1000,300 L600,300 Z" fill="url(#diagonalHatch)" />
            <path d="M600,120 C700,100 750,50 850,40 C900,35 950,50 1000,55" fill="none" stroke="#FBC02D" strokeWidth="4" strokeDasharray="8,8" strokeLinecap="round" />

            <circle cx="600" cy="120" r="6" fill="#fff" stroke="#10893E" strokeWidth="3" />
            <circle cx="850" cy="40" r="8" fill="#FBC02D" stroke="#000" strokeWidth="3" className="animate-pulse shadow-[0_0_15px_#FBC02D]" />
          </svg>
        </div>
      </div>

      {/* MARKET DRIVERS */}
      <div>
        <h2 className="text-xl font-black text-[#0A2F1D] mb-4">Dataset Sentiment Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-[#E2DFD3] shadow-sm p-6 rounded-[2rem] hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl border border-blue-100">
                ⛈️
              </div>
              <span className="text-[10px] font-black text-blue-800 bg-blue-100 px-2 py-1 rounded shadow-sm uppercase tracking-wide">Weather Impact</span>
            </div>
            <h3 className="font-bold text-[#0A2F1D] text-lg mb-2">Unseasonal Showers</h3>
            <p className="text-sm font-medium text-[#627768]">Meteorological datasets indicate upcoming rainfall in Northern zones, likely constricting supply and raising short-term prices.</p>
          </div>

          <div className="bg-white border border-[#E2DFD3] shadow-sm p-6 rounded-[2rem] hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#FDF8EE] text-[#FBC02D] flex items-center justify-center text-2xl border border-[#FDE08B]">
                <TrendingUp className="w-6 h-6 text-[#D49800]" />
              </div>
              <span className="text-[10px] font-black text-[#D49800] bg-[#FFF9E6] px-2 py-1 rounded shadow-sm uppercase tracking-wide">Export Demand</span>
            </div>
            <h3 className="font-bold text-[#0A2F1D] text-lg mb-2">Global Procurement</h3>
            <p className="text-sm font-medium text-[#627768]">International procurement data shows a 12% rise in demand for premium Indian variants, supporting higher baseline rates.</p>
          </div>

          <div className="bg-white border border-[#E2DFD3] shadow-sm p-6 rounded-[2rem] hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center text-2xl border border-red-100">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-red-800 bg-red-100 px-2 py-1 rounded shadow-sm uppercase tracking-wide">Risk Indicator</span>
            </div>
            <h3 className="font-bold text-[#0A2F1D] text-lg mb-2">Over-Yielding Reports</h3>
            <p className="text-sm font-medium text-[#627768]">Southern zone harvest datasets suggest a surplus which may cause a slight terminal price dip if sold late.</p>
          </div>
        </div>
      </div>

    </main>
  );
}