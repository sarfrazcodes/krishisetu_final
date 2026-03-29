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

  // Helper function
  function formatDate(dateStr: string) {
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
    } catch { return dateStr; }
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setLoading(true);
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://krishisetu-hhef.onrender.com";

    Promise.all([
      fetch(`${API_BASE}/crops/${encodeURIComponent(selectedCrop)}/history`).then(r => r.json()),
      fetch(`${API_BASE}/crops/${encodeURIComponent(selectedCrop)}/predict?mandi=${encodeURIComponent(selectedMandi)}`).then(r => r.json())
    ])
      .then(([histData, predData]) => {
        setPrediction(predData);

        let rows = histData.history || [];
        let cData = [];

        const currentPrice = predData.current_price || 2000;
        const forecastPrice = predData.predicted_price_weekly || Math.round(currentPrice * 1.05);

        if (rows.length <= 1) {
          cData = [
            { date: "Current", price: currentPrice, forecast: currentPrice },
            { date: "Tomorrow", price: undefined, forecast: Math.round(currentPrice * 1.02) },
            { date: "Day 3", price: undefined, forecast: Math.round(currentPrice + ((forecastPrice - currentPrice) * 0.4)) },
            { date: "Day 5", price: undefined, forecast: Math.round(currentPrice + ((forecastPrice - currentPrice) * 0.7)) },
            { date: "7-Days", price: undefined, forecast: forecastPrice },
          ];
        } else {
          cData = rows.map((row: any, idx: number) => ({
            date: formatDate(row.date),
            price: row.price,
            forecast: (idx === rows.length - 1) ? row.price : undefined
          }));
          cData.push({ date: "Tomorrow", price: undefined, forecast: Math.round(predData.predicted_price || currentPrice) });
          cData.push({ date: "7-Days", price: undefined, forecast: forecastPrice });
        }
        setChartData(cData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [selectedCrop, selectedMandi, mounted]);

  if (!mounted) return null;

  const currentPrice = prediction?.current_price || 0;
  const forecastPrice = prediction?.predicted_price_weekly || 0;
  const expectedGain = forecastPrice - currentPrice;
  const weather = prediction?.weather || { temp: 28, rainProbability: 20, description: "Unknown" };

  return (
    <main className="p-4 md:p-8 relative z-10 w-full animate-fade-in pb-24">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#0A2F1D] mb-1 drop-shadow-sm flex items-center gap-3">
            <LineChart className="w-8 h-8 text-[#10893E]" /> Price Forecast Model
          </h1>
          <p className="text-[#627768] font-medium">Real-time XGBoost trajectories running on live KrishiSetu APMC datasets.</p>
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
              <option>Potato (Kufri)</option>
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
      <div className="bg-white border border-[#E2DFD3] shadow-sm p-6 md:p-8 rounded-[2rem] mb-8 relative min-h-[450px]">
        {loading && (
          <div className="absolute inset-0 z-20 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-[2rem]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10893E]"></div>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-[#0A2F1D]/5 pb-6">
          <div>
            <h2 className="text-xl font-black text-[#0A2F1D] flex items-center gap-2 mb-1">
              <Calendar className="w-5 h-5 text-[#10893E]" /> 30-Day Predictive Trajectory
            </h2>
            <p className="text-[#627768] font-bold text-sm">Dynamic historical API vs. AI Projection for {selectedMandi}</p>
          </div>
          <div className="bg-[#FDF8EE] border border-[#E2DFD3] p-4 rounded-xl text-right">
            <p className="text-[#8A9A90] text-xs font-bold uppercase tracking-widest mb-1">Predicted 7-Day Target</p>
            <span className={`block text-3xl font-black ${expectedGain >= 0 ? 'text-[#10893E]' : 'text-red-500'}`}>
              ₹{forecastPrice.toLocaleString()}<span className="text-sm font-bold text-[#627768]">/q</span>
            </span>
          </div>
        </div>

        {/* DYNAMIC RECHARTS GRAPH */}
        <div className="w-full aspect-[2/1] md:aspect-[3/1] max-h-[350px] relative bg-[#061A10] rounded-2xl overflow-hidden shadow-inner border border-[#0A2F1D] p-4 md:p-6">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#10893E" strokeOpacity={0.15} />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#8A9A90", fontWeight: 500 }} dy={8} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#8A9A90", fontWeight: 500 }} tickFormatter={v => `₹${v}`} />
              <Tooltip
                formatter={(value: any) => [`₹${value?.toLocaleString("en-IN")}`, "Price"]}
                contentStyle={{ borderRadius: "10px", border: "1px solid #10893E", backgroundColor: "#0A2F1D", color: "#fff", fontSize: "12px", fontWeight: 600 }}
                itemStyle={{ color: "#FBC02D" }}
              />
              <Line type="monotone" dataKey="price" stroke="#10893E" strokeWidth={3} dot={{ r: 4, fill: "#10893E", strokeWidth: 0 }} activeDot={{ r: 6 }} connectNulls={false} />
              <Line type="monotone" dataKey="forecast" stroke="#FBC02D" strokeWidth={3} strokeDasharray="6 4" dot={{ r: 5, fill: "#FBC02D", strokeWidth: 0 }} connectNulls={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* MARKET DRIVERS DYNAMICALLY POPULATED */}
      <div>
        <h2 className="text-xl font-black text-[#0A2F1D] mb-4">Live API Diagnostics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white border border-[#E2DFD3] shadow-sm p-6 rounded-[2rem]">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl border border-blue-100">
                <CloudRain className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-blue-800 bg-blue-100 px-2 py-1 rounded shadow-sm uppercase tracking-wide">Weather State</span>
            </div>
            <h3 className="font-bold text-[#0A2F1D] text-lg mb-2">{weather.description} ({weather.temp}°C)</h3>
            <p className="text-sm font-medium text-[#627768]">Live conditions at {selectedMandi}. Current rain probability sits at {weather.rainProbability}% affecting logistics.</p>
          </div>

          <div className="bg-white border border-[#E2DFD3] shadow-sm p-6 rounded-[2rem]">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#FDF8EE] text-[#FBC02D] flex items-center justify-center text-2xl border border-[#FDE08B]">
                <Activity className="w-6 h-6 text-[#D49800]" />
              </div>
              <span className="text-[10px] font-black text-[#D49800] bg-[#FFF9E6] px-2 py-1 rounded shadow-sm uppercase tracking-wide">AI Recommendation</span>
            </div>
            <h3 className="font-bold text-[#0A2F1D] text-lg mb-2">{prediction?.recommendation?.action || "Analyzing..."}</h3>
            <p className="text-sm font-medium text-[#627768] line-clamp-3">{prediction?.recommendation?.text || "Evaluating market conditions via historical trajectory."}</p>
          </div>

          <div className="bg-white border border-[#E2DFD3] shadow-sm p-6 rounded-[2rem]">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 text-emerald-600 flex items-center justify-center text-2xl border border-green-100">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-1 rounded shadow-sm uppercase tracking-wide">Profit Margin</span>
            </div>
            <h3 className={`font-bold text-lg mb-2 ${expectedGain >= 0 ? "text-[#10893E]" : "text-red-500"}`}>
              {expectedGain >= 0 ? "+" : "−"}₹{Math.abs(expectedGain).toLocaleString()} Forecast
            </h3>
            <p className="text-sm font-medium text-[#627768]">Expected difference from selling today versus holding for the projected week trajectory.</p>
          </div>

        </div>
      </div>

    </main>
  );
}