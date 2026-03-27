// app/farmer-dashboard/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function FarmerDashboardOverview() {
  const [mounted, setMounted] = useState(false);
  const [greeting, setGreeting] = useState("Welcome");
  const [userName, setUserName] = useState("Farmer");
  const router = useRouter();

  // Mount animations and time-based greeting
  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    // Fetch user name from localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.name) setUserName(parsed.name.split(" ")[0]); // Only use first name for greeting
      } catch(e) {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

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
        <div className={`md:col-span-4 bg-white border border-[#E2DFD3] shadow-sm p-6 rounded-3xl group hover:shadow-md transition-all duration-200 transform ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#10893E] flex items-center justify-center text-2xl group-hover:scale-110 transition-all duration-200">🌾</div>
            <span className="text-sm font-bold text-[#10893E] bg-emerald-50 px-2.5 py-1 rounded-lg">▲ +12.5%</span>
          </div>
          <p className="text-[#627768] font-bold text-sm uppercase tracking-wide">Est. Harvest Value</p>
          <h2 className="text-4xl font-black text-[#0A2F1D] mt-1 tracking-tight">₹4,25,000</h2>
        </div>

        {/* STAT CARD 2 */}
        <div className={`md:col-span-4 bg-white border border-[#E2DFD3] shadow-sm p-6 rounded-3xl group hover:shadow-md transition-all duration-200 transform ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-all duration-200">👀</div>
            <span className="text-sm font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">High Demand</span>
          </div>
          <p className="text-[#627768] font-bold text-sm uppercase tracking-wide">Interested Buyers</p>
          <h2 className="text-4xl font-black text-[#0A2F1D] mt-1 tracking-tight">24 Active</h2>
        </div>

        {/* 3D CHUNKY ACTION CARD: AI Quick Scan */}
        <div className={`md:col-span-4 bg-gradient-to-b from-[#14A049] to-[#0A2F1D] p-6 rounded-3xl text-white shadow-[0_10px_0_0_#062013,0_20px_40px_rgba(10,47,29,0.4)] hover:shadow-[0_4px_0_0_#062013,0_15px_30px_rgba(10,47,29,0.6)] hover:translate-y-[6px] relative overflow-hidden group transition-all duration-200 transform cursor-pointer ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <span className="absolute inset-0 w-full h-full -translate-x-[150%] skew-x-[-25deg] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-[150%] transition-transform duration-700 ease-out z-0"></span>
          <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-[#FBC02D] rounded-full mix-blend-screen filter blur-[40px] opacity-40 group-hover:opacity-80 group-hover:scale-125 transition-all duration-300"></div>
          
          <div className="relative z-10 flex items-center justify-between mb-2">
            <h3 className="text-xl font-black drop-shadow-md">AI Market Scan</h3>
            <span className="text-3xl drop-shadow-lg transform group-hover:scale-110 transition-transform duration-200">🤖</span>
          </div>
          <p className="text-green-100 text-sm font-medium mb-5 relative z-10 drop-shadow-sm">Wheat prices peaking in 4 days.</p>
          
          <Link href="/farmer-dashboard/ai-advisor">
            <button className="w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] rounded-xl font-bold text-white transition-colors duration-150 relative z-10 flex items-center justify-center">
              Run Full Analysis 
              <span className="ml-2 inline-block transform group-hover:translate-x-1.5 transition-transform duration-200">→</span>
            </button>
          </Link>
        </div>

        {/* --- LARGE AI CHART WIDGET --- */}
        <div className={`md:col-span-8 bg-white border border-[#E2DFD3] shadow-sm p-6 md:p-8 rounded-[2rem] relative overflow-hidden group hover:shadow-md transition-all duration-200 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex justify-between items-end mb-6 relative z-10">
            <div>
              <h2 className="text-2xl font-black text-[#0A2F1D]">Wheat Forecast</h2>
              <p className="text-[#627768] font-bold text-sm mt-1">Ludhiana APMC • 7 Day Projection</p>
            </div>
            <div className="text-right">
              <span className="block text-3xl md:text-4xl font-black text-[#10893E]">₹2,450<span className="text-xl text-[#627768]">/q</span></span>
            </div>
          </div>

          <div className="w-full h-48 md:h-64 relative z-10">
            {/* Same SVG Chart but cleaner shadow logic */}
            <svg viewBox="0 0 800 200" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10893E" stopOpacity="0.15"/>
                  <stop offset="100%" stopColor="#10893E" stopOpacity="0.0"/>
                </linearGradient>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10893E"/>
                  <stop offset="70%" stopColor="#10893E"/>
                  <stop offset="100%" stopColor="#FBC02D"/>
                </linearGradient>
              </defs>
              <line x1="0" y1="50" x2="800" y2="50" stroke="#FDF8EE" strokeWidth="2" strokeDasharray="5,5" />
              <line x1="0" y1="100" x2="800" y2="100" stroke="#FDF8EE" strokeWidth="2" strokeDasharray="5,5" />
              <line x1="0" y1="150" x2="800" y2="150" stroke="#FDF8EE" strokeWidth="2" strokeDasharray="5,5" />
              
              <path d="M0,150 C100,160 200,120 300,90 C400,60 500,100 600,40 C700,-20 800,20 800,20 L800,200 L0,200 Z" fill="url(#chartGlow)" />
              <path d="M0,150 C100,160 200,120 300,90 C400,60 500,100 600,40 C700,-20 800,20 800,20" fill="none" stroke="url(#lineGradient)" strokeWidth="4" strokeLinecap="round" />
              <circle cx="800" cy="20" r="8" fill="#FBC02D" stroke="#fff" strokeWidth="4" className="shadow-sm" />
            </svg>
          </div>
          
          <div className="flex justify-between text-xs font-black text-[#8A9A90] mt-2 uppercase tracking-widest relative z-10">
            <span>Past</span>
            <span>Today</span>
            <span className="text-[#FBC02D]">Next Week</span>
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
            {[
              { crop: "Mustard", price: "₹5,875", change: "+1.8%", icon: "🌻", up: true },
              { crop: "Cotton", price: "₹6,600", change: "-0.5%", icon: "🌿", up: false },
              { crop: "Potato", price: "₹1,100", change: "+2.7%", icon: "🥔", up: true },
              { crop: "Rice", price: "₹2,900", change: "+0.4%", icon: "🌾", up: true }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 border-b border-[#FDF8EE] last:border-0 hover:bg-slate-50 transition-colors px-2 rounded-xl cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-[#FDF8EE] rounded-lg flex items-center justify-center text-xl">{item.icon}</div>
                  <span className="font-bold text-[#0A2F1D] text-lg">{item.crop}</span>
                </div>
                <div className="text-right">
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