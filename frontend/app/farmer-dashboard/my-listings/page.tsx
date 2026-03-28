"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Tag, MapPin, Package } from "lucide-react";

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
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://krishisetu-hhef.onrender.com";
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
    <main className="p-4 md:p-8 relative z-10 w-full animate-fade-in pb-24">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#0A2F1D] mb-1 drop-shadow-sm flex items-center gap-3">
            <Package className="w-8 h-8 text-[#10893E]" /> My Active Harvests
          </h1>
          <p className="text-[#627768] font-medium">Manage and track your published listings on the KrishiSetu market.</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Link href="/farmer-dashboard/new-listing">
            <button className="bg-[#FBC02D] text-[#0A2F1D] px-6 py-3 rounded-xl font-bold shadow-[0_6px_0_0_#D4A017] hover:shadow-[0_2px_0_0_#D4A017] hover:translate-y-[4px] active:translate-y-[6px] transition-all flex items-center gap-2">
              <Plus className="w-5 h-5" /> Add New Listing
            </button>
          </Link>
        </div>
      </header>

      {/* LISTINGS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
           <p className="text-[#627768] font-bold">Loading your listings...</p>
        ) : myListings.length === 0 ? (
           <div className="col-span-full py-16 text-center bg-white/50 border border-white rounded-[2rem] shadow-sm">
             <span className="text-5xl text-gray-300">🌾</span>
             <h3 className="text-xl font-black text-[#0A2F1D] mt-4">No Listings Found</h3>
             <p className="text-[#627768] mt-2 mb-6">You haven't listed any crops for sale yet.</p>
             <Link href="/farmer-dashboard/new-listing" className="inline-block text-[#10893E] font-bold hover:underline">
               Start your first listing →
             </Link>
           </div>
        ) : (
          myListings.map((item: any) => (
            <div key={item.id} className="bg-white border border-[#E2DFD3] shadow-sm p-6 rounded-[2rem] hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(10,47,29,0.08)] transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4 border-b border-[#0A2F1D]/5 pb-4">
                  <div>
                    <span className="text-[10px] font-black text-[#10893E] bg-[#E9F3E8] px-2 py-0.5 rounded-sm border border-[#CDE0C3] uppercase tracking-wide">
                      {item.status || "Active Listing"}
                    </span>
                    <h3 className="text-2xl font-black text-[#0A2F1D] mt-2">{item.crop}</h3>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-[#FDF8EE] p-3 rounded-xl border border-[#E2DFD3]">
                    <p className="text-[10px] font-bold text-[#8A9A90] uppercase">Quantity</p>
                    <p className="font-bold text-[#0A2F1D] text-lg">{item.quantity}</p>
                  </div>
                  <div className="bg-[#FDF8EE] p-3 rounded-xl border border-[#E2DFD3]">
                    <p className="text-[10px] font-bold text-[#8A9A90] uppercase">Asking Price</p>
                    <p className="font-bold text-[#10893E] text-lg">₹{item.price}</p>
                  </div>
                </div>

                <p className="text-xs text-[#627768] font-bold mb-6 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> Stored at: {item.location}
                </p>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 py-2.5 bg-white border-2 border-[#E2DFD3] text-[#0A2F1D] rounded-xl font-bold shadow-sm hover:border-[#FBC02D] hover:bg-[#FFF9EA] transition-colors">
                  Edit
                </button>
                <button className="flex-1 py-2.5 bg-white border-2 border-[#E2DFD3] text-red-600 rounded-xl font-bold shadow-sm hover:border-red-200 hover:bg-red-50 transition-colors">
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
