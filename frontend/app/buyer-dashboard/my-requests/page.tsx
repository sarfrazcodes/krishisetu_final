"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Megaphone, MapPin } from "lucide-react";

export default function MyRequestsPage() {
  const [mounted, setMounted] = useState(false);
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://krishisetu-hhef.onrender.com";
      const res = await fetch(`${API_URL}/requests/my-requests`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMyRequests(data);
      }
    } catch (err) {
      console.error("Failed to fetch my requests", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="p-4 md:p-8 relative z-10 w-full animate-fade-in pb-24 overflow-x-hidden">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-[#0A2F1D] mb-1 flex items-center gap-2">
            <Megaphone className="w-6 h-6 md:w-8 md:h-8 text-[#10893E]" /> My Published Requests
          </h1>
          <p className="text-[#627768] font-medium text-sm md:text-base">Manage your active broadcasts.</p>
        </div>

        <Link href="/buyer-dashboard/new-request" className="w-full md:w-auto">
          <button className="w-full md:w-auto bg-[#10893E] text-white px-6 py-3 rounded-xl font-bold shadow-[0_4px_0_0_#0D7334] hover:-translate-y-1 transition-all flex items-center justify-center gap-2 text-sm md:text-base">
            <Plus className="w-4 h-4" /> Broadcast Request
          </button>
        </Link>
      </header>

      {/* CHANGED TO grid-cols-2 for mobile! */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
        {isLoading ? (
          <p className="col-span-full text-[#627768] font-bold">Loading your requests...</p>
        ) : myRequests.length === 0 ? (
          <div className="col-span-full py-10 md:py-16 text-center bg-white border border-[#E2DFD3] rounded-2xl md:rounded-[2rem]">
            <span className="text-4xl md:text-5xl text-gray-300">📢</span>
            <h3 className="text-lg md:text-xl font-black text-[#0A2F1D] mt-3">No Requests Found</h3>
            <Link href="/buyer-dashboard/new-request" className="inline-block mt-2 text-[#10893E] font-bold text-sm hover:underline">
              Create your first request →
            </Link>
          </div>
        ) : (
          myRequests.map((item: any) => (
            <div key={item.id} className="bg-white border border-[#E2DFD3] shadow-sm p-4 md:p-6 rounded-2xl md:rounded-[2rem] hover:-translate-y-1 transition-all flex flex-col justify-between">
              <div>
                <div className="mb-3 md:mb-4 border-b border-[#0A2F1D]/5 pb-3">
                  <span className="text-[8px] md:text-[10px] font-black text-white bg-[#10893E] px-1.5 md:px-2 py-0.5 rounded-sm uppercase tracking-wide inline-block mb-1">
                    Active Broadcast
                  </span>
                  <h3 className="text-base md:text-2xl font-black text-[#0A2F1D] leading-tight truncate w-full" title={item.crop}>{item.crop}</h3>
                </div>

                <div className="grid grid-cols-2 gap-2 md:gap-4 mb-4">
                  <div className="bg-slate-50 p-2 md:p-3 rounded-lg md:rounded-xl border border-slate-100">
                    <p className="text-[8px] md:text-[10px] font-bold text-[#8A9A90] uppercase">Demanding</p>
                    <p className="font-bold text-[#0A2F1D] text-sm md:text-lg">{item.quantity} q</p>
                  </div>
                  <div className="bg-slate-50 p-2 md:p-3 rounded-lg md:rounded-xl border border-slate-100">
                    <p className="text-[8px] md:text-[10px] font-bold text-[#8A9A90] uppercase">Target</p>
                    <p className="font-bold text-[#10893E] text-sm md:text-lg truncate">₹{item.price}</p>
                  </div>
                </div>

                <p className="text-[10px] md:text-xs text-[#627768] font-bold mb-4 md:mb-6 flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 shrink-0" /> Loc: {item.location}
                </p>
              </div>

              <button className="w-full py-2 md:py-2.5 bg-white border border-[#E2DFD3] text-red-600 rounded-lg md:rounded-xl font-bold text-xs md:text-sm hover:bg-red-50">
                Close Request
              </button>
            </div>
          ))
        )}
      </div>
    </main>
  );
}