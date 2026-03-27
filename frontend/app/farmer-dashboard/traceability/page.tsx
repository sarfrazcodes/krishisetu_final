"use client";

import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Search, MapPin, Clock, ShieldCheck, Truck, Store, ArrowRight, ArrowLeft, Leaf, History, CheckCircle2 } from "lucide-react";

// --- POV-DRIVEN MOCK DATA FOR TIMELINE ---
const traceData = [
  { 
    id: 1, stage: "Harvest & Origin", location: "Your Farm, Ludhiana", date: "Mar 20, 08:00 AM", 
    details: "Crop logged by you. Organic farming methods and soil quality verified on-chain.", status: "Verified Origin", active: true, icon: Leaf 
  },
  { 
    id: 2, stage: "Quality Assurance", location: "KrishiSetu Audit", date: "Mar 21, 02:30 PM", 
    details: "Moisture content tested at 11%. Graded as Premium A-Class. Securely packaged and sealed.", status: "QA Passed", active: true, icon: ShieldCheck 
  },
  { 
    id: 3, stage: "Secure Transit", location: "KrishiSetu Freight Fleet", date: "Mar 22, 11:15 AM", 
    details: "Loaded onto transport tracking. Temperature maintained at optimal levels.", status: "In Transit", active: true, icon: Truck 
  },
  { 
    id: 4, stage: "Buyer Received", location: "Punjab Agro Facility", date: "Pending", 
    details: "Awaiting final scan by the buyer to release escrow payment.", status: "Awaiting", active: false, icon: Store 
  }
];

// --- 3D INTERACTIVE CARD COMPONENT (Your exact code) ---
const TraceCard = ({ item, index }: { item: any; index: number }) => {
  const isEven = index % 2 === 0;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };
  const Icon = item.icon;

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.15 }} className={`relative flex flex-col md:flex-row items-center w-full mb-16 ${isEven ? 'md:flex-row-reverse' : ''}`}>
      <div className={`absolute left-6 md:left-1/2 w-12 h-12 rounded-full border-4 border-[#FDFBF7] shadow-md transform -translate-x-1/2 flex items-center justify-center z-10 transition-all duration-500 ${item.active ? 'bg-[#10893E] shadow-[0_0_15px_rgba(16,137,62,0.5)]' : 'bg-slate-200'}`}>
        <Icon className={`w-5 h-5 ${item.active ? 'text-[#FBC02D]' : 'text-slate-400'}`} />
      </div>
      <div className="hidden md:block w-1/2 px-10" />
      <div className="w-full pl-20 md:pl-0 md:w-1/2 md:px-10 perspective-[1000px]">
        <motion.div onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="relative w-full cursor-pointer group">
          <div className={`bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-lg border transition-all duration-300 ${item.active ? 'border-[#10893E]/30 group-hover:border-[#10893E] group-hover:shadow-[0_15px_30px_rgba(16,137,62,0.15)]' : 'border-white'}`}>
            <div style={{ transform: "translateZ(30px)" }} className="relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h3 className="text-xl font-black text-[#0A2F1D]">{item.stage}</h3>
                <span className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-black rounded-full shadow-sm ${item.active ? 'bg-[#FBC02D] text-[#0A2F1D]' : 'bg-slate-100 text-slate-500'}`}>
                  {item.status}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-[#10893E] mb-5 font-bold tracking-wide">
                <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{item.location}</div>
                <div className="hidden sm:block text-slate-300">•</div>
                <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{item.date}</div>
              </div>
              <p className="text-[#627768] font-medium leading-relaxed text-sm border-t border-[#0A2F1D]/10 pt-4">
                {item.details}
              </p>
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
  const [activeTimeline, setActiveTimeline] = useState<string | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTraceRecords();
  }, []);

  const fetchTraceRecords = async () => {
    try {
      const token = localStorage.getItem("token");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${API_URL}/traceability`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRecords(data);
      }
    } catch (err) {
      console.error("Failed to fetch traceability records", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 relative z-10 w-full animate-fade-in pb-24">
      
      {/* HEADER */}
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-black text-[#0A2F1D] mb-1 drop-shadow-sm flex items-center gap-3">
          <History className="w-8 h-8 text-[#10893E]" /> Trade History & Ledger
        </h1>
        <p className="text-[#627768] font-medium">Verify the origin, quality, and transit history of your completed deals.</p>
      </header>

      {/* SEARCH BAR (Your 3D implementation) */}
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="relative max-w-3xl mb-12 perspective-[1000px]">
        <motion.div whileHover={{ scale: 1.01, rotateX: 2, rotateY: -2 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="flex shadow-lg rounded-2xl bg-white/60 backdrop-blur-md p-2 border border-white/80 transition-all z-20 relative">
          <div className="flex items-center pl-4 pr-2"><Search className="text-[#10893E] w-5 h-5" /></div>
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Search by Order ID (e.g., ORD-8821)"
            className="w-full bg-transparent text-[#0A2F1D] px-2 py-3 outline-none placeholder-[#8A9A90] font-bold text-base"
          />
          <button 
            onClick={() => setActiveTimeline(searchId || "ORD-8821")}
            className="bg-[#10893E] hover:bg-[#0A2F1D] text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-colors shadow-sm"
          >
            Track <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </motion.div>

      {/* CONDITIONAL RENDER: Ledger vs Timeline */}
      {!activeTimeline ? (
        <div className="space-y-4 max-w-4xl">
          <h2 className="text-xl font-black text-[#0A2F1D] mb-4">Immutable Traceability Logs</h2>
          {isLoading ? (
            <p className="text-[#627768] font-bold">Loading secure ledger items...</p>
          ) : records.length === 0 ? (
            <p className="text-[#627768] font-bold">No traceability records found.</p>
          ) : (
            records.map((trade) => (
              <div key={trade.id} className="bg-white border border-[#E2DFD3] shadow-sm p-6 rounded-[2rem] hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(10,47,29,0.08)] transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#10893E]/10 flex items-center justify-center border border-[#10893E]/20">
                    <ShieldCheck className="w-6 h-6 text-[#10893E]" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-[#0A2F1D] flex items-center gap-2">
                      {trade.id} <CheckCircle2 className="w-4 h-4 text-[#10893E]"/>
                    </h3>
                    <p className="text-sm font-bold text-[#627768]">{trade.crop} • Logged on {new Date(trade.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-left md:text-right w-full md:w-auto">
                  <p className="text-xs font-bold text-[#8A9A90] uppercase mb-1">Origin Node</p>
                  <p className="font-bold text-[#0A2F1D]">{trade.origin}</p>
                </div>
                <div className="text-left md:text-right w-full md:w-auto">
                  <p className="text-xs font-bold text-[#8A9A90] uppercase mb-1">Network Status</p>
                  <p className="text-xl font-black text-[#10893E]">Verified</p>
                </div>
                <button 
                  onClick={() => setActiveTimeline(trade.id)}
                  className="w-full md:w-auto py-3 px-6 bg-white border border-[#EBE5D9] text-[#0A2F1D] rounded-xl font-bold shadow-sm hover:bg-[#FDF8EE] transition-colors mt-2 md:mt-0"
                >
                  View Ledger
                </button>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="max-w-5xl mx-auto relative pt-10">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-2xl font-black text-[#0A2F1D]">Immutable Record: {activeTimeline}</h2>
              <p className="text-[#10893E] font-bold text-sm uppercase tracking-widest mt-1">Smart Contract Verified</p>
            </div>
            <button 
              onClick={() => setActiveTimeline(null)}
              className="text-sm font-bold text-[#627768] hover:text-[#0A2F1D] flex items-center gap-1 bg-white/50 px-4 py-2 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" /> Close Timeline
            </button>
          </div>

          {/* Animated Central Connecting Line */}
          <motion.div initial={{ height: 0 }} animate={{ height: "100%" }} transition={{ duration: 1.5, ease: "easeInOut" }} className="absolute left-6 md:left-1/2 top-28 bottom-0 w-1 bg-gradient-to-b from-[#10893E] via-[#10893E]/50 to-transparent transform md:-translate-x-1/2 rounded-full shadow-[0_0_10px_rgba(16,137,62,0.3)] z-0" />

          <div className="relative z-10">
            {traceData.map((item, index) => (
              <TraceCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
