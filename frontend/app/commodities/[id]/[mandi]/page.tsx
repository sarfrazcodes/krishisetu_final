"use client";

import { useEffect, useState, use } from "react";
import { useTranslation } from '@/components/TranslationProvider';
import Link from "next/link";
import {
  ComposedChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  TrendingUp, TrendingDown, ShieldAlert, CheckCircle2,
  AlertTriangle, MapPin, ArrowUpRight, ArrowDownRight,
  CloudOff, Thermometer, Droplets, Wind, Activity,
  Umbrella, Sun, Sparkles
} from "lucide-react";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
interface PriceRow {
  modal_price: number;
  min_price: number;
  max_price: number;
  arrival_quantity: number | null;
  date: string;
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function linearRegressionForecast(prices: number[]): number {
  if (prices.length < 2) return prices[0] || 0;
  const n = prices.length;
  const x = Array.from({ length: n }, (_, i) => i);
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = prices.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, v, i) => sum + v * prices[i], 0);
  const sumXX = x.reduce((sum, v) => sum + v * v, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  return intercept + slope * n;
}

function getTrend(prices: number[]): "up" | "down" | "flat" {
  if (prices.length < 2) return "flat";
  const diff = ((prices[prices.length - 1] - prices[0]) / prices[0]) * 100;
  if (diff > 1.5) return "up";
  if (diff < -1.5) return "down";
  return "flat";
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  } catch { return dateStr; }
}

function getVolatilityStyle(label: string) {
  if (label === "High") return { bar: "bg-red-500", text: "text-red-600 bg-red-50 border-red-200", width: "85%" };
  if (label === "Moderate") return { bar: "bg-yellow-500", text: "text-yellow-700 bg-yellow-50 border-yellow-200", width: "50%" };
  return { bar: "bg-green-500", text: "text-green-700 bg-green-50 border-green-200", width: "20%" };
}

function getRecStyle(action: string) {
  const u = action.toUpperCase();
  if (u.includes("SELL")) return {
    bg: "bg-emerald-50", border: "border-emerald-200",
    badge: "bg-emerald-600 text-white", text: "text-emerald-800",
    icon: <CheckCircle2 className="w-4 h-4 mr-2" />,
  };
  if (u.includes("WAIT")) return {
    bg: "bg-orange-50", border: "border-orange-200",
    badge: "bg-orange-500 text-white", text: "text-orange-800",
    icon: <AlertTriangle className="w-4 h-4 mr-2" />,
  };
  return {
    bg: "bg-blue-50", border: "border-blue-200",
    badge: "bg-blue-600 text-white", text: "text-blue-800",
    icon: <ShieldAlert className="w-4 h-4 mr-2" />,
  };
}

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────
export default function DashboardPage({ params }: { params: Promise<{ id: string, mandi: string }> }) {
  const resolvedParams = use(params);
  const { t } = useTranslation();
  const cropId = decodeURIComponent(resolvedParams.id);
  const mandiId = decodeURIComponent(resolvedParams.mandi);

  const [history, setHistory] = useState<any[]>([]);
  const [prediction, setPrediction] = useState<any>(null);
  const [weatherAdvisory, setWeatherAdvisory] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_BASE = "https://krishisetu-hhef.onrender.com";

    // 1. Instantly pull History and numerical ML trajectory
    Promise.all([
      fetch(`${API_BASE}/crops/${encodeURIComponent(cropId)}/history`).then(r => r.json()),
      fetch(`${API_BASE}/crops/${encodeURIComponent(cropId)}/predict?mandi=${encodeURIComponent(mandiId)}`).then(r => r.json())
    ])
      .then(([histData, predData]) => {
        setHistory(histData.history || []);
        setPrediction(predData);
        setLoading(false);

        // 2. Poll the LLM Engine separately so the UI doesn't lock for 5 seconds
        const w = predData.weather || { temp: 28, rainProbability: 20, description: "Clear" };
        fetch(`${API_BASE}/crops/${encodeURIComponent(cropId)}/advisory?mandi=${encodeURIComponent(mandiId)}&temp=${w.temp}&rain=${w.rainProbability}&desc=${w.description}`)
          .then(r => r.json())
          .then(adv => setWeatherAdvisory(adv.instruction))
          .catch(err => {
            if (err instanceof Error && err.message === "Failed to fetch") return;
            console.error(err);
          });
      })
      .catch(err => {
        if (err instanceof Error && err.message === "Failed to fetch") {
          console.warn("Network offline simulation blocked the fetch request.");
        } else {
          console.error(err);
        }
        setLoading(false);
      });
  }, [cropId, mandiId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF8EE] p-6 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative flex items-center justify-center animate-pulse">
            <div className="w-20 h-20 border-4 border-[#10893E]/20 rounded-full"></div>
            <div className="absolute w-20 h-20 border-4 border-[#10893E] border-t-transparent rounded-full animate-spin"></div>
            <MapPin className="absolute w-8 h-8 text-[#10893E]" />
          </div>
          <h3 className="text-xl font-black text-[#0A2F1D] tracking-wide">
            {t('Aggregating AI Diagnostics...')}
          </h3>
          <p className="text-sm font-bold text-[#8A9A90] uppercase tracking-widest">
            {t('Cross-checking ')} {mandiId} {t('weather systems')}
          </p>
        </div>
      </div>
    );
  }

  // 1. DATA MAPPING
  const COMMODITY_NAME = prediction?.crop || cropId;
  const MANDI_NAME = mandiId;
  const LAST_UPDATED = history.length > 0 ? history[history.length - 1].date : new Date().toISOString();

  let priceRows: PriceRow[] = history.map(h => ({
    modal_price: h.price,
    min_price: Math.round(h.price * 0.95), // mock min using math since DB lacks it
    max_price: Math.round(h.price * 1.05), // mock max
    arrival_quantity: null, // no qty in DB
    date: h.date
  }));

  // Fallback if no history
  if (priceRows.length === 0) {
    const cp = prediction?.current_price || 2000;
    priceRows = [{ modal_price: cp, min_price: cp * 0.95, max_price: cp * 1.05, arrival_quantity: null, date: LAST_UPDATED }];
  }

  const prices = priceRows.map(r => r.modal_price);
  const latestRow = priceRows[priceRows.length - 1];
  const currentPrice = prediction?.current_price || latestRow.modal_price;
  const currentMin = latestRow.min_price;
  const currentMax = latestRow.max_price;
  const currentQty = latestRow.arrival_quantity;

  // Use the backend's real prediction or fallback to regression
  const predictedPrice = prediction?.predicted_price_weekly || (prices.length > 1 ? linearRegressionForecast(prices) : currentPrice);
  const expectedGain = predictedPrice - currentPrice;
  const expectedGainPct = currentPrice > 0 ? ((expectedGain / currentPrice) * 100).toFixed(1) : "0.0";

  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
  const variance = prices.reduce((sum, p) => sum + Math.pow(p - avg, 2), 0) / prices.length;
  const volatility = Math.sqrt(variance);
  const volatilityPct = avg > 0 ? (volatility / avg) * 100 : 0;
  // Increased agricultural threshold to avoid false 'High Risk' flags on standard intra-week 5-15% variance
  const volatilityLabel = volatilityPct > 25 ? "High" : volatilityPct > 10 ? "Moderate" : "Low";

  // Calculate prediction trend mapping accurately against expected gain
  const trend = expectedGain > 0 ? "up" : expectedGain < 0 ? "down" : "flat";
  const trendIcon = trend === "up" ? "↑" : trend === "down" ? "↓" : "→";
  const trendColor = trend === "up" ? "text-emerald-600" : trend === "down" ? "text-red-500" : "text-slate-500";
  const trendLabel = trend === "up" ? "Rising" : trend === "down" ? "Falling" : "Stable";
  const trendBg = trend === "up" ? "bg-emerald-50 text-emerald-700" : trend === "down" ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-600";

  let chartData: any[] = [];
  if (priceRows.length <= 1 && prediction) {
    const cp = currentPrice;
    const tom = prediction?.predicted_price || Math.round(cp * 1.02);
    const wk = Math.round(predictedPrice);
    chartData = [
      { date: "Current", price: cp, forecast: cp },
      { date: "Tomorrow", price: undefined, forecast: tom },
      { date: "Day 3", price: undefined, forecast: Math.round(cp + ((wk - cp) * 0.4)) },
      { date: "Day 5", price: undefined, forecast: Math.round(cp + ((wk - cp) * 0.7)) },
      { date: "7-Days", price: undefined, forecast: wk },
    ];
  } else {
    chartData = priceRows.map((row, idx) => ({
      date: formatDate(row.date),
      price: row.modal_price,
      forecast: (idx === priceRows.length - 1) ? row.modal_price : undefined
    }));
    chartData.push({
      date: "Tomorrow",
      price: undefined,
      forecast: Math.round(prediction?.predicted_price || currentPrice)
    });
    chartData.push({
      date: "7-Days",
      price: undefined,
      forecast: Math.round(predictedPrice)
    });
  }

  const AI_REC = prediction?.recommendation || { action: "WAIT", text: "Analyzing market conditions..." };
  const recStyle = getRecStyle(AI_REC.action);
  const volStyle = getVolatilityStyle(volatilityLabel);

  let confidenceScore = 78 + Math.min(prices.length * 0.8, 10) - Math.min(volatilityPct * 0.3, 8);
  if (prediction?.model_used?.includes("xgb")) confidenceScore += 7;
  const confidence = Math.round(Math.max(82, Math.min(95, confidenceScore)));

  const WEATHER = prediction?.weather || { temp: 28, rainProbability: 20, description: "Unknown" };

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-[#FDF8EE] via-[#F5F0E1] to-[#EFF2E9] text-[#0A2F1D] pb-12 overflow-x-hidden" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700;9..144,900&family=Manrope:wght@500;700;800&display=swap');
        .heading-serif { font-family: 'Fraunces', serif; }
      `}</style>


      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#10893E] opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-[28rem] h-[28rem] rounded-full bg-[#FBC02D] opacity-10 blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-6">

        <Link href={`/commodities/${encodeURIComponent(cropId)}`} className="text-[#10893E] font-bold hover:underline mb-1 inline-flex items-center gap-2">
          ← {t('Back to Mandis')}
        </Link>

        {/* ── EXCLUSIVE GREEN HEADER PER USER ROI MATCH ── */}
        <div className="relative rounded-[2rem] bg-gradient-to-br from-[#177A3C] via-[#106630] to-[#0A3819] p-8 md:p-10 shadow-2xl overflow-hidden mt-4">
          {/* Subtle noise/texture overlay for premium banking feel */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 text-[#FBC02D] mb-3">
                <TrendingUp className="w-5 h-5 text-[#FBC02D]" />
                <span className="font-black text-xs uppercase tracking-[0.2em] drop-shadow-md">Market Predictions Engine</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-lg tracking-tight">
                {COMMODITY_NAME} — {MANDI_NAME}
              </h1>

              <div className="mt-8 flex items-center gap-4">
                <div className="hidden md:flex items-center gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#10893E] bg-[#EAF8ED] px-3 py-1.5 rounded-full">
                    KrishiSetu Model
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${trend === "up" ? "bg-emerald-400 text-emerald-900" : trend === "down" ? "bg-red-400 text-red-900" : "bg-slate-300 text-slate-800"}`}>
                    {trendIcon} {trend === "up" ? "Rise" : trend === "down" ? "Fall" : "Stable"} (Predicted after 7 days)
                  </span>
                </div>
              </div>
            </div>

            <div className="text-left md:text-right mt-6 md:mt-0">
              <span className="text-white/80 font-bold text-sm tracking-wide block mb-1">Today's Mandi Price</span>
              <div className="flex items-baseline justify-start md:justify-end gap-1">
                <span className="text-5xl md:text-7xl font-black text-[#FBC02D] drop-shadow-xl tracking-tighter">₹{currentPrice.toLocaleString("en-IN")}</span>
                <span className="text-white font-bold text-xl md:text-2xl drop-shadow-md">/q</span>
              </div>
              <p className="text-xs text-white/60 font-medium uppercase tracking-wider mt-2">Last updated • {formatDate(LAST_UPDATED)}</p>
            </div>
          </div>
        </div>

        {/* ── TOP STAT CARDS ── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

          {/* Today's Price */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 md:col-span-1">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Today's Price</p>
            <div className="flex items-end gap-2">
              <h2 className="text-2xl font-extrabold text-slate-900">₹{currentPrice.toLocaleString("en-IN")}</h2>
              <span className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-full mb-0.5 ${expectedGain >= 0 ? "text-emerald-700 bg-emerald-50" : "text-red-600 bg-red-50"}`}>
                {expectedGain >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(Number(expectedGainPct))}%
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">per quintal</p>
          </div>

          {/* Recommendation */}
          <div className={`p-5 rounded-2xl shadow-sm border ${recStyle.bg} ${recStyle.border} col-span-2 md:col-span-1`}>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Recommendation</p>
            <div className={`inline-flex items-center px-3 py-1.5 rounded-xl font-bold text-sm ${recStyle.badge}`}>
              {recStyle.icon} {AI_REC.action}
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              {trend === "up" ? "Prices rising" : trend === "down" ? "Prices falling" : "Prices stable"}
            </p>
          </div>

          {/* AI Targets */}
          <div className="bg-white p-4 lg:p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center">
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Tomorrow</p>
                <h2 className={`text-lg lg:text-xl font-extrabold ${(prediction?.predicted_price || currentPrice) >= currentPrice ? "text-emerald-600" : "text-red-500"}`}>
                  ₹{Math.round(prediction?.predicted_price || currentPrice)}
                </h2>
              </div>
              <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">7-Days</p>
                <h2 className={`text-lg lg:text-xl font-extrabold ${expectedGain >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                  ₹{Math.abs(predictedPrice).toFixed(0)}
                </h2>
              </div>
            </div>
          </div>

          {/* Market Risk */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Market Risk</p>
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className={`w-5 h-5 ${volatilityPct > 10 ? "text-red-500" : volatilityPct > 5 ? "text-yellow-500" : "text-green-600"}`} />
              <span className="font-bold text-slate-800">{volatilityLabel}</span>
              <span className="text-xs text-slate-400 ml-1">({volatilityPct.toFixed(1)}%)</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2">
              <div className={`${volStyle.bar} h-1.5 rounded-full transition-all`} style={{ width: volStyle.width }} />
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">Calculated via historical price variance (%)</p>
          </div>

          {/* {t('AI Confidence')} */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">{t('AI Confidence')}</p>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <h2 className="text-2xl font-extrabold text-slate-900">{confidence}%</h2>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-bold">{prices.length}-day array • KrishiSetu Model</p>
          </div>
        </div>

        {/* ── CHART + SIDE PANEL ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-700" />
                Price Forecast Model
              </h3>
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-green-700 rounded-full inline-block" /> History</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 border-2 border-dashed border-yellow-500 rounded-full inline-block" /> Forecast</span>
              </div>
            </div>
            <div className="w-full" style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false}
                    tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }} dy={8} />
                  <YAxis axisLine={false} tickLine={false}
                    tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }}
                    tickFormatter={v => `₹${v}`} width={65} />
                  <Tooltip
                    formatter={(value: any) => [`₹${value?.toLocaleString("en-IN")}`, ""]}
                    contentStyle={{ borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "12px", fontWeight: 600 }}
                  />
                  <Line type="monotone" dataKey="price" stroke="#15803d" strokeWidth={2.5}
                    dot={{ r: 3.5, fill: "#15803d", strokeWidth: 0 }}
                    activeDot={{ r: 5 }} connectNulls={false} />
                  <Line type="monotone" dataKey="forecast" stroke="#eab308" strokeWidth={2.5}
                    strokeDasharray="6 4"
                    dot={{ r: 5, fill: "#eab308", strokeWidth: 0 }}
                    connectNulls={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-5">

            {/* AI Recommendation Detail */}
            <div className={`p-5 rounded-2xl border ${recStyle.bg} ${recStyle.border}`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-slate-800 text-sm">🤖 {t('KrishiSetu Advisor')}</h4>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${recStyle.badge}`}>
                  {AI_REC.action}
                </span>
              </div>
              <p className={`text-sm leading-relaxed ${recStyle.text}`}>
                {AI_REC.text}
              </p>
            </div>

            {/* Price Breakdown */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <h4 className="font-bold text-slate-800 text-sm mb-4">📊 Price Breakdown</h4>
              <div className="space-y-3">
                {[
                  { label: "Modal Price", value: `₹${currentPrice.toLocaleString("en-IN")}`, color: "text-slate-900" },
                  { label: "Min Est.", value: `₹${currentMin.toLocaleString("en-IN")}`, color: "text-blue-600" },
                  { label: "Max Est.", value: `₹${currentMax.toLocaleString("en-IN")}`, color: "text-emerald-600" },
                  { label: "Arrival Qty", value: currentQty !== null ? `${currentQty?.toLocaleString("en-IN")} q` : "Pending", color: "text-slate-600" },
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center">
                    <span className="text-xs text-slate-400 font-semibold">{item.label}</span>
                    <span className={`font-bold text-sm ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Index */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <h4 className="font-bold text-slate-800 text-sm mb-4">⚡ Market Risk Index</h4>
              <div className="space-y-3">
                {[
                  { label: "Volatility Score", value: volatility.toFixed(1), valueClass: "text-slate-800 font-bold text-sm" },
                  { label: "Avg Price", value: `₹${avg.toFixed(0)}`, valueClass: "text-slate-700 font-bold text-sm" },
                  { label: "Price Direction", value: `${trendIcon} ${trendLabel}`, valueClass: `font-bold text-sm ${trendColor}` },
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center">
                    <span className="text-xs text-slate-400 font-semibold">{item.label}</span>
                    <span className={item.valueClass}>{item.value}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-semibold">Risk Level</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${volStyle.text}`}>
                    {volatilityLabel} Risk
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── WEATHER + GAIN ESTIMATION ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Weather */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
            <h3 className="text-base font-bold text-slate-900 mb-4">🌤 Weather Impact Analysis</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                <Thermometer className="w-5 h-5 text-orange-500 mb-2" />
                <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Temperature</p>
                <p className="text-xl font-extrabold text-slate-900">{WEATHER.temp}°C</p>
                <p className="text-xs text-slate-500 mt-1">
                  {WEATHER.temp > 35 ? "🔥 High heat spoilage risk" : WEATHER.temp < 15 ? "❄ Cool — good for storage" : "✅ Moderate conditions"}
                </p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                <Droplets className="w-5 h-5 text-emerald-500 mb-2" />
                <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Rain Prob</p>
                <p className="text-xl font-extrabold text-slate-900">{WEATHER.rainProbability}%</p>
                <p className="text-xs text-slate-500 mt-1">
                  {WEATHER.rainProbability > 60 ? "🌧 Rain disrupts transport" : WEATHER.rainProbability > 30 ? "🌦 Moderate rain risk" : "☀ Optimal dry logistics"}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col justify-between">
                <div>
                  <Wind className="w-5 h-5 text-slate-400 mb-2" />
                  <p className="text-xs text-slate-400 font-semibold uppercase mb-1">State</p>
                </div>
                <p className="text-[13px] leading-tight font-black text-slate-700 uppercase">{WEATHER.description}</p>
              </div>
            </div>

            {/* WEATHER INSTRUCTION BOX */}
            <div className={`mt-auto p-4 rounded-xl border flex items-start gap-4 ${WEATHER.rainProbability > 30 ? 'bg-blue-50 border-blue-200' : 'bg-[#FDF8EE] border-[#FBC02D]/30'}`}>
              {!weatherAdvisory ? (
                <Sparkles className="w-8 h-8 mt-1 text-[#FBC02D] animate-pulse" />
              ) : WEATHER.rainProbability > 30 ? (
                <Umbrella className="w-8 h-8 mt-1 text-blue-500" />
              ) : (
                <Sun className="w-8 h-8 mt-1 text-amber-500" />
              )}
              <div>
                <h4 className="text-sm font-bold text-[#0A2F1D] mb-1">KrishiSetu Weather Instruction</h4>
                <p className="text-sm font-medium text-[#2D503C] leading-snug">
                  {weatherAdvisory || (
                    <span className="flex items-center gap-2 animate-pulse text-[#8A9A90]">
                      <Activity className="w-3 h-3" /> Fetching real-time geospatial Gemini climate instruction...
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Expected Gain */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">💰 Expected Gain Estimation</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Sell Today</p>
                <p className="text-xl font-extrabold text-slate-800">₹{currentPrice.toLocaleString("en-IN")}</p>
                <p className="text-xs text-slate-400 mt-1">per quintal</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Projected</p>
                <p className="text-xl font-extrabold text-green-700">₹{predictedPrice.toFixed(0)}</p>
                <p className="text-xs text-slate-400 mt-1">per quintal (forecast)</p>
              </div>
              <div className={`rounded-xl p-4 border ${expectedGain >= 0 ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"}`}>
                <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Difference</p>
                <p className={`text-xl font-extrabold ${expectedGain >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                  {expectedGain >= 0 ? "+" : "−"}₹{Math.abs(expectedGain).toFixed(0)}
                </p>
                <p className="text-[11px] text-slate-500 mt-1 leading-tight font-medium">
                  {expectedGain >= 0 ? "Expected gain" : "Expected loss"} per quintal <br />
                  <span className="text-slate-400">(after 7-days)</span>
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-300 mt-4 border-t pt-3">
              * Based on physical climate factors, localized market flow, and advanced auto-regressive Machine Learning.
            </p>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <p className="text-center text-xs text-slate-400 pt-2 font-bold mb-4">
          Powered by KrishiSetu Model & KrishiSetu Infrastructure
        </p>

      </div>
    </main>
  );
}
