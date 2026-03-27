"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Filter, MapPin, CheckCircle2 } from "lucide-react";

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
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
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

  // --- THE MAGIC CONNECTION FUNCTION ---
  const handleSendOffer = (farmerName: string, crop: string, qty: string, price: string, id: string) => {
    // 1. Create the offer object
    const newOffer = {
      id: `OFFER-${Math.floor(Math.random() * 10000)}`,
      buyerName: "Punjab Agro Foods", // The current logged-in buyer
      isPremiumBuyer: true,
      distance: "12 km",
      crop: crop,
      quantity: qty,
      price: price,
      status: "Pending", // Waiting for farmer to accept
      timestamp: new Date().toISOString()
    };

    // 2. Get existing offers from browser memory
    const existingOffers = JSON.parse(localStorage.getItem("krishisetu_offers") || "[]");
    
    // 3. Add the new offer
    existingOffers.push(newOffer);
    
    // 4. Save back to memory
    localStorage.setItem("krishisetu_offers", JSON.stringify(existingOffers));
    
    // 5. Update UI to show success checkmark
    setSentOffers((prev) => [...prev, id]);
    
    // Optional: Alert just so you know it worked while testing
    alert(`Offer for ${crop} sent successfully to ${farmerName}! Check the Farmer Dashboard.`);
  };

  if (!mounted) return null;

  return (
    <main className="p-4 md:p-8 relative z-10 w-full">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#0A2F1D] mb-1 drop-shadow-sm">Procurement Market</h1>
          <p className="text-[#627768] font-medium">Browse verified farmer harvests and secure your supply.</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-4 items-center">
          <Link href="/buyer-dashboard/notifications">
            <button className="bg-white border border-[#E2DFD3] shadow-sm p-3 rounded-xl text-xl hover:scale-110 hover:-translate-y-1 transition-all relative">
              🔔<span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#FBC02D] rounded-full animate-pulse"></span>
            </button>
          </Link>
          <Link href="/buyer-dashboard/new-request">
            <button className="bg-[#10893E] text-white px-6 py-3 rounded-xl font-bold shadow-[0_6px_0_0_#0D7334] hover:shadow-[0_2px_0_0_#0D7334] hover:translate-y-[4px] active:translate-y-[6px] transition-all">
              + New Request
            </button>
          </Link>
        </div>
      </header>

      {/* --- BENTO BOX GRID: FARMER HARVESTS --- */}
      <h2 className="text-2xl font-black text-[#0A2F1D] drop-shadow-sm mb-6">Live Farmer Harvests</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        
        {isLoading ? (
           <p className="text-[#627768] font-bold">Loading live harvests...</p>
        ) : listings.length === 0 ? (
           <p className="text-[#627768] font-bold">No active harvests available right now.</p>
        ) : (
          listings.map((item: any) => (
            <div key={item.id} className="bg-white border border-[#E2DFD3] shadow-sm p-6 rounded-[2rem] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E2DFD3] to-white flex items-center justify-center text-xl shadow-sm border border-white">🧑🏽‍🌾</div>
                    <div>
                      <h3 className="font-bold text-[#0A2F1D] leading-tight">{item.users?.name || "Farmer"}</h3>
                      <span className="text-[10px] font-black text-[#10893E] bg-[#E9F3E8] px-2 py-0.5 rounded-sm border border-[#CDE0C3] uppercase">✓ Verified Farmer</span>
                    </div>
                  </div>
                </div>
                
                <div className="my-5 p-4 bg-white/60 rounded-2xl border border-white/80 shadow-inner">
                  <p className="text-xs font-bold text-[#8A9A90] uppercase tracking-wider mb-1">Available Crop</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-black text-[#0A2F1D]">🌾 {item.crop}</span>
                  </div>
                  <div className="mt-3 flex justify-between items-end">
                    <div>
                      <p className="text-xs font-medium text-[#627768]">Available Stock</p>
                      <p className="font-bold text-[#0A2F1D]">{item.quantity} Quintals</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-[#627768]">Asking Price</p>
                      <p className="text-2xl font-black text-[#10893E]">₹{item.price}<span className="text-sm">/q</span></p>
                    </div>
                  </div>
                  <p className="text-xs text-[#8A9A90] mt-2 font-bold"><MapPin className="w-3 h-3 inline mr-1" /> {item.location}</p>
                </div>
              </div>

              <button 
                onClick={() => handleSendOffer(item.users?.name || "Farmer", item.crop, item.quantity, item.price, item.id)}
                disabled={sentOffers.includes(item.id)}
                className={`w-full py-3 rounded-xl font-black transition-all flex justify-center items-center gap-2 ${
                  sentOffers.includes(item.id) 
                  ? "bg-[#10893E] text-white shadow-inner cursor-default" 
                  : "bg-gradient-to-b from-[#FCD14D] to-[#FBC02D] text-[#0A2F1D] shadow-[0_6px_0_0_#D49800] hover:translate-y-[4px] hover:shadow-[0_2px_0_0_#D49800] border border-[#F5B921]"
                }`}
              >
                {sentOffers.includes(item.id) ? <><CheckCircle2 className="w-5 h-5"/> Offer Sent</> : "Send Offer"}
              </button>
            </div>
          ))
        )}

      </div>
    </main>
  );
}
