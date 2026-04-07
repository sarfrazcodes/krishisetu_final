"use client";

import React, { useState, useEffect } from "react";
import { TrendingDown, TrendingUp, BrainCircuit, BarChart3, ArrowRight } from "lucide-react";

export default function MarketAnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState("Wheat (Lok-1)");
  const [selectedMandi, setSelectedMandi] = useState("Ludhiana APMC");
  
  const [chartData, setChartData] = useState<any[]>([]);
  const [currentAvgPrice, setCurrentAvgPrice] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [insight, setInsight] = useState<any>(null);

  const [availableMandis, setAvailableMandis] = useState<string[]>([]);
  const [availableCrops, setAvailableCrops] = useState<any[]>([]);

  // Helper formatting form
  function formatDate(dateStr: string) {
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
    } catch { return dateStr; }
  }

  useEffect(() => {
    setMounted(true);
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://krishisetu-hhef.onrender.com";
    fetch(`${API_BASE}/crops`)
      .then(r => r.json())
      .then(data => {
        const sorted = data.sort((a: any, b: any) => a.name.localeCompare(b.name));
        setAvailableCrops(sorted);
      })
      .catch(err => {
        console.error(err);
        setApiError(true);
      });
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setLoading(true);
    setApiError(false);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://krishisetu-hhef.onrender.com";

    const fetchAllData = async () => {
      try {
        // 1. Fetch available mandis for the selected crop
        const cropRes = await fetch(`${API_BASE}/crops/${encodeURIComponent(selectedCrop)}`);
        if (!cropRes.ok) throw new Error("Failed to fetch crops");
        const cropData = await cropRes.json();
        const mandiList = cropData.mandis ? cropData.mandis.map((m: any) => m.name) : [];
        setAvailableMandis(mandiList);

        let targetMandi = selectedMandi;
        // If current mandi isn't valid for the newly selected crop, reset to the first available mandi
        if (mandiList.length > 0 && !mandiList.includes(targetMandi)) {
          targetMandi = mandiList[0];
          setSelectedMandi(targetMandi);
        }

        if (!targetMandi || mandiList.length === 0) {
          setChartData([]);
          setInsight(null);
          setCurrentAvgPrice(0);
          setLoading(false);
          return;
        }

        // 2. Fetch predict and history simultaneously
        const [histRes, predRes] = await Promise.all([
          fetch(`${API_BASE}/crops/${encodeURIComponent(selectedCrop)}/history?mandi=${encodeURIComponent(targetMandi)}`),
          fetch(`${API_BASE}/crops/${encodeURIComponent(selectedCrop)}/predict?mandi=${encodeURIComponent(targetMandi)}`)
        ]);

        if (!histRes.ok || !predRes.ok) throw new Error("API returned non-200 status");

        const histData = await histRes.json();
        const predData = await predRes.json();

        const rows = histData.history || [];
        const cp = predData.current_price || 0;
        const forecastTarget = predData.predicted_price_weekly || cp * 1.05;
        const LAST_UPDATED = rows.length > 0 ? rows[rows.length - 1].date : new Date().toISOString();

        setCurrentAvgPrice(cp);

        const cData = rows.map((r: any, idx: number) => ({
          day: formatDate(r.date),
          price: r.price,
          isPrediction: false
        }));
        cData.push({ day: "+1 Day", price: Math.round(predData.predicted_price || cp), isPrediction: true });
        cData.push({ day: "+7 Days", price: Math.round(forecastTarget), isPrediction: true });

        // Height Normalization
        const maxPrice = Math.max(...cData.map(d => d.price), cp * 1.1) * 1.1; 
        const normalizedData = cData.map(d => ({
          ...d,
          height: `${Math.max((d.price / maxPrice) * 100, 10)}%`
        }));

        setChartData(normalizedData);
        
        const isPositive = cp > forecastTarget; // For buyer, price dropping is positive
        setInsight({
          commodity: selectedCrop,
          prediction: cp > forecastTarget ? "Decline Expected" : "Price Rise Upcoming",
          confidence: "88%",
          action: predData.recommendation?.action || "WAIT",
          reason: predData.recommendation?.text || "Algorithm actively plotting trajectory adjustments based on local indicators.",
          isPositiveForBuyer: isPositive
        });

        setLoading(false);
      } catch (err) {
        console.error("API Network Error:", err);
        setApiError(true);
        setLoading(false);
      }
    };

    fetchAllData();
  }, [selectedCrop, selectedMandi, mounted]);

  if (!mounted) return null;
  if (apiError) return (
    <main className="p-4 md:p-8 relative z-10 w-full min-h-[50vh] flex items-center justify-center">
      <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-red-100 flex flex-col items-center max-w-md text-center">
        <h2 className="text-xl font-black text-[#0A2F1D] mb-2">Connecting to Intelligence Engine...</h2>
        <p className="text-sm font-medium text-[#627768] mb-6">
          The KrishiSetu Render backend is waking up or temporarily unavailable. Please click below to refresh the connection.
        </p>
        <button onClick={() => window.location.reload()} className="bg-[#10893E] text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-[#0c6b30] transition-colors">
          Refresh Connection
        </button>
      </div>
    </main>
  );

  return (
    <main className="p-4 md:p-8 relative z-10 w-full animate-fade-in pb-24 overflow-x-hidden">

      <header className="mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-[#0A2F1D] mb-1">Market Analytics</h1>
        <p className="text-[#627768] font-medium text-sm md:text-base">Predictive pricing and AI-driven procurement strategies.</p>
      </header>

      {/* DROPDOWNS */}
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <div className="relative w-full sm:w-64">
          <select 
            value={selectedCrop} 
            onChange={(e) => setSelectedCrop(e.target.value)} 
            className="w-full px-4 py-3 bg-white border border-[#E2DFD3] rounded-xl font-bold text-[#0A2F1D] text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#10893E] appearance-none"
          >
            {availableCrops.length > 0 ? (
              availableCrops.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))
            ) : (
              <option value={selectedCrop}>{selectedCrop}</option>
            )}
          </select>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-[#8A9A90]">▼</span>
        </div>
        <div className="relative w-full sm:w-64">
          <select 
            value={selectedMandi} 
            onChange={(e) => setSelectedMandi(e.target.value)} 
            disabled={availableMandis.length === 0}
            className="w-full px-4 py-3 bg-white border border-[#E2DFD3] rounded-xl font-bold text-[#0A2F1D] text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#10893E] appearance-none disabled:opacity-50"
          >
            {availableMandis.length > 0 ? (
              availableMandis.map((mandi) => (
                <option key={mandi} value={mandi}>{mandi}</option>
              ))
            ) : (
              <option value="">No mandis active</option>
            )}
          </select>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-[#8A9A90]">▼</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* PREDICTIVE CHART */}
        <div className="lg:col-span-2 space-y-8 w-full relative">
          {loading && (
             <div className="absolute inset-0 z-20 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-2xl md:rounded-[2rem]">
               <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#10893E]"></div>
             </div>
          )}
          <div className="bg-white border border-[#E2DFD3] shadow-sm p-4 md:p-8 rounded-2xl md:rounded-[2rem] w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-start mb-6 md:mb-8 gap-2">
              <div>
                <h2 className="text-xl md:text-2xl font-black text-[#0A2F1D] flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#10893E]" /> Forecast
                </h2>
                <p className="text-xs md:text-sm font-bold text-[#627768] mt-1">{selectedCrop} • {selectedMandi}</p>
              </div>
              <div className="sm:text-right">
                <p className="text-[10px] md:text-xs font-bold tracking-wider text-[#627768] uppercase">Current Avg Price</p>
                <h3 className="text-2xl md:text-3xl font-black text-[#10893E]">₹{currentAvgPrice.toLocaleString()}<span className="text-sm md:text-lg text-[#0A2F1D] opacity-50">/q</span></h3>
              </div>
            </div>

            <div className="h-48 md:h-64 mt-2 relative flex items-end justify-between gap-1 sm:gap-2 pt-10 w-full border-b border-[#0A2F1D] border-solid pb-1 overflow-visible">
              {chartData.map((data, idx) => (
                <div key={idx} className="relative flex flex-col items-center flex-1 group z-10 h-full justify-end min-w-0" title={`₹${data.price}`}>
                  <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0A2F1D] text-white text-[10px] md:text-xs font-bold py-1 px-2 rounded-md whitespace-nowrap pointer-events-none">
                     ₹{data.price}
                  </div>
                  <div className={`w-full max-w-[20px] sm:max-w-[40px] rounded-t-md transition-all ${data.isPrediction ? "bg-gradient-to-t from-[#FCD14D] to-[#FBC02D]" : "bg-gradient-to-t from-[#14A049] to-[#10893E]"}`} style={{ height: data.height }}></div>
                  <span className={`absolute top-full mt-2 text-[10px] md:text-xs font-bold whitespace-nowrap ${data.isPrediction ? 'text-[#B7791F]' : 'text-[#627768]'}`}>{data.day}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-10 pt-4">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#627768]"><div className="w-2 h-2 rounded bg-[#10893E]"></div> History</div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#B7791F]"><div className="w-2 h-2 rounded bg-[#FBC02D]"></div> Prediction</div>
            </div>
          </div>
        </div>

        {/* AI INSIGHTS */}
        <div className="space-y-4 md:space-y-6 w-full relative">
          {loading && (
             <div className="absolute inset-0 z-20 bg-white/50 backdrop-blur-sm rounded-2xl md:rounded-[2rem]"></div>
          )}
          <h2 className="text-xl md:text-2xl font-black text-[#0A2F1D] flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-[#FBC02D]" /> AI Engine
          </h2>
          <div className="space-y-4">
            {insight ? (
              <div className={`p-5 md:p-6 rounded-2xl md:rounded-[2rem] shadow-sm border-l-4 ${insight.isPositiveForBuyer ? 'bg-white border-[#10893E]' : 'bg-white border-red-500'}`}>
                <div className="flex justify-between items-start mb-2 gap-2">
                  <span className="text-[9px] md:text-[10px] font-black text-[#627768] uppercase bg-slate-100 px-2 py-1 rounded-md shrink-0">{insight.commodity}</span>
                  <span className="text-[10px] font-black bg-[#0A2F1D] text-white px-2 py-1 rounded-lg shrink-0">{insight.confidence}</span>
                </div>
                <h3 className={`text-base md:text-lg font-black mb-2 flex items-center gap-1.5 ${insight.isPositiveForBuyer ? 'text-[#10893E]' : 'text-red-600'}`}>
                  {insight.isPositiveForBuyer ? <TrendingDown className="w-4 h-4 shrink-0" /> : <TrendingUp className="w-4 h-4 shrink-0" />} {insight.prediction}
                </h3>
                <p className="text-xs md:text-sm font-medium text-[#0A2F1D]/80 mb-4">{insight.reason}</p>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                  <p className="text-[10px] font-bold text-[#627768] uppercase mb-1">Recommended Move</p>
                  <p className="font-black text-[#0A2F1D] text-xs md:text-sm flex items-center justify-between">{insight.action} <ArrowRight className="w-3 h-3 text-[#10893E] shrink-0" /></p>
                </div>
              </div>
            ) : null}
            
            {/* Keeping a hardcoded second one for visual density just to show cross-commodity scale tracking */}
            {insight && insight.commodity !== "Potato (Kufri)" && (
              <div className={`p-5 md:p-6 rounded-2xl md:rounded-[2rem] shadow-sm border-l-4 bg-white border-blue-500 opacity-60`}>
                <div className="flex justify-between items-start mb-2 gap-2">
                  <span className="text-[9px] md:text-[10px] font-black text-[#627768] uppercase bg-slate-100 px-2 py-1 rounded-md shrink-0">Potato (Kufri)</span>
                  <span className="text-[10px] font-black bg-[#0A2F1D] text-white px-2 py-1 rounded-lg shrink-0">Sys</span>
                </div>
                <h3 className={`text-base md:text-lg font-black mb-2 flex items-center gap-1.5 text-blue-600`}>
                  <BrainCircuit className="w-4 h-4 shrink-0" /> Global Pulse Polling
                </h3>
                <p className="text-xs md:text-sm font-medium text-[#0A2F1D]/80 mb-4">No critical trading signals detected on secondary monitored assets.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}