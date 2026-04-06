"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, CheckCircle2 } from "lucide-react";

export default function ProcurementPage() {
  const [mounted, setMounted] = useState(false);
  const [sentOffers, setSentOffers] = useState<string[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const token = localStorage.getItem("token");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://krishisetu-hhef.onrender.com";
      const res = await fetch(`${API_URL}/listings`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setListings(data);
      }
    } catch (err) {
      console.error("Failed to fetch listings", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOffer = (farmerName: string, crop: string, qty: string, price: string, id: string) => {
    const newOffer = {
      id: `OFFER-${Math.floor(Math.random() * 10000)}`,
      buyerName: "Punjab Agro Foods",
      isPremiumBuyer: true,
      distance: "12 km",
      crop: crop,
      quantity: qty,
      price: price,
      status: "Pending", 
      timestamp: new Date().toISOString()
    };

    const existingOffers = JSON.parse(localStorage.getItem("krishisetu_offers") || "[]");
    existingOffers.push(newOffer);
    localStorage.setItem("krishisetu_offers", JSON.stringify(existingOffers));
    setSentOffers((prev) => [...prev, id]);
  };

  if (!mounted) return null;

  return (
    <main className="p-4 md:p-8 relative z-10 w-full overflow-x-hidden animate-fade-in pb-24">
      {/* HEADER */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 md:mb-10 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0A2F1D] mb-1 drop-shadow-sm">Procurement Market</h1>
          <p className="text-[#627768] font-medium text-sm md:text-base">Browse verified farmer harvests and secure your supply.</p>
        </div>

        <div className="flex flex-wrap gap-3 items-center w-full sm:w-auto">
          <Link href="/buyer-dashboard/notifications">
            <button className="bg-white border border-[#E2DFD3] shadow-sm p-3 rounded-xl text-lg md:text-xl hover:-translate-y-1 transition-all relative">
              🔔<span className="absolute top-2 right-2 w-2 h-2 md:w-2.5 md:h-2.5 bg-[#FBC02D] rounded-full animate-pulse"></span>
            </button>
          </Link>
          <Link href="/buyer-dashboard/new-request" className="flex-1 sm:flex-none">
            <button className="w-full bg-[#10893E] text-white px-4 md:px-6 py-3 rounded-xl font-bold shadow-md hover:-translate-y-1 transition-all flex items-center justify-center whitespace-nowrap">
              + New Request
            </button>
          </Link>
        </div>
      </header>

      <h2 className="text-xl md:text-2xl font-black text-[#0A2F1D] drop-shadow-sm mb-4 md:mb-6">Live Farmer Harvests</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {isLoading ? (
          <p className="text-[#627768] font-bold">Loading live harvests...</p>
        ) : listings.length === 0 ? (
          <p className="text-[#627768] font-bold bg-white p-6 rounded-2xl border border-[#E2DFD3]">No active harvests available right now.</p>
        ) : (
          listings.map((item: any) => (
            <div key={item.id} className="bg-white border border-[#E2DFD3] shadow-sm p-5 md:p-6 rounded-2xl md:rounded-[2rem] flex flex-col justify-between group hover:-translate-y-1 transition-all">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-lg md:text-xl shadow-inner">🧑🏽‍🌾</div>
                    <div>
                      <h3 className="font-bold text-[#0A2F1D] text-sm md:text-base leading-tight">{item.users?.name || "Farmer"}</h3>
                      <span className="text-[8px] md:text-[10px] font-black text-[#10893E] bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-100 uppercase inline-block mt-1">✓ Verified Farmer</span>
                    </div>
                  </div>
                </div>

                <div className="my-4 md:my-5 p-3 md:p-4 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100 shadow-inner">
                  <p className="text-[10px] md:text-xs font-bold text-[#8A9A90] uppercase tracking-wider mb-1">Available Crop</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg md:text-xl font-black text-[#0A2F1D]">🌾 {item.crop}</span>
                  </div>
                  <div className="mt-3 flex justify-between items-end">
                    <div>
                      <p className="text-[10px] md:text-xs font-medium text-[#627768]">Available Stock</p>
                      <p className="font-bold text-[#0A2F1D] text-sm md:text-base">{item.quantity} q</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] md:text-xs font-medium text-[#627768]">Asking Price</p>
                      <p className="text-xl md:text-2xl font-black text-[#10893E]">₹{item.price}<span className="text-xs md:text-sm">/q</span></p>
                    </div>
                  </div>
                  <p className="text-[10px] md:text-xs text-[#8A9A90] mt-2 font-bold truncate"><MapPin className="w-3 h-3 inline mr-1" /> {item.location}</p>
                </div>
              </div>

              <button
                onClick={() => handleSendOffer(item.users?.name || "Farmer", item.crop, item.quantity, item.price, item.id)}
                disabled={sentOffers.includes(item.id)}
                className={`w-full py-2.5 md:py-3 rounded-xl font-black transition-all flex justify-center items-center gap-2 text-sm md:text-base ${sentOffers.includes(item.id)
                    ? "bg-[#10893E] text-white shadow-inner cursor-default"
                    : "bg-gradient-to-b from-[#FCD14D] to-[#FBC02D] text-[#0A2F1D] shadow-[0_4px_0_0_#D49800] hover:translate-y-[2px] active:shadow-none border border-[#F5B921]"
                  }`}
              >
                {sentOffers.includes(item.id) ? <><CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" /> Offer Sent</> : "Send Offer"}
              </button>
            </div>
          ))
        )}

      </div>
    </main>
  );
}