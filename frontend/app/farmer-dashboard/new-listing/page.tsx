"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";

const ChunkyCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white p-5 md:p-8 rounded-2xl md:rounded-[2rem] border-2 border-[#D6D0C4] border-b-[6px] shadow-[0_12px_24px_rgba(10,47,29,0.05)] ${className}`}>
    {children}
  </div>
);

const ChunkyInput = ({ className = "", ...props }: any) => (
  <motion.input
    whileFocus={{ scale: 1.01, borderColor: "#10893E" }}
    transition={{ duration: 0.15 }}
    className={`w-full px-4 md:px-5 py-3 md:py-4 bg-[#FDF8EE] rounded-xl border-2 border-[#D6D0C4] text-[#0A2F1D] text-sm md:text-base font-medium placeholder-[#8A9A90] focus:outline-none focus:ring-1 focus:ring-[#10893E] focus:border-b-[4px] transition-all duration-150 shadow-inner ${className}`}
    {...props}
  />
);

const CROP_OPTIONS = [
  { value: "Wheat (Lok-1)", label: "Wheat (Lok-1)", icon: "🌾" },
  { value: "Basmati Rice", label: "Basmati Rice", icon: "🌾" },
  { value: "Mustard Seed", label: "Mustard Seed", icon: "🌿" },
  { value: "Soybean", label: "Soybean", icon: "🌱" },
  { value: "Cotton", label: "Cotton", icon: "☁️" },
  { value: "Potato (Kufri)", label: "Potato (Kufri)", icon: "🥔" },
];

function NewListingForm() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [crop, setCrop] = useState(searchParams.get("crop") || "");
  const [quantity, setQuantity] = useState(searchParams.get("quantity") || "");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    try {
      const res = await fetch(`${API_URL}/listings`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ crop, quantity, price, location })
      });

      if (!res.ok) throw new Error("Failed to create listing");
      router.push("/farmer-dashboard/my-listings");
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 15 }}
      animate={mounted ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="p-4 md:p-8 max-w-6xl mx-auto overflow-x-hidden"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      <style dangerouslySetInnerHTML={{ __html: `@keyframes rolling-shine { 0% { background-position: 200% center; } 100% { background-position: -200% center; } }`}} />

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-4 border-b border-[#D6D0C4]/40">
        <div>
          <button onClick={() => router.back()} className="flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-[#10893E]/10 border border-[#10893E]/30 text-[#10893E] text-xs md:text-sm font-bold hover:bg-[#10893E]/20 transition-all w-fit">
            ← Back
          </button>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#0A2F1D]">Create New Listing</h1>
          <p className="text-sm md:text-base text-[#2D503C] font-semibold mt-2 max-w-2xl leading-relaxed">
            Fill in the details about your harvest. Once submitted, it will become visible to all active buyers.
          </p>
          {errorMsg && <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm font-bold">{errorMsg}</div>}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          <ChunkyCard>
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <span className="text-2xl md:text-3xl">📝</span>
              <h2 className="text-lg md:text-xl font-bold text-[#0A2F1D]">Basic Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-xs md:text-sm font-bold text-[#0A2F1D] mb-2 pl-1">Crop Type & Variety</label>
                <motion.select
                  value={crop} onChange={(e) => setCrop(e.target.value)}
                  whileFocus={{ scale: 1.01, borderColor: "#10893E" }}
                  className="w-full px-4 md:px-5 py-3 md:py-4 bg-[#FDF8EE] rounded-xl border-2 border-[#D6D0C4] text-[#0A2F1D] text-sm md:text-base font-medium focus:outline-none focus:ring-1 focus:ring-[#10893E] focus:border-b-[4px] transition-all shadow-inner appearance-none"
                  required
                >
                  <option value="" disabled>Select Crop Type</option>
                  {CROP_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.icon} {option.label}</option>)}
                </motion.select>
              </div>
              <div>
                <label className="block text-xs md:text-sm font-bold text-[#0A2F1D] mb-2 pl-1">Grade / Quality</label>
                <ChunkyInput placeholder="e.g. Grade A, Superfine" required />
              </div>
            </div>
          </ChunkyCard>

          <ChunkyCard>
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <span className="text-2xl md:text-3xl">⚖️</span>
              <h2 className="text-lg md:text-xl font-bold text-[#0A2F1D]">Quantity & Pricing</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="relative">
                <label className="block text-xs md:text-sm font-bold text-[#0A2F1D] mb-2 pl-1">Available Quantity</label>
                <div className="relative">
                  <ChunkyInput value={quantity} onChange={(e: any) => setQuantity(e.target.value)} type="number" placeholder="50" required className="pr-20 md:pr-24" />
                  <span className="absolute right-4 md:right-5 top-1/2 -translate-y-1/2 text-xs md:text-sm font-bold text-[#10893E]">Quintals</span>
                </div>
              </div>
              <div className="relative">
                <label className="block text-xs md:text-sm font-bold text-[#0A2F1D] mb-2 pl-1">Expected Price (Optional)</label>
                <div className="relative">
                  <ChunkyInput value={price} onChange={(e: any) => setPrice(e.target.value)} type="number" placeholder="2,210" className="pl-10 md:pl-12 pr-14 md:pr-16" />
                  <span className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#10893E]">₹</span>
                  <span className="absolute right-4 md:right-5 top-1/2 -translate-y-1/2 text-[10px] md:text-xs font-bold text-[#10893E]/60">per/q</span>
                </div>
              </div>
            </div>
          </ChunkyCard>

          <ChunkyCard>
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <span className="text-2xl md:text-3xl">🗒️</span>
              <h2 className="text-lg md:text-xl font-bold text-[#0A2F1D]">Harvest Details & Notes</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
              <div>
                <label className="block text-xs md:text-sm font-bold text-[#0A2F1D] mb-2 pl-1">Harvest Date</label>
                <motion.input type="date" className="w-full px-4 md:px-5 py-3 md:py-4 bg-[#FDF8EE] rounded-xl border-2 border-[#D6D0C4] text-[#0A2F1D] text-sm md:text-base font-medium focus:outline-none focus:ring-1 focus:ring-[#10893E] focus:border-b-[4px] shadow-inner" required />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-bold text-[#0A2F1D] mb-2 pl-1">Current Stored Location</label>
                <ChunkyInput value={location} onChange={(e: any) => setLocation(e.target.value)} placeholder="e.g. Godown / Mandi" required />
              </div>
            </div>
            <div>
              <label className="block text-xs md:text-sm font-bold text-[#0A2F1D] mb-2 pl-1">Additional Description</label>
              <motion.textarea rows={3} className="w-full px-4 md:px-5 py-3 md:py-4 bg-[#FDF8EE] rounded-xl border-2 border-[#D6D0C4] text-[#0A2F1D] text-sm md:text-base font-medium focus:outline-none focus:ring-1 focus:ring-[#10893E] focus:border-b-[4px] shadow-inner resize-none" placeholder="e.g. Organic, stored with care..." />
            </div>
          </ChunkyCard>
        </div>

        {/* RIGHT COLUMN (Stacks on mobile) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="lg:sticky lg:top-28">
            <ChunkyCard className="bg-[#10893E]/10 border-[#10893E]/30 shadow-[0_12px_30px_rgba(16,137,62,0.1)]">
              <p className="text-[10px] md:text-xs text-[#10893E] font-black uppercase tracking-wider mb-2">Review & Publish</p>
              <h3 className="text-sm md:text-base text-[#2D503C] font-semibold mb-4 md:mb-6">By publishing, you confirm the details provided are accurate.</h3>
              
              <motion.button type="submit" disabled={isSubmitting} className={`w-full group relative overflow-hidden px-6 py-4 md:py-5 text-[#0A2F1D] text-base md:text-lg font-black rounded-2xl border-2 border-b-[6px] md:border-b-[8px] transition-all shadow-[0_8px_15px_rgba(251,192,45,0.3)] ${isSubmitting ? "bg-gray-300 border-gray-400 opacity-70" : "bg-[#FBC02D] border-[#D4A017] hover:bg-[#FCD14D] active:border-b-2"}`}>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? "Publishing..." : "Publish My Harvest"}
                </span>
              </motion.button>

              <p className="text-center font-bold text-[#2D503C]/80 mt-4 md:mt-6 text-xs md:text-sm">
                or <button type="button" onClick={() => router.back()} className="text-[#10893E] font-extrabold hover:underline">Discard Changes</button>
              </p>
            </ChunkyCard>
          </div>
        </div>
      </form>
    </motion.main>
  );
}

export default function NewListingPage() {
  return (
    <Suspense fallback={<div className="p-10 font-bold text-[#10893E]">Loading Form...</div>}>
      <NewListingForm />
    </Suspense>
  );
}