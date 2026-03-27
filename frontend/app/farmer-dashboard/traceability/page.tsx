"use client";

import React, { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Search, MapPin, Clock, ShieldCheck, PackageSearch, Truck, Store, ArrowRight, Leaf } from "lucide-react";

// --- POV-DRIVEN MOCK DATA ---
const traceData = [
  { 
    id: 1, 
    stage: "Harvest & Origin", 
    location: "KisanSense Co-op, Ludhiana", 
    date: "Oct 12, 08:00 AM", 
    details: "Crop logged by Farmer Balwinder S. Organic farming methods and soil quality verified on-chain.", 
    status: "Verified Origin", 
    active: true, 
    icon: Leaf 
  },
  { 
    id: 2, 
    stage: "Quality Assurance", 
    location: "Facility Alpha, Khanna", 
    date: "Oct 14, 02:30 PM", 
    details: "Moisture content tested at 11%. Graded as Premium A-Class. Securely packaged and sealed.", 
    status: "QA Passed", 
    active: true, 
    icon: ShieldCheck 
  },
  { 
    id: 3, 
    stage: "Secure Transit", 
    location: "KrishiSetu Freight Fleet", 
    date: "Oct 18, 11:15 AM", 
    details: "Loaded onto transport tracking. Temperature maintained at optimal levels.", 
    status: "In Transit", 
    active: true, 
    icon: Truck 
  },
  { 
    id: 4, 
    stage: "Regional Hub", 
    location: "Central Distribution, Jalandhar", 
    date: "Oct 22, 09:00 AM", 
    details: "Arrived at sorting facility. Shipment split for local retailer dispatch.", 
    status: "Sorting", 
    active: false, 
    icon: MapPin 
  },
  { 
    id: 5, 
    stage: "Retail Market", 
    location: "Destination Mandi", 
    date: "Pending", 
    details: "Awaiting final scan by the buyer/consumer to complete the traceability loop.", 
    status: "Awaiting", 
    active: false, 
    icon: Store 
  }
];

// --- 3D INTERACTIVE CARD COMPONENT ---
const TraceCard = ({ item, index }: { item: any; index: number }) => {
  const isEven = index % 2 === 0;
  
  // Framer Motion Hooks for 3D Math
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Springs for smooth snap-back and movement
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  // Subtle rotation values (max 8 degrees to keep it looking professional)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className={`relative flex flex-col md:flex-row items-center w-full mb-16 ${isEven ? 'md:flex-row-reverse' : ''}`}
    >
      {/* Center Animated Node */}
      <div className={`absolute left-6 md:left-1/2 w-12 h-12 rounded-full border-4 border-[#FDFBF7] shadow-md transform -translate-x-1/2 flex items-center justify-center z-10 transition-all duration-500 ${item.active ? 'bg-green-700 shadow-[0_0_15px_rgba(21,128,61,0.5)]' : 'bg-slate-200'}`}>
        <Icon className={`w-5 h-5 ${item.active ? 'text-yellow-400' : 'text-slate-400'}`} />
      </div>

      <div className="hidden md:block w-1/2 px-10" />

      {/* 3D Wrapper */}
      <div className="w-full pl-20 md:pl-0 md:w-1/2 md:px-10 perspective-[1000px]">
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative w-full cursor-pointer group"
        >
          {/* Card Body */}
          <div className={`bg-white p-6 md:p-8 rounded-2xl shadow-lg border transition-all duration-300 ${item.active ? 'border-green-600/30 group-hover:border-green-500 group-hover:shadow-green-900/10' : 'border-slate-100'}`}>
            
            {/* 3D Popped-out Content */}
            <div style={{ transform: "translateZ(30px)" }} className="relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h3 className="text-xl font-extrabold text-green-950">{item.stage}</h3>
                <span className={`px-3 py-1.5 text-xs font-bold rounded-full shadow-sm ${
                  item.active 
                    ? 'bg-yellow-400 text-yellow-950' 
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {item.status}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-green-800/70 mb-5 font-semibold">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-green-600" />
                  {item.location}
                </div>
                <div className="hidden sm:block text-slate-300">•</div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-green-600" />
                  {item.date}
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed text-sm border-t border-slate-100 pt-4">
                {item.details}
              </p>
            </div>
            
            {/* Subtle Background Icon (Moves slightly in 3D space too) */}
            <div style={{ transform: "translateZ(10px)" }} className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none">
              <Icon className="w-40 h-40 text-green-900" />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// --- MAIN PAGE ---
export default function TraceabilityPage() {
  const [searchId, setSearchId] = useState("");

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 py-20 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden">
      
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-800 font-semibold text-sm mb-6 border border-green-200 shadow-sm">
            <ShieldCheck className="w-4 h-4" /> Smart Contract Verified
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-green-950 mb-6 tracking-tight">
            Transparent Supply Chain
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Verify the origin, quality, and transit history of your agricultural products. Enter a tracking ID below.
          </p>
        </motion.div>

        {/* 3D Interactive Search Bar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative max-w-2xl mx-auto perspective-[1000px]"
        >
          <motion.div 
            whileHover={{ scale: 1.02, rotateX: 2, rotateY: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex shadow-2xl rounded-full bg-white p-2.5 border border-slate-200 transition-all z-20 relative"
          >
            <div className="flex items-center pl-5 pr-3">
              <Search className="text-green-700 w-6 h-6" />
            </div>
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter ID (e.g., TRK-9942)"
              className="w-full bg-transparent text-green-950 px-2 py-4 outline-none placeholder-slate-400 font-bold text-lg"
            />
            <button className="bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold px-8 py-4 rounded-full flex items-center gap-2 transition-colors shadow-md">
              Track <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Timeline Layout */}
      <div className="max-w-5xl mx-auto relative pt-10">
        
        {/* Animated Central Connecting Line */}
        <motion.div 
          initial={{ height: 0 }}
          animate={{ height: "100%" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-green-600 via-green-400 to-slate-200 transform md:-translate-x-1/2 rounded-full shadow-[0_0_10px_rgba(21,128,61,0.3)] z-0" 
        />

        <div className="relative z-10">
          {traceData.map((item, index) => (
            <TraceCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}