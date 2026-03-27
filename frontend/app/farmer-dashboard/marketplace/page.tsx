"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function MarketplacePage() {
  const [mounted, setMounted] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${API_URL}/requests`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (err) {
      console.error("Failed to fetch requests", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="p-4 md:p-8 relative z-10 w-full">
      {/* HEADER */}
      <header className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-10 transition-all duration-300 ease-out transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#0A2F1D] mb-1 drop-shadow-sm">Direct Marketplace</h1>
          <p className="text-[#627768] font-medium">Connect with verified buyers and negotiate better prices.</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-4 items-center">
         <Link href="/farmer-dashboard/notifications">
  <button className="bg-white border border-[#E2DFD3] shadow-sm p-3 rounded-xl text-xl hover:scale-110 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(10,47,29,0.1)] transition-all duration-150 relative group">
    {/* The Bell Icon */}
    <span className="group-hover:rotate-12 transition-transform inline-block">🔔</span>
    
    {/* The Notification Dot (Gold #FBC02D) */}
    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#FBC02D] rounded-full shadow-[0_0_8px_#FBC02D] animate-pulse"></span>
    
    {/* Optional: Tooltip on hover */}
    <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-[#0A2F1D] text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
      View Alerts
    </span>
  </button>
</Link>
        </div>
      </header>

      {/* --- SEARCH & FILTER GLASS BAR --- */}
      <div className={`bg-white border border-[#E2DFD3] shadow-sm p-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 items-center justify-between transition-all duration-300 ease-out transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex-1 w-full relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
          <input 
            type="text" 
            placeholder="Search for crops, buyers, or locations..." 
            className="w-full pl-12 pr-4 py-3 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10893E] text-[#0A2F1D] font-medium placeholder-[#8A9A90] shadow-inner transition-colors duration-150"
          />
        </div>
        <div className="flex space-x-3 w-full md:w-auto overflow-x-auto hide-scrollbar pb-2 md:pb-0">
          {['All', '🌾 Wheat', '🌻 Mustard', '🥔 Potato'].map((filter, idx) => (
            <button key={idx} className={`px-5 py-3 rounded-xl font-bold whitespace-nowrap transition-all duration-150 ${idx === 0 ? 'bg-[#0A2F1D] text-white shadow-md' : 'bg-white/60 text-[#627768] hover:bg-white hover:text-[#0A2F1D] hover:shadow-sm border border-transparent hover:border-[#E2DFD3]'}`}>
              {filter}
            </button>
          ))}
          <button className="px-4 py-3 bg-white/60 text-[#627768] rounded-xl font-bold hover:bg-white hover:text-[#0A2F1D] transition-all duration-150 border border-transparent hover:border-[#E2DFD3] flex items-center">
            <span className="mr-2">⚙️</span> Filters
          </button>
        </div>
      </div>

      {/* --- BENTO BOX GRID: BUYER DEMANDS --- */}
      <div className="mb-6 flex justify-between items-end">
        <h2 className="text-2xl font-black text-[#0A2F1D] drop-shadow-sm">Live Buyer Demands</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        
        {isLoading ? (
           <p className="text-[#627768] font-bold">Loading buyer demands...</p>
        ) : requests.length === 0 ? (
           <p className="text-[#627768] font-bold">No active buyer requests available right now.</p>
        ) : (
          requests.map((item: any) => (
            <div key={item.id} className={`bg-white border border-[#E2DFD3] shadow-sm p-6 rounded-[2rem] group hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(10,47,29,0.15)] transition-all duration-200 transform flex flex-col justify-between ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E2DFD3] to-white flex items-center justify-center text-xl shadow-sm border border-white">🏢</div>
                    <div>
                      <h3 className="font-bold text-[#0A2F1D] leading-tight">{item.users?.name || "Buyer"}</h3>
                      <span className="text-[10px] font-black text-[#10893E] bg-[#E9F3E8] px-2 py-0.5 rounded-sm border border-[#CDE0C3] tracking-wide uppercase">✓ Verified Buyer</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#627768] bg-white/80 px-2 py-1 rounded-md shadow-sm">📍 {item.location}</span>
                  </div>
                </div>
                
                <div className="my-5 p-4 bg-white/60 rounded-2xl border border-white/80 shadow-inner group-hover:bg-white transition-colors duration-200">
                  <p className="text-xs font-bold text-[#8A9A90] uppercase tracking-wider mb-1">Looking For</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🌾</span>
                    <span className="text-xl font-black text-[#0A2F1D]">{item.crop}</span>
                  </div>
                  <div className="mt-3 flex justify-between items-end">
                    <div>
                      <p className="text-xs font-medium text-[#627768]">Quantity Required</p>
                      <p className="font-bold text-[#0A2F1D]">{item.quantity} Quintals</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-[#627768]">Offered Price</p>
                      <p className="text-2xl font-black text-[#10893E]">₹{item.price}<span className="text-sm">/q</span></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Area: Contact Details & Accept Button */}
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#0A2F1D]/5">
                <div className="flex flex-col text-sm">
                  <span className="font-bold text-[#0A2F1D] flex items-center gap-1">👤 Contact Buyer</span>
                </div>
                <Link 
                  href={`/farmer-dashboard/marketplace/accept-offer/${item.id}`}
                  className="w-1/2 text-center py-3 bg-gradient-to-b from-[#FCD14D] to-[#FBC02D] text-[#0A2F1D] rounded-xl font-black shadow-[0_6px_0_0_#D49800,0_10px_20px_rgba(251,192,45,0.3)] hover:shadow-[0_2px_0_0_#D49800,0_10px_20px_rgba(251,192,45,0.4)] hover:translate-y-[4px] active:translate-y-[6px] active:shadow-none transition-all duration-150 border border-[#F5B921]"
                >
                  Accept Offer
                </Link>
              </div>
            </div>
          ))
        )}

      </div>
    </main>
  );
}
