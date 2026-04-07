"use client";

import { useEffect, useState } from "react";
import { LineChart, Calendar, TrendingUp, AlertTriangle, CloudRain, Wind, Activity } from "lucide-react";
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function PricePredictionPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState("Wheat (Lok-1)");
  const [selectedMandi, setSelectedMandi] = useState("Ludhiana APMC");

  const [chartData, setChartData] = useState<any[]>([]);
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [availableMandis, setAvailableMandis] = useState<string[]>([]);
  const [availableCrops, setAvailableCrops] = useState<any[]>([]);

  // Helper function
  function formatDate(dateStr: string) {
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
    } catch { return dateStr; }
  }

  useEffect(() => {
    setMounted(true);
    // Fetch all crops for the primary dropdown once on mount
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://krishisetu-hhef.onrender.com";
    fetch(`${API_BASE}/crops`)
      .then(r => r.json())
      .then(data => {
        // Sort crops alphabetically just in case
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
        // 1. Fetch mandis available for crop
        const cropRes = await fetch(`${API_BASE}/crops/${encodeURIComponent(selectedCrop)}`);
        if (!cropRes.ok) throw new Error("Failed to fetch crops");
        const cropData = await cropRes.json();
        const mandiList = cropData.mandis ? cropData.mandis.map((m: any) => m.name) : [];
        setAvailableMandis(mandiList);

        let targetMandi = selectedMandi;
        if (mandiList.length > 0 && !mandiList.includes(targetMandi)) {
          targetMandi = mandiList[0];
          setSelectedMandi(targetMandi);
        }

        if (!targetMandi || mandiList.length === 0) {
           setChartData([]);
           setPrediction(null);
           setLoading(false);
           return;
        }

        // 2. Fetch history and pred
        const [histRes, predRes] = await Promise.all([
          fetch(`${API_BASE}/crops/${encodeURIComponent(selectedCrop)}/history?mandi=${encodeURIComponent(targetMandi)}`),
          fetch(`${API_BASE}/crops/${encodeURIComponent(selectedCrop)}/predict?mandi=${encodeURIComponent(targetMandi)}`)
        ]);

        if (!histRes.ok || !predRes.ok) throw new Error("API returned non-200 status");

        const histData = await histRes.json();
        const predData = await predRes.json();

        setPrediction(predData);

        let rows = histData.history || [];

        const currentPrice = predData.current_price || 2000;
        const forecastPrice = predData.predicted_price_weekly || Math.round(currentPrice * 1.05);

        const cData = rows.map((row: any, idx: number) => ({
          date: formatDate(row.date),
          price: row.price,
          forecast: (idx === rows.length - 1) ? row.price : undefined
        }));
        cData.push({ date: "+ 1 Day", price: undefined, forecast: Math.round(predData.predicted_price || currentPrice) });
        cData.push({ date: "+ 7 Days", price: undefined, forecast: forecastPrice });
        
        setChartData(cData);
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
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4 animate-pulse" />
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

  const currentPrice = prediction?.current_price || 0;
  const forecastPrice = prediction?.predicted_price_weekly || 0;
  const expectedGain = forecastPrice - currentPrice;
  const weather = prediction?.weather || { temp: 28, rainProbability: 20, description: "Unknown" };

  return (
    <main className="p-4 md:p-8 relative z-10 w-full animate-fade-in pb-24 overflow-x-hidden">
      {/* HEADER */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0A2F1D] mb-1 drop-shadow-sm flex items-center gap-2 md:gap-3">
            <LineChart className="w-6 h-6 md:w-8 md:h-8 text-[#10893E]" /> Price Forecast Model
          </h1>
          <p className="text-[#627768] font-medium text-sm md:text-base">Real-time KrishiSetu Model trajectories running on live datasets.</p>
        </div>

        {/* MOBILE OPTIMIZED DROPDOWNS */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          {/* Crop Selector */}
          <div className="relative w-full sm:w-48">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base md:text-lg pointer-events-none">🌾</span>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full pl-10 pr-8 py-3 bg-white border border-[#E2DFD3] rounded-xl font-bold text-[#0A2F1D] text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#10893E] appearance-none"
            >
              {availableCrops.length > 0 ? (
                availableCrops.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))
              ) : (
                <option value={selectedCrop}>{selectedCrop}</option>
              )}
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] md:text-xs text-[#8A9A90]">▼</span>
          </div>

          {/* Mandi Selector */}
          <div className="relative w-full sm:w-48">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base md:text-lg pointer-events-none">📍</span>
            <select
              value={selectedMandi}
              onChange={(e) => setSelectedMandi(e.target.value)}
              disabled={availableMandis.length === 0}
              className="w-full pl-10 pr-8 py-3 bg-white border border-[#E2DFD3] rounded-xl font-bold text-[#0A2F1D] text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#10893E] appearance-none disabled:opacity-50"
            >
              {availableMandis.length > 0 ? (
                availableMandis.map((mandi) => (
                  <option key={mandi}>{mandi}</option>
                ))
              ) : (
                <option value="">No Active Mandis</option>
              )}
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] md:text-xs text-[#8A9A90]">▼</span>
          </div>
        </div>
      </header>

      {/* GRAPH CONTAINER */}
      <div className="bg-white border border-[#E2DFD3] shadow-sm p-4 md:p-6 lg:p-8 rounded-2xl md:rounded-[2rem] mb-6 md:mb-8 relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 z-20 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-2xl md:rounded-[2rem]">
            <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-[#10893E]"></div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4 border-b border-[#0A2F1D]/5 pb-4 md:pb-6">
          <div>
            <h2 className="text-lg md:text-xl font-black text-[#0A2F1D] flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 md:w-5 md:h-5 text-[#10893E]" /> 30-Day Predictive Trajectory
            </h2>
            <p className="text-[#627768] font-bold text-[10px] md:text-sm">Historical API vs. AI Projection for {selectedMandi}</p>
          </div>
          <div className="bg-[#FDF8EE] border border-[#E2DFD3] p-3 md:p-4 rounded-xl text-left sm:text-right w-full sm:w-auto">
            <p className="text-[#8A9A90] text-[10px] md:text-xs font-bold uppercase tracking-widest mb-0.5 md:mb-1">Predicted 7-Day Target</p>
            <span className={`block text-2xl md:text-3xl font-black ${expectedGain >= 0 ? 'text-[#10893E]' : 'text-red-500'}`}>
              ₹{forecastPrice.toLocaleString()}<span className="text-xs md:text-sm font-bold text-[#627768]">/q</span>
            </span>
          </div>
        </div>

        {/* DYNAMIC RECHARTS GRAPH */}
        <div className="w-full h-56 sm:h-64 md:h-[350px] relative bg-[#061A10] rounded-xl md:rounded-2xl overflow-hidden shadow-inner border border-[#0A2F1D] p-2 md:p-6">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#10893E" strokeOpacity={0.15} />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#8A9A90", fontWeight: 500 }} dy={8} />
              <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#8A9A90", fontWeight: 500 }} tickFormatter={v => `₹${v}`} />
              <Tooltip
                formatter={(value: any) => [`₹${value?.toLocaleString("en-IN")}`, "Price"]}
                contentStyle={{ borderRadius: "8px", border: "1px solid #10893E", backgroundColor: "#0A2F1D", color: "#fff", fontSize: "11px", fontWeight: 600 }}
                itemStyle={{ color: "#FBC02D" }}
              />
              <Line type="monotone" dataKey="price" stroke="#10893E" strokeWidth={2.5} dot={{ r: 3, fill: "#10893E", strokeWidth: 0 }} activeDot={{ r: 5 }} connectNulls={false} />
              <Line type="monotone" dataKey="forecast" stroke="#FBC02D" strokeWidth={2.5} strokeDasharray="6 4" dot={{ r: 4, fill: "#FBC02D", strokeWidth: 0 }} connectNulls={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* MARKET DRIVERS DYNAMICALLY POPULATED */}
      <div>
        <h2 className="text-lg md:text-xl font-black text-[#0A2F1D] mb-4">Live API Diagnostics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

          <div className="bg-white border border-[#E2DFD3] shadow-sm p-5 md:p-6 rounded-2xl md:rounded-[2rem] hover:-translate-y-1 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl md:text-2xl border border-blue-100">
                <CloudRain className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <span className="text-[8px] md:text-[10px] font-black text-blue-800 bg-blue-100 px-2 py-1 rounded shadow-sm uppercase tracking-wide">Weather State</span>
            </div>
            <h3 className="font-bold text-[#0A2F1D] text-base md:text-lg mb-1 md:mb-2">{weather.description} ({weather.temp}°C)</h3>
            <p className="text-[10px] md:text-xs font-medium text-[#627768]">Live conditions at {selectedMandi}. Current rain probability sits at {weather.rainProbability}% affecting logistics.</p>
          </div>

          <div className="bg-white border border-[#E2DFD3] shadow-sm p-5 md:p-6 rounded-2xl md:rounded-[2rem] hover:-translate-y-1 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#FDF8EE] text-[#FBC02D] flex items-center justify-center text-xl md:text-2xl border border-[#FDE08B]">
                <Activity className="w-5 h-5 md:w-6 md:h-6 text-[#D49800]" />
              </div>
              <span className="text-[8px] md:text-[10px] font-black text-[#D49800] bg-[#FFF9E6] px-2 py-1 rounded shadow-sm uppercase tracking-wide">AI Insight</span>
            </div>
            <h3 className="font-bold text-[#0A2F1D] text-base md:text-lg mb-1 md:mb-2">{prediction?.recommendation?.action || "Analyzing..."}</h3>
            <p className="text-[10px] md:text-xs font-medium text-[#627768] line-clamp-3">{prediction?.recommendation?.text || "Evaluating market conditions via historical trajectory."}</p>
          </div>

          <div className="bg-white border border-[#E2DFD3] shadow-sm p-5 md:p-6 rounded-2xl md:rounded-[2rem] hover:-translate-y-1 transition-all sm:col-span-2 lg:col-span-1">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-green-50 text-emerald-600 flex items-center justify-center text-xl md:text-2xl border border-green-100">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <span className="text-[8px] md:text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-1 rounded shadow-sm uppercase tracking-wide">Profit Margin</span>
            </div>
            <h3 className={`font-bold text-base md:text-lg mb-1 md:mb-2 ${expectedGain >= 0 ? "text-[#10893E]" : "text-red-500"}`}>
              {expectedGain >= 0 ? "+" : "−"}₹{Math.abs(expectedGain).toLocaleString()} Forecast
            </h3>
            <p className="text-[10px] md:text-xs font-medium text-[#627768]">Expected difference from selling today versus holding for the projected week trajectory.</p>
          </div>

        </div>
      </div>

    </main>
  );
}