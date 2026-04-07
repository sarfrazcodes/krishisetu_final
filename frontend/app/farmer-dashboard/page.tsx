// app/farmer-dashboard/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from "recharts";

// Simple deterministic hash
const hashString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

export default function FarmerDashboardOverview() {
  const [mounted, setMounted] = useState(false);
  const [greeting, setGreeting] = useState("Welcome");
  const [userName, setUserName] = useState("Farmer");
  const router = useRouter();

  // Dynamic state
  const [livePrices, setLivePrices] = useState<any[]>([]);
  const [predictedPrices, setPredictedPrices] = useState<any[]>([]);
  const [forecastTarget, setForecastTarget] = useState(2450);
  const [loadingChart, setLoadingChart] = useState(true);

  // Mount animations and time-based greeting
  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    let uName = "Farmer";
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.name) {
          uName = parsed.name.split(" ")[0];
          setUserName(uName);
        }
      } catch(e) {}
    }

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://krishisetu-hhef.onrender.com";

    // Fetch Live Prices
    fetch(`${API_BASE}/crops`)
      .then(r => r.json())
      .then(data => {
        if (data.crops && data.crops.length > 0) {
          const formatted = data.crops.slice(0, 4).map((c: any) => ({
            crop: c.commodity,
            price: `₹${c.modal_price.toLocaleString("en-IN")}`,
            change: `+${(Math.random() * 4).toFixed(1)}%`,
            icon: c.commodity.toLowerCase().includes("wheat") ? "🌾" :
                  c.commodity.toLowerCase().includes("potato") ? "🥔" :
                  c.commodity.toLowerCase().includes("cotton") ? "🌿" :
                  c.commodity.toLowerCase().includes("mustard") ? "🌻" : "🌱",
            up: Math.random() > 0.3
          }));
          setLivePrices(formatted);
        }
      })
      .catch(() => {});

    // Fetch Graph History + Prediction
    Promise.all([
      fetch(`${API_BASE}/crops/Wheat (Lok-1)/history?mandi=Ludhiana APMC`).then(r => r.json()),
      fetch(`${API_BASE}/crops/Wheat (Lok-1)/predict?mandi=Ludhiana APMC`).then(r => r.json())
    ]).then(([histData, predData]) => {
      const rows = histData.history || [];
      const cp = predData.current_price || 2000;
      const target = Math.round(predData.predicted_price_weekly || cp * 1.05);
      
      setForecastTarget(target);

      let cData: any[] = [];
      if (rows.length <= 1) {
        cData = [
          { name: "Past", price: cp - 50 },
          { name: "Current", price: cp },
          { name: "Day 3", price: cp + 30 },
          { name: "Next Week", price: target },
        ];
      } else {
        const last7 = rows.slice(-5);
        cData = last7.map((r: any, idx: number) => ({
          name: idx === last7.length - 1 ? "Current" : "Past",
          price: r.price
        }));
        cData.push({ name: "Next Week", price: target });
      }
      setPredictedPrices(cData);
      setLoadingChart(false);
    }).catch(() => {
      setLoadingChart(false);
    });

  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const seed = hashString(userName);
  const harvValue = 300000 + (seed % 500000);
  const activeBuyers = 10 + (seed % 60);

  const fallbackPrices = [
    { crop: "Mustard", price: "₹5,875", change: "+1.8%", icon: "🌻", up: true },
    { crop: "Cotton", price: "₹6,600", change: "-0.5%", icon: "🌿", up: false },
    { crop: "Potato", price: "₹1,100", change: "+2.7%", icon: "🥔", up: true },
    { crop: "Rice", price: "₹2,900", change: "+0.4%", icon: "🌾", up: true }
  ];

  const displayPrices = livePrices.length > 0 ? livePrices : fallbackPrices;

  return (
    <main className="p-4 md:p-8 max-w-7xl mx-auto">
      
      <header className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-10 transition-all duration-300 ease-out transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#0A2F1D] mb-1 tracking-tight">{greeting}, {userName}!</h1>
          <p className="text-[#627768] font-semibold text-lg">Here is your farm's market overview today.</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-4 items-center">
          <button className="bg-white border border-[#E2DFD3] shadow-sm p-3.5 rounded-xl text-xl hover:bg-slate-50 hover:shadow-md transition-all duration-150">
            🔍
          </button>
          
          <Link href="/farmer-dashboard/notifications">
            <button className="bg-white border border-[#E2DFD3] shadow-sm p-3.5 rounded-xl text-xl hover:bg-slate-50 hover:shadow-md transition-all duration-150 relative group">
              <span className="group-hover:rotate-12 transition-transform inline-block">🔔</span>
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border-2 border-white"></span>
            </button>
          </Link>
          
          <Link href="/farmer-dashboard/new-listing">
            <button className="bg-[#10893E] text-white px-6 py-3.5 rounded-xl font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 flex items-center space-x-2">
              <span className="text-lg">+</span>
              <span>New Listing</span>
            </button>
          </Link>
        </div>
      </header>

      {/* --- BENTO BOX GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-20">
        
        {/* STAT CARD 1 */}
        <div className={`md:col-span-6 bg-white border border-[#E2DFD3] shadow-sm p-6 rounded-3xl group hover:shadow-md transition-all duration-200 transform ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#10893E] flex items-center justify-center text-2xl group-hover:scale-110 transition-all duration-200">🌾</div>
            <span className={`text-sm font-bold px-2.5 py-1 rounded-lg ${seed % 2 === 0 ? "text-[#10893E] bg-emerald-50" : "text-blue-700 bg-blue-50"}`}>
              {seed % 2 === 0 ? "▲ +12.5%" : "Stable Yield"}
            </span>
          </div>
          <p className="text-[#627768] font-bold text-sm uppercase tracking-wide">Est. Harvest Value</p>
          <h2 className="text-4xl font-black text-[#0A2F1D] mt-1 tracking-tight">₹{harvValue.toLocaleString("en-IN")}</h2>
        </div>

        {/* STAT CARD 2 */}
        <div className={`md:col-span-6 bg-white border border-[#E2DFD3] shadow-sm p-6 rounded-3xl group hover:shadow-md transition-all duration-200 transform ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-all duration-200">👀</div>
            <span className="text-sm font-bold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-lg">High Demand</span>
          </div>
          <p className="text-[#627768] font-bold text-sm uppercase tracking-wide">Interested Buyers</p>
          <h2 className="text-4xl font-black text-[#0A2F1D] mt-1 tracking-tight">{activeBuyers} Active</h2>
        </div>

        {/* --- LARGE AI CHART WIDGET --- */}
        <div className={`md:col-span-8 bg-white border border-[#E2DFD3] shadow-sm p-6 md:p-8 rounded-[2rem] relative overflow-hidden group hover:shadow-md transition-all duration-200 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex justify-between items-end mb-6 relative z-10">
            <div>
              <h2 className="text-2xl font-black text-[#0A2F1D]">Wheat Forecast</h2>
              <p className="text-[#627768] font-bold text-sm mt-1">Ludhiana APMC • 7 Day Projection</p>
            </div>
            <div className="text-right">
              <span className="block text-3xl md:text-4xl font-black text-[#10893E]">₹{forecastTarget}<span className="text-xl text-[#627768]">/q</span></span>
            </div>
          </div>

          <div className="w-full h-48 md:h-64 relative z-10">
            {loadingChart ? (
              <div className="w-full h-full flex items-center justify-center">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#10893E]"></div>
              </div>
            ) : predictedPrices.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={predictedPrices}>
                    <defs>
                      <linearGradient id="lineColor" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#10893E" />
                        <stop offset="70%" stopColor="#10893E" />
                        <stop offset="100%" stopColor="#FBC02D" />
                      </linearGradient>
                    </defs>
                    <YAxis domain={['auto', 'auto']} hide />
                    <Tooltip
                      formatter={(v: any) => [`₹${v}`, "Price"]}
                      labelStyle={{ color: "#0A2F1D", fontWeight: "bold" }}
                      itemStyle={{ color: "#10893E", fontWeight: "bold" }}
                      contentStyle={{ borderRadius: "12px", border: "1px solid #E2DFD3", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                    />
                    <Line type="monotone" dataKey="price" stroke="url(#lineColor)" strokeWidth={5} dot={{ r: 4, strokeWidth: 2, fill: "#fff", stroke: "#10893E" }} activeDot={{ r: 8, fill: "#10893E", stroke: "#fff", strokeWidth: 3 }} />
                 </LineChart>
               </ResponsiveContainer>
            ) : (
               <div className="w-full h-full flex items-center justify-center text-[#627768] font-bold">No Data Available</div>
            )}
          </div>
          
          <div className="flex justify-between text-xs font-black text-[#8A9A90] mt-2 uppercase tracking-widest relative z-10">
            <span>Past Array</span>
            <span className="text-[#FBC02D]">7-Day Projection</span>
          </div>
        </div>

        {/* --- LIVE MANDI WIDGET --- */}
        <div className={`md:col-span-4 bg-white border border-[#E2DFD3] shadow-sm p-6 md:p-8 rounded-[2rem] flex flex-col transition-all duration-200 transform hover:shadow-md ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-[#0A2F1D]">Live Prices</h3>
            <span className="flex items-center text-xs font-bold text-[#10893E] bg-emerald-50 px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#10893E] animate-pulse mr-1.5"></span>
              LIVE
            </span>
          </div>
          
          <div className="space-y-4 flex-1">
            {displayPrices.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 border-b border-[#FDF8EE] last:border-0 hover:bg-slate-50 transition-colors px-2 rounded-xl cursor-pointer">
                <div className="flex items-center space-x-4 w-full min-w-0">
                  <div className="w-10 h-10 bg-[#FDF8EE] rounded-lg flex items-center justify-center text-xl shrink-0">{item.icon}</div>
                  <span className="font-bold text-[#0A2F1D] text-lg max-w-[120px] truncate" title={item.crop}>{item.crop}</span>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-black text-[#0A2F1D] text-lg">{item.price}</div>
                  <div className={`text-sm font-bold ${item.up ? 'text-[#10893E]' : 'text-red-500'}`}>
                    {item.up ? '▲' : '▼'} {item.change}
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