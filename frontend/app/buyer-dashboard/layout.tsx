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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

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
      <Navbar />

      <div className="lg:hidden flex items-center bg-white border-b border-[#E2DFD3] p-4 pt-[80px] z-30 gap-4">
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-[#10893E] p-1 border border-[#10893E] rounded-md">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <span className="font-black text-[#0A2F1D] flex-1">Buyer Menu</span>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        <aside className={`fixed lg:relative top-0 left-0 h-full w-64 lg:w-72 bg-white border-r border-[#E2DFD3] flex flex-col justify-between pt-6 lg:pt-[88px] pb-6 transition-transform duration-300 z-[60] lg:z-40 shadow-2xl lg:shadow-[4px_0_24px_rgba(10,47,29,0.02)] ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="flex justify-between items-center px-4 lg:hidden mb-4 border-b pb-2">
            <span className="font-black text-[#0A2F1D]">Menu</span>
            <button onClick={() => setIsMobileMenuOpen(false)}>❌</button>
          </div>
          
          <nav className="flex-1 px-4 lg:px-6 space-y-2 overflow-y-auto hide-scrollbar">
            <p className="hidden lg:block text-xs font-black text-[#8A9A90] uppercase tracking-widest pl-2 mb-4 mt-2">Operations</p>
            {navLinks.map((nav, idx) => {
              const isActive = pathname === nav.link || (nav.link !== '/buyer-dashboard' && pathname?.startsWith(nav.link));
              return (
                <Link key={idx} href={nav.link} onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center space-x-4 px-4 py-3.5 rounded-xl transition-all font-bold ${
                  isActive ? 'bg-emerald-50 text-[#10893E]' : 'text-[#627768] hover:bg-slate-50 hover:text-[#0A2F1D]'
                }`}>
                  <span className={`text-xl ${isActive ? 'scale-110 drop-shadow-sm' : ''} transition-transform`}>{nav.icon}</span>
                  <span>{nav.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {isMobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-[55] lg:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>}

        <div className="flex-1 h-full overflow-y-auto pt-4 lg:pt-[88px] relative z-0 hide-scrollbar bg-[#FDF8EE]">
          {children}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}} />
    </div>
  );
}