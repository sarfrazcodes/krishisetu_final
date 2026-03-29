"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft, Megaphone, MapPin, Calendar, Scale, IndianRupee, Sprout, Building2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewRequirementPage() {
  const [mounted, setMounted] = useState(false);

  // Form State
  const [crop, setCrop] = useState("Wheat (Lok-1)");
  const [quantity, setQuantity] = useState("100");
  const [price, setPrice] = useState("2400");
  const [location, setLocation] = useState("Ludhiana, Punjab");
  const [deadline, setDeadline] = useState("Next Friday");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!crop || !quantity || !location) {
      setErrorMsg("Please fill all required fields.");
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem("token");
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://krishisetu-hhef.onrender.com";

    try {
      const res = await fetch(`${API_URL}/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ crop, quantity, price, location })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to create requirement");
      }

      router.push("/buyer-dashboard/my-requests");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An error occurred");
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="p-4 md:p-8 relative z-10 w-full animate-fade-in pb-24">

      {/* HEADER SECTION */}
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <div className="space-y-2">
            <Link href="/buyer-dashboard/procurement" className="text-[#10893E] font-bold flex items-center gap-2 hover:-translate-x-1 transition-transform">
              <ArrowLeft className="w-4 h-4" /> Back to Farmer Market
            </Link>
            <h1 className="text-4xl font-black text-[#0A2F1D] flex items-center gap-3">
              <Megaphone className="w-8 h-8 text-[#FBC02D]" /> Post New Requirement
            </h1>
            <p className="text-[#627768] font-medium">Create a public request that will be visible to all verified farmers in your region.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* LEFT COLUMN: THE FORM */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white border border-[#E2DFD3] shadow-sm p-6 md:p-8 rounded-[2rem] shadow-lg">
              <h2 className="text-xl font-black text-[#0A2F1D] mb-4">Requirement Details</h2>
              {errorMsg && <div className="mb-4 text-sm font-bold text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">{errorMsg}</div>}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Crop Selection */}
                <div>
                  <label className="block text-xs font-bold text-[#8A9A90] uppercase tracking-wider mb-2">Commodity Type</label>
                  <div className="relative">
                    <Sprout className="absolute left-4 top-1/2 -translate-y-1/2 text-[#10893E] w-5 h-5" />
                    <select
                      value={crop}
                      onChange={(e) => setCrop(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/60 border border-white/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#10893E] text-[#0A2F1D] font-bold shadow-inner transition-colors appearance-none"
                    >
                      <option>Wheat (Lok-1)</option>
                      <option>Mustard Seed</option>
                      <option>Potato (Kufri)</option>
                      <option>Basmati Rice</option>
                      <option>Cotton</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Quantity */}
                  <div>
                    <label className="block text-xs font-bold text-[#8A9A90] uppercase tracking-wider mb-2">Required Quantity</label>
                    <div className="relative">
                      <Scale className="absolute left-4 top-1/2 -translate-y-1/2 text-[#10893E] w-5 h-5" />
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="e.g. 100"
                        className="w-full pl-12 pr-16 py-4 bg-white/60 border border-white/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#10893E] text-[#0A2F1D] font-bold shadow-inner transition-colors"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A9A90] font-bold">Quintals</span>
                    </div>
                  </div>

                  {/* Target Price */}
                  <div>
                    <label className="block text-xs font-bold text-[#8A9A90] uppercase tracking-wider mb-2">Target Price (Per Quintal)</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-[#10893E] w-5 h-5" />
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="e.g. 2400"
                        className="w-full pl-12 pr-4 py-4 bg-white/60 border border-white/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#10893E] text-[#0A2F1D] font-bold shadow-inner transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Location */}
                <div>
                  <label className="block text-xs font-bold text-[#8A9A90] uppercase tracking-wider mb-2">Delivery Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#10893E] w-5 h-5" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Ludhiana, Punjab"
                      className="w-full pl-12 pr-4 py-4 bg-white/60 border border-white/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#10893E] text-[#0A2F1D] font-bold shadow-inner transition-colors"
                    />
                  </div>
                </div>

                {/* Deadline */}
                <div>
                  <label className="block text-xs font-bold text-[#8A9A90] uppercase tracking-wider mb-2">Required By</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#10893E] w-5 h-5" />
                    <input
                      type="text"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      placeholder="e.g. Within 7 Days"
                      className="w-full pl-12 pr-4 py-4 bg-white/60 border border-white/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#10893E] text-[#0A2F1D] font-bold shadow-inner transition-colors"
                    />
                  </div>
                </div>

              </form>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full py-5 text-white rounded-[1.5rem] font-black text-lg transition-all duration-150 flex items-center justify-center gap-2 ${isSubmitting ? "bg-gray-400 cursor-not-allowed opacity-80" : "bg-gradient-to-b from-[#14A049] to-[#10893E] shadow-[0_8px_0_0_#0D7334,0_15px_30px_rgba(16,137,62,0.4)] hover:shadow-[0_4px_0_0_#0D7334,0_15px_30px_rgba(16,137,62,0.5)] hover:translate-y-[4px] active:translate-y-[8px] active:shadow-none"
                }`}
            >
              {isSubmitting ? "Broadcasting..." : "Broadcast to Farmers 📡"}
            </button>
          </div>

          {/* RIGHT COLUMN: LIVE PREVIEW (What the farmer sees) */}
          <div className="lg:col-span-2">
            <h2 className="text-sm font-bold tracking-wider text-[#10893E] uppercase mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Live Preview
            </h2>

            {/* The Farmer's View Card */}
            <div className="bg-white border border-[#E2DFD3] shadow-sm p-6 rounded-[2rem] border-t-4 border-t-[#10893E] shadow-[0_20px_40px_rgba(10,47,29,0.1)] opacity-90 scale-95 origin-top relative overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] z-20"></div> {/* Gives it a "preview" feel */}

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0A2F1D] to-[#10893E] flex items-center justify-center text-white shadow-sm border border-white">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0A2F1D] leading-tight">Punjab Agro Foods</h3>
                      <span className="text-[10px] font-black text-[#10893E] bg-[#E9F3E8] px-2 py-0.5 rounded-sm border border-[#CDE0C3] tracking-wide uppercase">✓ Verified Buyer</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#627768] bg-white/80 px-2 py-1 rounded-md shadow-sm flex items-center gap-1"><MapPin className="w-3 h-3" /> ~ km</span>
                  </div>
                </div>

                <div className="my-5 p-4 bg-[#10893E] rounded-2xl shadow-inner text-white">
                  <p className="text-xs font-bold text-green-200 uppercase tracking-wider mb-1">Looking For Urgent Delivery</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-black text-white">{crop || "Commodity"}</span>
                  </div>
                  <div className="mt-3 flex justify-between items-end">
                    <div>
                      <p className="text-xs font-medium text-green-200">Quantity Required</p>
                      <p className="font-bold text-white">{quantity || "0"} Quintals</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-green-200">Offered Price</p>
                      <p className="text-2xl font-black text-[#FBC02D]">₹{price || "0"}<span className="text-sm">/q</span></p>
                    </div>
                  </div>
                </div>

                <div className="w-full py-3 bg-white text-[#0A2F1D] rounded-xl font-black text-center shadow-sm">
                  Accept Offer
                </div>
              </div>
            </div>
            <p className="text-xs text-[#627768] text-center mt-4 font-medium px-4">This is exactly how your request will appear on the farmer's marketplace.</p>
          </div>

        </div>
      </div>
    </main>
  );
}
