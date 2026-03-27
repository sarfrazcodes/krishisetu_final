"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, MapPin, Building2, CheckCircle2 } from "lucide-react";

// The structure of our shared offer
interface BuyerOffer {
  id: string;
  buyerName: string;
  isPremiumBuyer: boolean;
  distance: string;
  crop: string;
  quantity: string;
  price: string;
  status: string;
}

export default function FarmerMarketplacePage() {
  const [mounted, setMounted] = useState(false);
  const [liveDemands, setLiveDemands] = useState<BuyerOffer[]>([]);

  useEffect(() => {
    setMounted(true);
    
    // --- LOAD OFFERS FROM MEMORY ---
    const loadOffers = () => {
      const savedOffers = JSON.parse(localStorage.getItem("krishisetu_offers") || "[]");
      // Only show offers that haven't been accepted yet
      const pendingOffers = savedOffers.filter((o: BuyerOffer) => o.status === "Pending");
      
      // If no offers exist yet, give them some dummy data so the page isn't empty!
      if (pendingOffers.length === 0) {
        setLiveDemands([
          {
            id: "MOCK-1", buyerName: "North India Mills", isPremiumBuyer: true, distance: "45 km",
            crop: "Mustard Seed", quantity: "50 Quintals", price: "₹6,050", status: "Pending"
          }
        ]);
      } else {
        // Reverse it so the newest offers show up first!
        setLiveDemands(pendingOffers.reverse());
      }
    };

    loadOffers();
    
    // Auto-refresh every 2 seconds to check for new buyer offers
    const interval = setInterval(loadOffers, 2000);
    return () => clearInterval(interval);

  }, []);

  // --- ACCEPT OFFER LOGIC ---
  const handleAcceptOffer = (offerId: string) => {
    // 1. Get all offers
    const savedOffers = JSON.parse(localStorage.getItem("krishisetu_offers") || "[]");
    
    // 2. Change the status of the accepted one
    const updatedOffers = savedOffers.map((o: BuyerOffer) => {
      if (o.id === offerId) {
        return { ...o, status: "Accepted" };
      }
      return o;
    });
    
    // 3. Save it back
    localStorage.setItem("krishisetu_offers", JSON.stringify(updatedOffers));
    
    // 4. Remove it from the current view
    setLiveDemands((prev) => prev.filter(o => o.id !== offerId));
    
    alert(`Offer Accepted! This has been moved to your Active Orders.`);
  };

  if (!mounted) return null;

  return (
    <main className="p-4 md:p-8 relative z-10 w-full">
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-black text-[#0A2F1D] mb-1">Direct Marketplace</h1>
        <p className="text-[#627768] font-medium">Connect with verified buyers and negotiate better prices.</p>
      </header>

      {/* --- LIVE BUYER DEMANDS --- */}
      <h2 className="text-2xl font-black text-[#0A2F1D] mb-6">Live Buyer Demands</h2>

      {liveDemands.length === 0 ? (
        <div className="bg-white border border-[#E2DFD3] shadow-sm p-10 text-center rounded-[2rem]">
          <p className="text-[#627768] font-bold">Waiting for buyers to send offers...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveDemands.map((offer) => (
            <div 
              key={offer.id} 
              className={`bg-white border border-[#E2DFD3] shadow-sm p-6 rounded-[2rem] flex flex-col justify-between ${
                offer.isPremiumBuyer ? "bg-gradient-to-br from-[#14A049] to-[#0A2F1D] text-white" : ""
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm border ${
                      offer.isPremiumBuyer ? "bg-white/10 border-white/20 text-white" : "bg-white/80 border-white text-[#0A2F1D]"
                    }`}>
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className={`font-bold leading-tight ${offer.isPremiumBuyer ? "text-white" : "text-[#0A2F1D]"}`}>
                        {offer.buyerName}
                      </h3>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wide border ${
                        offer.isPremiumBuyer 
                        ? "bg-[#FBC02D] text-[#0A2F1D] border-transparent" 
                        : "bg-[#E9F3E8] text-[#10893E] border-[#CDE0C3]"
                      }`}>
                        {offer.isPremiumBuyer ? "⭐ Premium Buyer" : "✓ Verified Buyer"}
                      </span>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md shadow-sm flex items-center gap-1 ${
                    offer.isPremiumBuyer ? "bg-black/20 text-white" : "bg-white/80 text-[#627768]"
                  }`}>
                    <MapPin className="w-3 h-3"/> {offer.distance}
                  </span>
                </div>
                
                <div className={`my-5 p-4 rounded-2xl shadow-inner ${
                  offer.isPremiumBuyer ? "bg-black/20 border border-white/10" : "bg-white/60 border border-white/80"
                }`}>
                  <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${
                    offer.isPremiumBuyer ? "text-green-200" : "text-[#8A9A90]"
                  }`}>Looking For</p>
                  
                  <span className={`text-xl font-black ${offer.isPremiumBuyer ? "text-white" : "text-[#0A2F1D]"}`}>
                    {offer.crop}
                  </span>
                  
                  <div className="mt-3 flex justify-between items-end">
                    <div>
                      <p className={`text-xs font-medium ${offer.isPremiumBuyer ? "text-green-200" : "text-[#627768]"}`}>Quantity</p>
                      <p className={`font-bold ${offer.isPremiumBuyer ? "text-white" : "text-[#0A2F1D]"}`}>{offer.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-medium ${offer.isPremiumBuyer ? "text-green-200" : "text-[#627768]"}`}>Offered Price</p>
                      <p className={`text-2xl font-black ${offer.isPremiumBuyer ? "text-[#FBC02D]" : "text-[#10893E]"}`}>
                        {offer.price}<span className="text-sm">/q</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => handleAcceptOffer(offer.id)}
                className={`w-full py-3 rounded-xl font-black transition-all border ${
                  offer.isPremiumBuyer
                  ? "bg-white text-[#0A2F1D] shadow-[0_6px_0_0_#CDE0C3] hover:translate-y-[4px] hover:shadow-[0_2px_0_0_#CDE0C3] border-transparent"
                  : "bg-gradient-to-b from-[#FCD14D] to-[#FBC02D] text-[#0A2F1D] shadow-[0_6px_0_0_#D49800] hover:translate-y-[4px] hover:shadow-[0_2px_0_0_#D49800] border-[#F5B921]"
                }`}
              >
                Accept Offer
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}