"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  TrendingUp, Truck, Package, Wallet, ArrowRight, MapPin, CheckCircle2 
} from "lucide-react";

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

export default function BuyerOverviewPage() {
  const [mounted, setMounted] = useState(false);
  const [userName, setUserName] = useState("Buyer");
  const [shipments, setShipments] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    
    let uName = "Buyer";
    // Fetch user name from localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.name) {
          uName = parsed.name.split(" ")[0]; // Only use first name for greeting
          setUserName(uName);
        }
      } catch(e) {}
    }

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    // Fetch live crops to dynamically populate shipments
    fetch(`${API_BASE}/crops`)
      .then(r => r.json())
      .then(data => {
        if (data.crops && data.crops.length > 0) {
           const seed = hashString(uName);
           // Seed random based on user so shipments are stable for them
           const randomCrops = [];
           const c1 = data.crops[seed % data.crops.length];
           const c2 = data.crops[(seed + 7) % data.crops.length];
           
           if(c1) randomCrops.push({
               crop: c1.commodity,
               qty: `${(seed % 50) + 20}q`,
               farmer: `Farmer (Mandi: ${c1.market || 'Local'})`,
               icon: c1.commodity.toLowerCase().includes("wheat") ? "🌾" :
                     c1.commodity.toLowerCase().includes("potato") ? "🥔" :
                     c1.commodity.toLowerCase().includes("cotton") ? "🌿" :
                     c1.commodity.toLowerCase().includes("mustard") ? "🌻" : "📦",
               progress: 60 + (seed % 30),
               color: "bg-[#10893E]",
               status: "In Transit",
               eta: "2 Hours"
           });

           if(c2) randomCrops.push({
               crop: c2.commodity,
               qty: `${((seed + 15) % 80) + 10}q`,
               farmer: `Farmer (Mandi: ${c2.market || 'Local'})`,
               icon: c2.commodity.toLowerCase().includes("wheat") ? "🌾" :
                     c2.commodity.toLowerCase().includes("potato") ? "🥔" :
                     c2.commodity.toLowerCase().includes("cotton") ? "🌿" :
                     c2.commodity.toLowerCase().includes("mustard") ? "🌻" : "📦",
               progress: 15 + (seed % 20),
               color: "bg-[#F5B921]",
               status: "Loading",
               eta: "Loading at farm"
           });
           
           setShipments(randomCrops);
        }
      })
      .catch(() => {});

  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const seed = hashString(userName);
  const totalSpend = (10 + (seed % 50)) + ((seed % 10) / 10); // e.g. 14.5L
  const volumeProcured = 200 + (seed % 2000);
  const activeShipments = 1 + (seed % 6);
  const aiInsightCrop = ["Mustard", "Wheat", "Cotton", "Potato"][seed % 4];

  // Fallback if fetch fails
  const displayShipments = shipments.length > 0 ? shipments : [
    { crop: "Wheat (Lok-1)", qty: "100q", farmer: "Farmer: Harpreet Singh (Ludhiana)", icon: "🌾", progress: 60, color: "bg-[#10893E]", status: "In Transit", eta: "2 Hours" },
    { crop: "Potato (Kufri)", qty: "50q", farmer: "Farmer: Gurdeep Agro (Jalandhar)", icon: "🥔", progress: 15, color: "bg-[#F5B921]", status: "Loading", eta: "Loading at farm" }
  ];

  return (
    <main className="p-4 md:p-8 relative z-10 w-full animate-fade-in max-w-7xl mx-auto">
      
      {/* HEADER */}
      <header className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-10 transition-all duration-300 ease-out transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#0A2F1D] mb-1 tracking-tight">Welcome, {userName}!</h1>
          <p className="text-[#627768] font-semibold text-lg">Track incoming shipments and market intelligence.</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-4 items-center">
          <Link href="/buyer-dashboard/notifications">
            <button className="bg-white border border-[#E2DFD3] shadow-sm p-3.5 rounded-xl text-xl hover:bg-slate-50 hover:shadow-md transition-all duration-150 relative group">
              <span className="group-hover:rotate-12 transition-transform inline-block">🔔</span>
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border-2 border-white"></span>
            </button>
          </Link>
          <Link href="/buyer-dashboard/procurement">
            <button className="bg-[#10893E] text-white px-6 py-3.5 rounded-xl font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 flex items-center gap-2">
              <span className="text-lg">+</span>
              <span>New Request</span>
            </button>
          </Link>
        </div>
      </header>

      {/* STATS BENTO BOX */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 transition-all duration-300 ease-out transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        
        {/* Stat Card 1 */}
        <div className="bg-white border border-[#E2DFD3] shadow-sm p-6 rounded-[2rem] hover:shadow-md transition-shadow group">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Wallet className="w-6 h-6 text-[#10893E]" />
          </div>
          <p className="text-sm font-bold text-[#627768] uppercase tracking-wider mb-1">Total Spend (Month)</p>
          <h3 className="text-3xl font-black text-[#0A2F1D] tracking-tight">₹{totalSpend.toFixed(1)}L</h3>
          <p className="text-xs font-bold text-[#10893E] mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +{ (seed % 15) + 2 }% from last month
          </p>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white border border-[#E2DFD3] shadow-sm p-6 rounded-[2rem] hover:shadow-md transition-shadow group">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Package className="w-6 h-6 text-[#D49800]" />
          </div>
          <p className="text-sm font-bold text-[#627768] uppercase tracking-wider mb-1">Volume Procured</p>
          <h3 className="text-3xl font-black text-[#0A2F1D] tracking-tight">{volumeProcured}q</h3>
          <p className="text-xs font-bold text-[#627768] mt-2">Across {(seed % 5) + 2} commodities</p>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white border border-[#E2DFD3] shadow-sm p-6 rounded-[2rem] hover:shadow-md transition-shadow group">
          <div className="w-12 h-12 rounded-2xl bg-[#EBE5D9] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Truck className="w-6 h-6 text-[#0A2F1D]" />
          </div>
          <p className="text-sm font-bold text-[#627768] uppercase tracking-wider mb-1">Active Shipments</p>
          <h3 className="text-3xl font-black text-[#0A2F1D] tracking-tight">{activeShipments}</h3>
          <p className="text-xs font-bold text-[#10893E] mt-2">{Math.ceil(activeShipments / 2)} arriving today</p>
        </div>

        {/* Stat Card 4 (AI Highlight) */}
        <div className="bg-gradient-to-br from-[#10893E] to-[#0A2F1D] p-6 rounded-[2rem] shadow-[0_15px_30px_rgba(10,47,29,0.2)] text-white relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FBC02D] rounded-full blur-[40px] opacity-30"></div>
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4 shadow-inner border border-white/20 backdrop-blur-sm">
            <span className="text-2xl">🧠</span>
          </div>
          <p className="text-sm font-bold text-green-200 uppercase tracking-wider mb-1">AI Market Insight</p>
          <h3 className="text-xl font-black text-white leading-tight">{aiInsightCrop} prices are projected to shift.</h3>
          <p className="text-xs font-medium text-white/80 mt-2">Optimal time to source in {(seed % 48) + 12} hours.</p>
        </div>

      </div>

      {/* MAIN CONTENT SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
        
        {/* LEFT COLUMN: ACTIVE SHIPMENTS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-2xl font-black text-[#0A2F1D] drop-shadow-sm">Incoming Shipments</h2>
            <Link href="/buyer-dashboard/orders" className="text-sm font-bold text-[#10893E] hover:underline flex items-center gap-1">
              View Tracking <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {displayShipments.map((ship, idx) => (
              <div key={idx} className="bg-white border border-[#E2DFD3] shadow-sm p-6 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#FDF8EE] rounded-[1.5rem] flex items-center justify-center text-3xl">{ship.icon}</div>
                  <div>
                    <h3 className="font-black text-lg text-[#0A2F1D] max-w-[200px] truncate">{ship.crop} • {ship.qty}</h3>
                    <p className="text-sm font-bold text-[#627768] flex items-center gap-1 mt-1 truncate max-w-[220px]">
                      <MapPin className="w-3.5 h-3.5" /> {ship.farmer}
                    </p>
                  </div>
                </div>
                
                <div className="flex-1 px-0 md:px-8 w-full">
                  <div className="flex justify-between text-xs font-bold text-[#0A2F1D] mb-2">
                    <span>Dispatched</span>
                    <span className={ship.status === "In Transit" ? "text-[#10893E]" : "opacity-40"}>{ship.status}</span>
                    <span className="opacity-40">Delivered</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#FDF8EE] border border-[#E2DFD3] rounded-full overflow-hidden">
                    <div className={`h-full ${ship.color} rounded-full relative transition-all duration-1000`} style={{ width: `${ship.progress}%` }}></div>
                  </div>
                  <p className="text-xs text-right mt-1 font-bold text-[#627768]">ETA: {ship.eta}</p>
                </div>

                <button className="px-4 py-3 bg-white border border-[#E2DFD3] shadow-sm text-[#0A2F1D] rounded-xl font-bold hover:bg-slate-50 transition-all text-sm shrink-0">
                  {ship.status === "In Transit" ? "Contact Driver" : "View Details"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: RECENT ACTIONS & VERIFICATIONS */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-[#0A2F1D] drop-shadow-sm mb-4">Network Actions</h2>
          
          <div className="bg-white border border-[#E2DFD3] shadow-sm p-6 rounded-[2rem]">
             <h3 className="text-sm font-bold tracking-wider text-[#10893E] uppercase mb-4">Awaiting Action</h3>
             
             <div className="space-y-4">
               {/* Action Item */}
               <div className="bg-slate-50 p-4 rounded-2xl border border-[#E2DFD3]">
                 <div className="flex items-start justify-between">
                   <div>
                     <p className="font-bold text-[#0A2F1D]">Quality Verification</p>
                     <p className="text-xs text-[#627768] mt-1">{aiInsightCrop} delivery (ORD-{100 + (seed%900)}) is pending visual inspection approval.</p>
                   </div>
                   <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                 </div>
                 <button className="mt-3 w-full py-2 bg-[#0A2F1D] text-white text-xs font-bold rounded-lg shadow-sm hover:bg-[#10893E] transition-colors">
                   Review Photos & Approve
                 </button>
               </div>

               {/* Action Item */}
               <div className="bg-slate-50 p-4 rounded-2xl border border-[#E2DFD3]">
                 <div className="flex items-start justify-between">
                   <div>
                     <p className="font-bold text-[#0A2F1D]">Counter-Offer Received</p>
                     <p className="text-xs text-[#627768] mt-1">Farmer ID-{9310 + (seed%50)} countered your bid for {20 + (seed%10)}q {aiInsightCrop}.</p>
                   </div>
                   <span className="w-2 h-2 bg-[#F5B921] rounded-full"></span>
                 </div>
                 <button className="mt-3 w-full py-2 bg-white border border-[#E2DFD3] text-[#0A2F1D] text-xs font-bold rounded-lg shadow-sm hover:bg-slate-100 transition-colors">
                   View Offer
                 </button>
               </div>
             </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 shadow-sm p-6 rounded-[2rem] border-l-4 border-l-[#10893E]">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-5 h-5 text-[#10893E]" />
              <h3 className="font-bold text-[#0A2F1D]">Escrow Wallet Secured</h3>
            </div>
            <p className="text-xs text-[#627768] leading-relaxed">Your current escrow balance is ₹{(5 + (seed % 10)).toFixed(1)}L. Funds are ready for instant dispatch upon crop verification.</p>
            <Link href="/buyer-dashboard/wallet" className="inline-block mt-3 text-xs font-black text-[#10893E] hover:underline">Manage Funds →</Link>
          </div>

        </div>

      </div>
    </main>
  );
}