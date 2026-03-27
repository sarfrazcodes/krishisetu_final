"use client";

import {
  ComposedChart, Line, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  TrendingUp, TrendingDown, ShieldAlert, CheckCircle2,
  AlertTriangle, MapPin, ArrowUpRight, ArrowDownRight,
  CloudOff, Thermometer, Droplets, Wind,
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
// MOCK DATA — replace with your DB fetch
// ─────────────────────────────────────────────
const MOCK_COMMODITY_NAME = "Wheat";
const MOCK_MANDI_NAME     = "Azadpur Mandi";
const MOCK_LAST_UPDATED   = "2026-03-27";

const MOCK_PRICE_ROWS: PriceRow[] = [
  { modal_price: 2200, min_price: 2100, max_price: 2300, arrival_quantity: 450,  date: "2026-03-18" },
  { modal_price: 2240, min_price: 2150, max_price: 2340, arrival_quantity: 520,  date: "2026-03-19" },
  { modal_price: 2210, min_price: 2120, max_price: 2310, arrival_quantity: 480,  date: "2026-03-20" },
  { modal_price: 2260, min_price: 2170, max_price: 2360, arrival_quantity: 610,  date: "2026-03-21" },
  { modal_price: 2300, min_price: 2200, max_price: 2400, arrival_quantity: 590,  date: "2026-03-22" },
  { modal_price: 2350, min_price: 2250, max_price: 2450, arrival_quantity: 670,  date: "2026-03-23" },
  { modal_price: 2400, min_price: 2300, max_price: 2500, arrival_quantity: 720,  date: "2026-03-24" },
];

const MOCK_WEATHER = {
  temp: 28,
  rainProbability: 20,
  description: "Partly Cloudy",
};

const MOCK_RECOMMENDATION = {
  action: "SELL NOW",
  text: "Wheat prices at Azadpur Mandi are showing a strong upward trend, currently at ₹2,400/quintal. Our forecast predicts prices may stabilize or slightly decline over the next 3–5 days as new arrivals increase supply. SELL NOW to lock in the current high prices. Market conditions remain favorable today but watch for incoming supply pressure.",
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function linearRegressionForecast(prices: number[]): number {
  const n = prices.length;
  const x = Array.from({ length: n }, (_, i) => i);
  const sumX  = x.reduce((a, b) => a + b, 0);
  const sumY  = prices.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, v, i) => sum + v * prices[i], 0);
  const sumXX = x.reduce((sum, v) => sum + v * v, 0);
  const slope     = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
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
  if (label === "High")     return { bar: "bg-red-500",    text: "text-red-600 bg-red-50 border-red-200",       width: "85%" };
  if (label === "Moderate") return { bar: "bg-yellow-500", text: "text-yellow-700 bg-yellow-50 border-yellow-200", width: "50%" };
  return                           { bar: "bg-green-500",  text: "text-green-700 bg-green-50 border-green-200",  width: "20%" };
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
export default function DashboardPage() {
  const priceRows = MOCK_PRICE_ROWS;
  const prices    = priceRows.map(r => r.modal_price);

  const latestRow    = priceRows[priceRows.length - 1];
  const currentPrice = latestRow.modal_price;
  const currentMin   = latestRow.min_price;
  const currentMax   = latestRow.max_price;
  const currentQty   = latestRow.arrival_quantity;

  const predictedPrice  = prices.length > 1 ? linearRegressionForecast(prices) : currentPrice;
  const expectedGain    = predictedPrice - currentPrice;
  const expectedGainPct = ((expectedGain / currentPrice) * 100).toFixed(1);

  const avg             = prices.reduce((a, b) => a + b, 0) / prices.length;
  const variance        = prices.reduce((sum, p) => sum + Math.pow(p - avg, 2), 0) / prices.length;
  const volatility      = Math.sqrt(variance);
  const volatilityPct   = avg > 0 ? (volatility / avg) * 100 : 0;
  const volatilityLabel = volatilityPct > 10 ? "High" : volatilityPct > 5 ? "Moderate" : "Low";

  const trend      = getTrend(prices);
  const trendIcon  = trend === "up" ? "↑" : trend === "down" ? "↓" : "→";
  const trendColor = trend === "up" ? "text-emerald-600" : trend === "down" ? "text-red-500" : "text-slate-500";
  const trendLabel = trend === "up" ? "Rising" : trend === "down" ? "Falling" : "Stable";
  const trendBg    = trend === "up" ? "bg-emerald-50 text-emerald-700" : trend === "down" ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-600";

  const chartData = [
    ...priceRows.map(row => ({ date: formatDate(row.date), price: row.modal_price, forecast: undefined })),
    ...(prices.length > 1 ? [{ date: "→ Forecast", price: undefined, forecast: Math.round(predictedPrice) }] : []),
  ];

  const recStyle  = getRecStyle(MOCK_RECOMMENDATION.action);
  const volStyle  = getVolatilityStyle(volatilityLabel);

  let confidenceScore = 40 + prices.length * 2 - Math.min(volatilityPct, 30);
  const confidence    = Math.round(Math.max(20, Math.min(99, confidenceScore)));

  const weatherTemp = MOCK_WEATHER.temp;
  const weatherRain = MOCK_WEATHER.rainProbability;
  const weatherDesc = MOCK_WEATHER.description;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        .dash-font { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6 dash-font">

        {/* ── HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-widest text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                Market Intelligence
              </span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${trendBg}`}>
                {trendIcon} {trendLabel}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2">
              {MOCK_COMMODITY_NAME}
            </h1>
            <p className="text-slate-500 flex items-center gap-1.5 mt-1 font-medium">
              <MapPin className="w-4 h-4 text-green-600" />
              {MOCK_MANDI_NAME} Mandi
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Last updated</p>
            <p className="text-slate-700 font-bold text-lg">{formatDate(MOCK_LAST_UPDATED)}</p>
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
          <div className={`p-5 rounded-2xl shadow-sm border ${recStyle.bg} ${recStyle.border}`}>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Recommendation</p>
            <div className={`inline-flex items-center px-3 py-1.5 rounded-xl font-bold text-sm ${recStyle.badge}`}>
              {recStyle.icon} {MOCK_RECOMMENDATION.action}
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              {trend === "up" ? "Prices rising" : trend === "down" ? "Prices falling" : "Prices stable"}
            </p>
          </div>

          {/* Expected Gain */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Expected Gain (3-Day)</p>
            <h2 className={`text-2xl font-extrabold ${expectedGain >= 0 ? "text-emerald-600" : "text-red-500"}`}>
              {expectedGain >= 0 ? "+" : ""}₹{Math.abs(expectedGain).toFixed(0)}
            </h2>
            <p className="text-xs text-slate-400 mt-1">per quintal</p>
          </div>

          {/* Market Risk */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Market Risk</p>
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className={`w-5 h-5 ${volatilityPct > 10 ? "text-red-500" : volatilityPct > 5 ? "text-yellow-500" : "text-green-600"}`} />
              <span className="font-bold text-slate-800">{volatilityLabel}</span>
              <span className="text-xs text-slate-400 ml-1">({volatilityPct.toFixed(1)}%)</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <div className={`${volStyle.bar} h-1.5 rounded-full transition-all`} style={{ width: volStyle.width }} />
            </div>
          </div>

          {/* AI Confidence */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">AI Confidence</p>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <h2 className="text-2xl font-extrabold text-slate-900">{confidence}%</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">{prices.length}-day data</p>
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
                    formatter={(value: number | undefined) => [`₹${value?.toLocaleString("en-IN")}`, ""]}
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
                <h4 className="font-bold text-slate-800 text-sm">🤖 AI Market Recommendation</h4>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${recStyle.badge}`}>
                  {MOCK_RECOMMENDATION.action}
                </span>
              </div>
              <p className={`text-sm leading-relaxed ${recStyle.text}`}>
                {MOCK_RECOMMENDATION.text}
              </p>
            </div>

            {/* Price Breakdown */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <h4 className="font-bold text-slate-800 text-sm mb-4">📊 Price Breakdown</h4>
              <div className="space-y-3">
                {[
                  { label: "Modal Price", value: `₹${currentPrice.toLocaleString("en-IN")}`,  color: "text-slate-900" },
                  { label: "Min Price",   value: `₹${currentMin.toLocaleString("en-IN")}`,    color: "text-blue-600"  },
                  { label: "Max Price",   value: `₹${currentMax.toLocaleString("en-IN")}`,    color: "text-emerald-600" },
                  { label: "Arrival Qty", value: currentQty !== null ? `${currentQty?.toLocaleString("en-IN")} q` : "—", color: "text-slate-600" },
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
                  { label: "Volatility Score", value: volatility.toFixed(1),    valueClass: "text-slate-800 font-bold text-sm" },
                  { label: "Avg Price",         value: `₹${avg.toFixed(0)}`,    valueClass: "text-slate-700 font-bold text-sm" },
                  { label: "Price Direction",   value: `${trendIcon} ${trendLabel}`, valueClass: `font-bold text-sm ${trendColor}` },
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
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">🌤 Weather Impact Analysis</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                <Thermometer className="w-5 h-5 text-orange-500 mb-2" />
                <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Temperature</p>
                <p className="text-xl font-extrabold text-slate-900">{weatherTemp}°C</p>
                <p className="text-xs text-slate-500 mt-1">
                  {weatherTemp > 35 ? "🔥 High heat may accelerate spoilage" : weatherTemp < 15 ? "❄ Cool — good for storage" : "✅ Moderate conditions"}
                </p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <Droplets className="w-5 h-5 text-blue-500 mb-2" />
                <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Rain Prob</p>
                <p className="text-xl font-extrabold text-slate-900">{weatherRain}%</p>
                <p className="text-xs text-slate-500 mt-1">
                  {weatherRain > 60 ? "🌧 High rain may disrupt transport" : weatherRain > 30 ? "🌦 Moderate rain risk" : "☀ Low disruption risk"}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <Wind className="w-5 h-5 text-slate-400 mb-2" />
                <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Condition</p>
                <p className="text-sm font-bold text-slate-700 capitalize mt-1">{weatherDesc}</p>
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
                <p className="text-xs text-slate-400 mt-1">
                  {expectedGain >= 0 ? "potential gain" : "potential loss"}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-300 mt-4 border-t pt-3">
              * Forecast is based on linear regression of historical data. Not financial advice.
            </p>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <p className="text-center text-xs text-slate-300 pt-2">
          Powered by Agmarknet data · AI insights for informational use only
        </p>

      </div>
    </div>
  );
}
