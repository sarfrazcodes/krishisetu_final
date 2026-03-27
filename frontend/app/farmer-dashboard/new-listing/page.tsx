"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- CUSTOM COMPONENTS FOR CONSISTENCY ---

// Reusable Chunky 3D Card wrapper (like the dashboard boxes)
const ChunkyCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border-2 border-[#D6D0C4] border-b-[6px] shadow-[0_12px_24px_rgba(10,47,29,0.05)] ${className}`}>
    {children}
  </div>
);

// Reusable Chunky 3D Input with animation on focus
const ChunkyInput = ({ ...props }) => (
  <motion.input
    whileFocus={{ scale: 1.01, borderColor: "#10893E" }}
    transition={{ duration: 0.15 }}
    className="w-full px-5 py-4 bg-[#FDF8EE] rounded-xl border-2 border-[#D6D0C4] text-[#0A2F1D] text-base font-medium placeholder-[#8A9A90] focus:outline-none focus:ring-1 focus:ring-[#10893E] focus:border-b-[4px] transition-all duration-150 shadow-inner"
    {...props}
  />
);

// Define some hardcoded options for the Select dropdown
const CROP_OPTIONS = [
  { value: "wheat_lok1", label: "Lok-1 Wheat", icon: "🌾" },
  { value: "cotton_bt", label: "BT Cotton", icon: "🌱" },
  { value: "potato_a", label: "Grade A Potato", icon: "🥔" },
  { value: "mustard_r", label: "Rajesh Mustard", icon: "🌿" },
];

export default function NewListingPage() {
  const [mounted, setMounted] = useState(false);
  
  // State for image upload preview
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Entrance animations on mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 15 }}
      animate={mounted ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="p-6 md:p-10"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      
      {/* GLOBAL ANIMATIONS FOR SUBMIT BUTTON SHINE */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes rolling-shine {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}} />

      {/* HEADER AREA with tactile back button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 pb-4 border-b border-[#D6D0C4]/40">
        <div>
          <Link 
            href="/farmer-dashboard" 
            className="flex items-center gap-2 mb-2 px-3 py-1.5 rounded-full bg-[#10893E]/10 border border-[#10893E]/30 text-[#10893E] text-xs font-bold hover:bg-[#10893E]/20 hover:-translate-y-[1px] active:translate-y-[1px] transition-all whitespace-nowrap"
          >
            ← Dashboard
          </Link>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#0A2F1D]">
            Create New Listing
          </h1>
          <p className="text-base text-[#2D503C] font-semibold mt-1 max-w-2xl leading-relaxed">
            Fill in the details about your harvest. Once submitted, it will become visible to all active KrishiSetu buyers and on the marketplace.
          </p>
        </div>
      </div>

      {/* MAIN CONTENT Bento Grid wrapper */}
      <form className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Main Form Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section 1: Basic Info */}
          <ChunkyCard>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">📝</span>
              <h2 className="text-xl font-bold text-[#0A2F1D]">Basic Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-[#0A2F1D] mb-2 pl-1">Crop Type & Variety</label>
                {/* FIX APPLIED HERE: Added defaultValue="" to the select tag */}
                <motion.select
                  whileFocus={{ scale: 1.01, borderColor: "#10893E" }}
                  transition={{ duration: 0.15 }}
                  className="w-full px-5 py-4 bg-[#FDF8EE] rounded-xl border-2 border-[#D6D0C4] text-[#0A2F1D] text-base font-medium placeholder-[#8A9A90] focus:outline-none focus:ring-1 focus:ring-[#10893E] focus:border-b-[4px] transition-all duration-150 shadow-inner appearance-none custom-select"
                  required
                  defaultValue=""
                >
                  {/* FIX APPLIED HERE: Removed 'selected' from this option */}
                  <option value="" disabled>Select Crop Type</option>
                  {CROP_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.icon} {option.label}
                    </option>
                  ))}
                </motion.select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-[#0A2F1D] mb-2 pl-1">Grade / Quality</label>
                <ChunkyInput placeholder="e.g. Grade A, Superfine" required />
              </div>
            </div>
          </ChunkyCard>

          {/* Section 2: Quantity & Price */}
          <ChunkyCard>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">⚖️</span>
              <h2 className="text-xl font-bold text-[#0A2F1D]">Quantity & Pricing</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-sm font-bold text-[#0A2F1D] mb-2 pl-1">Available Quantity</label>
                <ChunkyInput type="number" placeholder="50" required className="pr-20" />
                <span className="absolute right-5 top-[52px] text-sm font-bold text-[#10893E]">Quintals</span>
              </div>
              
              <div className="relative">
                <label className="block text-sm font-bold text-[#0A2F1D] mb-2 pl-1">Expected Price (Optional)</label>
                <ChunkyInput type="number" placeholder="2,210" className="pl-12" />
                <span className="absolute left-5 top-[52px] text-sm font-bold text-[#10893E]">₹</span>
                <span className="absolute right-5 top-[52px] text-xs font-bold text-[#10893E]/60">per/q</span>
              </div>
            </div>
            <p className="text-xs text-[#2D503C]/70 font-bold mt-4 pl-1 flex items-center gap-1.5">
              💡 Leaving the price empty allows buyers to send their best bids.
            </p>
          </ChunkyCard>

          {/* Section 3: Details & Notes */}
          <ChunkyCard>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">🗒️</span>
              <h2 className="text-xl font-bold text-[#0A2F1D]">Harvest Details & Notes</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-bold text-[#0A2F1D] mb-2 pl-1">Harvest Date</label>
                <motion.input 
                  type="date"
                  whileFocus={{ scale: 1.01, borderColor: "#10893E" }}
                  transition={{ duration: 0.15 }}
                  className="w-full px-5 py-4 bg-[#FDF8EE] rounded-xl border-2 border-[#D6D0C4] text-[#0A2F1D] text-base font-medium placeholder-[#8A9A90] focus:outline-none focus:ring-1 focus:ring-[#10893E] focus:border-b-[4px] transition-all duration-150 shadow-inner"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-[#0A2F1D] mb-2 pl-1">Current Stored Location</label>
                <ChunkyInput placeholder="e.g. Village Godown / Mandi" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0A2F1D] mb-2 pl-1">Additional Description</label>
              <motion.textarea 
                rows={4}
                placeholder="e.g. Organic, stored with care, ready for pickup. Contact for quality check."
                whileFocus={{ scale: 1.01, borderColor: "#10893E" }}
                transition={{ duration: 0.15 }}
                className="w-full px-5 py-4 bg-[#FDF8EE] rounded-xl border-2 border-[#D6D0C4] text-[#0A2F1D] text-base font-medium placeholder-[#8A9A90] focus:outline-none focus:ring-1 focus:ring-[#10893E] focus:border-b-[4px] transition-all duration-150 shadow-inner resize-none"
              />
            </div>
          </ChunkyCard>
        </div>

        {/* RIGHT COLUMN: Image Upload & Submission */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Section 4: Harvest Images */}
          <ChunkyCard>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">📸</span>
              <h2 className="text-xl font-bold text-[#0A2F1D]">Harvest Images</h2>
            </div>
            
            <div className="space-y-4">
              {/* Primary Image Preview Area with Dotted Border */}
              <motion.div 
                onClick={() => fileInputRef.current?.click()}
                whileHover={{ y: -2 }}
                className="relative flex items-center justify-center w-full h-56 rounded-xl border-4 border-dashed border-[#D6D0C4] bg-[#FDF8EE] hover:border-[#10893E]/40 hover:bg-[#10893E]/5 cursor-pointer transition-all overflow-hidden shadow-inner group"
              >
                {selectedImage ? (
                  <img src={selectedImage} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <div className="text-center p-6 text-[#2D503C]">
                    <span className="text-6xl group-hover:scale-110 transition-transform inline-block">➕</span>
                    <p className="font-black text-lg mt-3 group-hover:text-[#10893E]">Add Cover Image</p>
                    <p className="text-xs font-bold opacity-60 mt-1">PNG, JPG up to 10MB</p>
                  </div>
                )}
                {/* Hidden File Input */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </motion.div>
              
              {/* Thumbnail Gallery (static placeholders for UI) */}
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <button 
                    key={i} 
                    type="button"
                    className="aspect-square flex items-center justify-center rounded-lg bg-white border-2 border-[#D6D0C4] text-[#D6D0C4] hover:text-[#10893E] hover:border-[#10893E]/40 hover:scale-105 transition-all text-xl"
                  >
                    ➕
                  </button>
                ))}
              </div>
            </div>
          </ChunkyCard>

          {/* Section 5: SUBMIT BLOCK */}
          <div className="lg:sticky lg:top-28">
            <ChunkyCard className="bg-[#10893E]/10 border-[#10893E]/30 shadow-[0_12px_30px_rgba(16,137,62,0.1)]">
              <p className="text-xs text-[#10893E] font-black uppercase tracking-wider mb-2">Review & Publish</p>
              <h3 className="text-base text-[#2D503C] font-semibold mb-6 leading-relaxed">By publishing, you confirm that the harvest is your own and the details provided are accurate.</h3>

              {/* THE CHUNKY 3D GOLD BLOCK SUBMIT BUTTON */}
              <Link href="/farmer-dashboard">
                <motion.button 
                  type="button" // Changed from submit to button to prevent form default behaviour inside a Next Link
                  whileHover={{ scale: 1.02, translateY: "-4px" }}
                  whileTap={{ scale: 0.98, translateY: "4px" }}
                  className="w-full group relative overflow-hidden px-8 py-5 bg-[#FBC02D] text-[#0A2F1D] text-lg md:text-xl font-black rounded-2xl border-2 border-[#D4A017] border-b-[8px] hover:bg-[#FCD14D] hover:shadow-[0_4px_0_0_#D4A017,0_20px_40px_rgba(251,192,45,0.4)] active:border-b-2 active:shadow-none active:bg-[#D4A017] transition-all duration-200 shadow-[0_12px_24px_rgba(251,192,45,0.3)]"
                >
                  {/* Glass Shine Effect */}
                  <span className="absolute inset-0 w-full h-full -translate-x-[150%] skew-x-[-25deg] bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:translate-x-[150%] transition-transform duration-1000 ease-out z-0"></span>
                  
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Publish My Harvest
                    <span className="text-lg leading-none transform group-hover:rotate-12 group-hover:scale-125 transition-transform duration-300">🌾✨</span>
                  </span>
                </motion.button>
              </Link>
              
              <p className="text-center font-bold text-[#2D503C]/80 mt-6 text-sm">
                or{' '}
                <Link href="/farmer-dashboard" className="text-[#10893E] font-extrabold hover:text-[#D4A017] hover:underline transition-colors decoration-2 underline-offset-4">
                  Discard Changes
                </Link>
              </p>
            </ChunkyCard>
          </div>
        </div>

      </form>
    </motion.main>
  );
}