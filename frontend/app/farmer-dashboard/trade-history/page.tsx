"use client";

import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Search, MapPin, Clock, ShieldCheck, Truck, Store, ArrowRight, ArrowLeft, Leaf, History, CheckCircle2 } from "lucide-react";

const traceData = [
  { id: 1, stage: "Harvest & Origin", location: "Ludhiana", date: "Mar 20", details: "Organic methods verified.", status: "Verified", active: true, icon: Leaf },
  { id: 2, stage: "Quality Audit", location: "KrishiSetu", date: "Mar 21", details: "Moisture 11%. Premium A-Class.", status: "Passed", active: true, icon: ShieldCheck },
  { id: 3, stage: "In Transit", location: "Freight Fleet", date: "Mar 22", details: "Temp maintained optimally.", status: "Moving", active: true, icon: Truck },
  { id: 4, stage: "Received", location: "Punjab Agro", date: "Pending", details: "Awaiting final scan.", status: "Awaiting", active: false, icon: Store }
];

const TraceCard = ({ item, index }: { item: any; index: number }) => {
  const isEven = index % 2 === 0;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };
  const Icon = item.icon;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} className={`relative flex flex-col md:flex-row items-center w-full mb-8 md:mb-16 ${isEven ? 'md:flex-row-reverse' : ''}`}>
      {/* Icon - Left aligned on mobile, Center on desktop */}
      <div className={`absolute left-6 md:left-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full border-[3px] md:border-4 border-[#FDFBF7] shadow-md transform -translate-x-1/2 flex items-center justify-center z-10 ${item.active ? 'bg-[#10893E]' : 'bg-slate-200'}`}>
        <Icon className={`w-4 h-4 md:w-5 md:h-5 ${item.active ? 'text-[#FBC02D]' : 'text-slate-400'}`} />
      </div>
      
      <div className="hidden md:block w-1/2 px-10" />
      
      {/* Card - Pad left on mobile to clear the icon */}
      <div className="w-full pl-16 md:pl-0 md:w-1/2 md:px-10 perspective-[1000px]">
        <motion.div onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="relative w-full group">
          <div className={`bg-white border p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm transition-all duration-300 ${item.active ? 'border-[#10893E]/30' : 'border-slate-200'}`}>
            <div style={{ transform: "translateZ(10px)" }}>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2 md:mb-4">
                <h3 className="text-base md:text-xl font-black text-[#0A2F1D]">{item.stage}</h3>
                <span className={`px-2 py-1 text-[8px] md:text-[10px] uppercase font-black rounded-md ${item.active ? 'bg-[#FBC02D] text-[#0A2F1D]' : 'bg-slate-100 text-slate-500'}`}>{item.status}</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 text-[10px] md:text-xs text-[#10893E] mb-3 font-bold">
                <div className="flex items-center gap-1"><MapPin className="w-3 h-3 md:w-4 md:h-4" />{item.location}</div>
                <div className="flex items-center gap-1"><Clock className="w-3 h-3 md:w-4 md:h-4" />{item.date}</div>
              </div>
              <p className="text-[#627768] text-xs md:text-sm font-medium border-t border-slate-100 pt-2 md:pt-3">{item.details}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function TradeHistoryPage() {
  const [mounted, setMounted] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [activeTimeline, setActiveTimeline] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="min-h-screen p-4 md:p-8 relative z-10 w-full animate-fade-in pb-24 overflow-x-hidden">
      <header className="mb-6 md:mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0A2F1D] mb-1 flex items-center gap-2">
          <History className="w-6 h-6 md:w-8 md:h-8 text-[#10893E]" /> Trade History
        </h1>
        <p className="text-[#627768] font-medium text-sm md:text-base">Verify the origin and transit history of your deals.</p>
      </header>

      <div className="flex flex-col sm:flex-row shadow-sm rounded-xl md:rounded-2xl bg-white border border-slate-200 p-1.5 md:p-2 z-20 relative max-w-2xl mb-8 md:mb-12">
        <div className="flex items-center pl-2 md:pl-4 pr-2 py-2 sm:py-0"><Search className="text-[#10893E] w-4 h-4 md:w-5 md:h-5" /></div>
        <input type="text" value={searchId} onChange={(e) => setSearchId(e.target.value)} placeholder="Order ID (e.g. ORD-8821)" className="w-full bg-transparent text-[#0A2F1D] px-2 py-2 outline-none font-bold text-sm md:text-base" />
        <button onClick={() => setActiveTimeline(searchId || "ORD-8821")} className="bg-[#10893E] text-white font-bold px-4 md:px-6 py-2.5 rounded-lg md:rounded-xl flex items-center justify-center gap-2 mt-2 sm:mt-0 text-sm md:text-base w-full sm:w-auto">
          Track <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {!activeTimeline ? (
        <div className="space-y-4 max-w-4xl">
          <h2 className="text-lg md:text-xl font-black text-[#0A2F1D] mb-4">Completed Trades</h2>
          <div className="bg-white border border-[#E2DFD3] shadow-sm p-4 md:p-6 rounded-2xl md:rounded-[2rem] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-[#10893E]" />
              </div>
              <div>
                <h3 className="font-black text-base md:text-lg text-[#0A2F1D] flex items-center gap-1">ORD-8821 <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-[#10893E]" /></h3>
                <p className="text-[10px] md:text-xs font-bold text-[#627768]">Wheat (Lok-1) • Mar 20, 2026</p>
              </div>
            </div>
            <div className="flex justify-between w-full md:w-auto gap-4 border-t border-slate-100 md:border-none pt-3 md:pt-0">
              <div className="text-left md:text-right">
                <p className="text-[10px] font-bold text-[#8A9A90] uppercase mb-0.5">Status</p>
                <p className="text-sm md:text-lg font-black text-[#10893E]">Completed</p>
              </div>
            </div>
            <button onClick={() => setActiveTimeline("ORD-8821")} className="w-full md:w-auto py-2 px-4 bg-slate-50 border border-slate-200 text-[#0A2F1D] rounded-lg font-bold text-xs md:text-sm hover:bg-slate-100">View Ledger</button>
          </div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto relative pt-4 md:pt-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-[#0A2F1D]">Receipt: {activeTimeline}</h2>
              <p className="text-[#10893E] font-bold text-[10px] md:text-xs uppercase mt-1">Smart Contract Settled</p>
            </div>
            <button onClick={() => setActiveTimeline(null)} className="text-xs md:text-sm font-bold text-[#627768] bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1">
              <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" /> Close
            </button>
          </div>
          
          {/* Timeline Line - Left aligned on mobile, Center on desktop */}
          <motion.div initial={{ height: 0 }} animate={{ height: "100%" }} transition={{ duration: 1 }} className="absolute left-6 md:left-1/2 top-24 md:top-32 bottom-0 w-[2px] md:w-1 bg-[#10893E]/30 transform md:-translate-x-1/2 z-0" />
          
          <div className="relative z-10 pt-2">
            {traceData.map((item, index) => <TraceCard key={item.id} item={item} index={index} />)}
          </div>
        </div>
      )}
    </div>
  );
}