"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Megaphone, MapPin, Calendar, Scale, IndianRupee, Sprout, Building2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewRequirementPage() {
  const [mounted, setMounted] = useState(false);
  const [crop, setCrop] = useState("Wheat (Lok-1)");
  const [quantity, setQuantity] = useState("100");
  const [price, setPrice] = useState("2400");
  const [location, setLocation] = useState("Ludhiana, Punjab");
  const [deadline, setDeadline] = useState("Next Friday");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!crop || !quantity || !location) {
      setErrorMsg("Please fill all required fields.");
      return;
    }
    setIsSubmitting(true);
    const token = localStorage.getItem("token");
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    try {
      const res = await fetch(`${API_URL}/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ crop, quantity, price, location })
      });
      if (!res.ok) throw new Error("Failed to create requirement");
      router.push("/buyer-dashboard/my-requests");
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred");
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="p-4 md:p-8 relative z-10 w-full animate-fade-in pb-24 overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col mb-8 md:mb-10 gap-2 md:gap-4">
          <Link href="/buyer-dashboard/procurement" className="text-[#10893E] text-sm md:text-base font-bold flex items-center gap-2 hover:-translate-x-1 transition-transform w-fit">
            <ArrowLeft className="w-4 h-4" /> Back to Market
          </Link>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0A2F1D] flex items-center gap-2 md:gap-3 mt-2">
            <Megaphone className="w-6 h-6 md:w-8 md:h-8 text-[#FBC02D]" /> Post Requirement
          </h1>
          <p className="text-[#627768] font-medium text-sm md:text-base">Create a public request visible to verified farmers.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
          
          {/* THE FORM */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white border border-[#E2DFD3] shadow-sm p-5 md:p-8 rounded-2xl md:rounded-[2rem]">
              <h2 className="text-lg md:text-xl font-black text-[#0A2F1D] mb-4">Requirement Details</h2>
              {errorMsg && <div className="mb-4 text-sm font-bold text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">{errorMsg}</div>}

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                <div>
                  <label className="block text-[10px] md:text-xs font-bold text-[#8A9A90] uppercase tracking-wider mb-2">Commodity Type</label>
                  <div className="relative">
                    <Sprout className="absolute left-4 top-1/2 -translate-y-1/2 text-[#10893E] w-4 h-4 md:w-5 md:h-5" />
                    <select value={crop} onChange={(e) => setCrop(e.target.value)} className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10893E] text-[#0A2F1D] text-sm md:text-base font-bold transition-colors appearance-none">
                      <option>Wheat (Lok-1)</option><option>Mustard Seed</option><option>Potato (Kufri)</option><option>Basmati Rice</option><option>Cotton</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                  <div>
                    <label className="block text-[10px] md:text-xs font-bold text-[#8A9A90] uppercase tracking-wider mb-2">Required Quantity</label>
                    <div className="relative">
                      <Scale className="absolute left-4 top-1/2 -translate-y-1/2 text-[#10893E] w-4 h-4 md:w-5 md:h-5" />
                      <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="100" className="w-full pl-10 md:pl-12 pr-16 py-3 md:py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10893E] text-[#0A2F1D] text-sm md:text-base font-bold transition-colors" />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A9A90] text-xs md:text-sm font-bold">Quintals</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] md:text-xs font-bold text-[#8A9A90] uppercase tracking-wider mb-2">Target Price</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-[#10893E] w-4 h-4 md:w-5 md:h-5" />
                      <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="2400" className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10893E] text-[#0A2F1D] text-sm md:text-base font-bold transition-colors" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] md:text-xs font-bold text-[#8A9A90] uppercase tracking-wider mb-2">Delivery Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#10893E] w-4 h-4 md:w-5 md:h-5" />
                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ludhiana, Punjab" className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10893E] text-[#0A2F1D] text-sm md:text-base font-bold transition-colors" />
                  </div>
                </div>
              </form>
            </div>

            <button onClick={handleSubmit} disabled={isSubmitting} className={`w-full py-4 md:py-5 text-white rounded-xl md:rounded-[1.5rem] font-black text-base md:text-lg transition-all duration-150 ${isSubmitting ? "bg-gray-400 cursor-not-allowed opacity-80" : "bg-gradient-to-b from-[#14A049] to-[#10893E] shadow-[0_6px_0_0_#0D7334] hover:translate-y-[2px] active:shadow-none"}`}>
              {isSubmitting ? "Broadcasting..." : "Broadcast to Farmers 📡"}
            </button>
          </div>

          {/* LIVE PREVIEW */}
          <div className="lg:col-span-2 mt-4 lg:mt-0">
            <h2 className="text-xs md:text-sm font-bold tracking-wider text-[#10893E] uppercase mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Live Preview
            </h2>
            <div className="bg-white border border-[#E2DFD3] shadow-sm p-4 md:p-6 rounded-2xl md:rounded-[2rem] border-t-4 border-t-[#10893E] opacity-90 relative pointer-events-none">
              <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] z-20"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-[#0A2F1D] flex items-center justify-center text-white"><Building2 className="w-4 h-4" /></div>
                    <div>
                      <h3 className="font-bold text-[#0A2F1D] text-sm leading-tight">Punjab Agro Foods</h3>
                      <span className="text-[8px] md:text-[10px] font-black text-[#10893E] bg-[#E9F3E8] px-1.5 py-0.5 rounded-sm uppercase">✓ Verified Buyer</span>
                    </div>
                  </div>
                </div>
                <div className="my-4 p-4 bg-[#10893E] rounded-xl text-white">
                  <p className="text-[10px] md:text-xs font-bold text-green-200 uppercase mb-1">Looking For Delivery</p>
                  <span className="text-lg md:text-xl font-black text-white">{crop || "Commodity"}</span>
                  <div className="mt-3 flex justify-between items-end">
                    <div>
                      <p className="text-[10px] md:text-xs text-green-200">Quantity</p>
                      <p className="font-bold text-sm">{quantity || "0"} ql</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] md:text-xs text-green-200">Offered</p>
                      <p className="text-xl md:text-2xl font-black text-[#FBC02D]">₹{price || "0"}</p>
                    </div>
                  </div>
                </div>
                <div className="w-full py-2.5 bg-white text-[#0A2F1D] border border-[#E2DFD3] rounded-xl font-black text-center text-sm">Accept Offer</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}