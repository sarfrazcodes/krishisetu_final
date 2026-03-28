"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

export default function BuyerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleVoice = () => {
    setIsListening(!isListening);
  };

  const navLinks = [
    { name: "Overview", icon: "📊", link: "/buyer-dashboard" },
    { name: "Farmer Market", icon: "🌾", link: "/buyer-dashboard/procurement" },
    { name: "My Requirements", icon: "📢", link: "/buyer-dashboard/my-requests" },
    { name: "Market Analytics", icon: "📈", link: "/buyer-dashboard/analytics" },
    { name: "Mandi Rates", icon: "⚖️", link: "/buyer-dashboard/mandi-prices" },
    { name: "Farmer Network", icon: "🤝", link: "/buyer-dashboard/network" },
    { name: "Trade History", icon: "📜", link: "/buyer-dashboard/trade-history" },
  ];

  return (
    <div className="flex flex-col h-screen bg-[#FDF8EE] selection:bg-[#FBC02D] selection:text-[#0A2F1D] font-sans overflow-hidden">
      {/* 1. Global Navbar injected at the top */}
      <Navbar />

      {/* 2. Main Layout Below Navbar */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* --- CLEAN SOLID WHITE SIDEBAR --- */}
        <aside className="w-20 lg:w-72 bg-white border-r border-[#E2DFD3] flex flex-col justify-between pt-[88px] pb-6 transition-all duration-300 z-10 shadow-[4px_0_24px_rgba(10,47,29,0.02)]">
          <nav className="flex-1 px-4 lg:px-6 space-y-2 overflow-y-auto">
            <p className="hidden lg:block text-xs font-black text-[#8A9A90] uppercase tracking-widest pl-2 mb-4 mt-2">Operations</p>
            {navLinks.map((nav, idx) => {
              const isActive = pathname === nav.link || (nav.link !== '/buyer-dashboard' && pathname?.startsWith(nav.link));

              return (
                <Link key={idx} href={nav.link} className={`flex items-center justify-center lg:justify-start space-x-4 px-3 lg:px-4 py-3.5 rounded-xl transition-all font-bold ${
                  isActive 
                  ? 'bg-emerald-50 text-[#10893E]' 
                  : 'text-[#627768] hover:bg-slate-50 hover:text-[#0A2F1D]'
                }`}>
                  <span className={`text-xl ${isActive ? 'scale-110 drop-shadow-sm' : ''} transition-transform`}>{nav.icon}</span>
                  <span className="hidden lg:block">{nav.name}</span>
                </Link>
              );
            })}
          </nav>


        </aside>

        {/* --- SCROLLABLE RIGHT CONTENT AREA --- */}
        <div className="flex-1 h-full overflow-y-auto pt-[88px] relative z-0 hide-scrollbar bg-[#FDF8EE]">
          {children}
        </div>
      </div>
      
      {/* Hide Scrollbar Globally inside Layout */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}