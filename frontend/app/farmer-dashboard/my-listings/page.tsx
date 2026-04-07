"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, MapPin, Package } from "lucide-react";

export default function MyListingsPage() {
  const [mounted, setMounted] = useState(false);
  const [myListings, setMyListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    try {
      const token = localStorage.getItem("token");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_URL}/listings/my-listings`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMyListings(data);
      }
    } catch (err) {
      console.error("Failed to fetch my listings", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="p-4 md:p-8 relative z-10 w-full animate-fade-in pb-24 overflow-x-hidden">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-[#0A2F1D] mb-1 flex items-center gap-2">
            <Package className="w-6 h-6 md:w-8 md:h-8 text-[#10893E]" /> My Active Harvests
          </h1>
          <p className="text-[#627768] text-sm md:text-base font-medium">Manage your published listings on the KrishiSetu market.</p>
        </div>

        <Link href="/farmer-dashboard/new-listing" className="w-full md:w-auto">
          <button className="w-full md:w-auto bg-[#FBC02D] text-[#0A2F1D] px-6 py-3 rounded-xl font-bold shadow-[0_4px_0_0_#D4A017] hover:-translate-y-1 transition-all flex items-center justify-center gap-2 text-sm md:text-base">
            <Plus className="w-4 h-4" /> Add New Listing
          </button>
        </Link>
      </header>

      {/* CHANGED TO grid-cols-2 for mobile! */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
        {isLoading ? (
          <p className="col-span-full text-[#627768] font-bold">Loading your listings...</p>
        ) : myListings.length === 0 ? (
          <div className="col-span-full py-10 md:py-16 text-center bg-white/50 border border-white rounded-[2rem] shadow-sm">
            <span className="text-4xl md:text-5xl text-gray-300">🌾</span>
            <h3 className="text-lg md:text-xl font-black text-[#0A2F1D] mt-4">No Listings Found</h3>
            <p className="text-[#627768] text-xs md:text-sm mt-2 mb-6">You haven't listed any crops for sale yet.</p>
            <Link href="/farmer-dashboard/new-listing" className="text-[#10893E] font-bold text-sm">Start your first listing →</Link>
          </div>
        ) : (
          myListings.map((item: any) => (
            <div key={item.id} className="bg-white border border-[#E2DFD3] shadow-sm p-4 md:p-6 rounded-2xl md:rounded-[2rem] hover:-translate-y-1 transition-all flex flex-col justify-between">
              <div>
                <div className="mb-3 md:mb-4 border-b border-[#0A2F1D]/5 pb-3">
                  <span className="text-[8px] md:text-[10px] font-black text-[#10893E] bg-[#E9F3E8] px-1.5 md:px-2 py-0.5 rounded-sm uppercase tracking-wide inline-block mb-1">
                    {item.status || "Active Listing"}
                  </span>
                  <h3 className="text-base md:text-2xl font-black text-[#0A2F1D] leading-tight truncate w-full" title={item.crop}>{item.crop}</h3>
                </div>

                <div className="grid grid-cols-2 gap-2 md:gap-4 mb-4">
                  <div className="bg-[#FDF8EE] p-2 md:p-3 rounded-lg md:rounded-xl border border-[#E2DFD3]">
                    <p className="text-[8px] md:text-[10px] font-bold text-[#8A9A90] uppercase">Quantity</p>
                    <p className="font-bold text-[#0A2F1D] text-sm md:text-lg">{item.quantity} q</p>
                  </div>
                  <div className="bg-[#FDF8EE] p-2 md:p-3 rounded-lg md:rounded-xl border border-[#E2DFD3]">
                    <p className="text-[8px] md:text-[10px] font-bold text-[#8A9A90] uppercase">Price</p>
                    <p className="font-bold text-[#10893E] text-sm md:text-lg truncate">₹{item.price}</p>
                  </div>
                </div>

                <p className="text-[10px] md:text-xs text-[#627768] font-bold mb-4 md:mb-6 flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0" /> {item.location}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button className="flex-1 py-2 md:py-2.5 bg-white border-2 border-[#E2DFD3] text-[#0A2F1D] rounded-lg md:rounded-xl font-bold text-xs md:text-sm hover:border-[#FBC02D]">Edit</button>
                <button className="flex-1 py-2 md:py-2.5 bg-white border-2 border-[#E2DFD3] text-red-600 rounded-lg md:rounded-xl font-bold text-xs md:text-sm hover:bg-red-50">Del</button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}