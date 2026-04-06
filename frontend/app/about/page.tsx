"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { motion, useScroll, useTransform } from "framer-motion";
import { Mic, TrendingUp, Brain, CloudSun, ShieldCheck, Handshake, Network, LayoutTemplate, Database, Cog, LineChart, Globe, MessageSquare } from "lucide-react";

export default function AboutPage() {
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

  return (
    <main className="min-h-screen bg-[#FDF8EE] font-sans overflow-hidden">
      <Navbar />

      <section className="relative pt-32 pb-16 px-4 max-w-7xl mx-auto flex flex-col items-center text-center z-10">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="max-w-4xl">
          <span className="inline-block py-1 px-3 rounded-full bg-[#FFF9E6] text-[#D49800] border border-[#FBC02D]/40 font-bold text-xs md:text-sm tracking-wider uppercase mb-4 shadow-sm">
            Built by Team 404
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-[#0A2F1D] leading-tight mb-4 tracking-tight">
            Bridging the gap between <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10893E] to-[#FBC02D]">farmers</span> and <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10893E] to-[#FBC02D]">technology.</span>
          </h1>
        </motion.div>
      </section>

      {/* APPROACH GRID */}
      <section className="py-16 bg-white relative z-10 border-y border-[#E2DFD3]/50 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <h2 className="text-2xl md:text-3xl font-black text-[#0A2F1D] mb-4">The Problem We Solve</h2>
            <p className="text-[#2D503C] text-sm md:text-base font-medium mb-6">Agriculture is unpredictable, and millions lack access to real-time information.</p>
            <ul className="space-y-3">
              {["Lack of access to real-time mandi prices.", "Difficulty predicting future price trends.", "Digital literacy and language barriers."].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-[#FFF8F8] border border-red-100 text-sm md:text-base font-bold text-[#0A2F1D]">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center">!</span> {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <h2 className="text-2xl md:text-3xl font-black text-[#0A2F1D] mb-4">Our Approach</h2>
            {/* THIS IS NOW grid-cols-2 ON MOBILE */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {[
                { icon: <TrendingUp className="w-5 h-5"/>, title: "Best Mandi" },
                { icon: <CloudSun className="w-5 h-5"/>, title: "Weather Impact" },
                { icon: <ShieldCheck className="w-5 h-5"/>, title: "Sell or Wait" },
                { icon: <Handshake className="w-5 h-5"/>, title: "Direct Market" },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#F5F9F5] border border-[#10893E]/20 flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-lg bg-[#10893E]/10 text-[#10893E] flex items-center justify-center mb-2">{item.icon}</div>
                  <h3 className="font-black text-[#0A2F1D] text-sm md:text-base">{item.title}</h3>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      {/* TECH OVERVIEW */}
      <section className="py-16 bg-white border-t border-[#E2DFD3] px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-black text-[#0A2F1D] mb-8">Technology Overview</h2>
          {/* CHANGED TO grid-cols-2 on mobile */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {[
              { icon: <LayoutTemplate />, label: "Frontend" }, { icon: <Cog />, label: "Backend" },
              { icon: <Database />, label: "Database" }, { icon: <LineChart />, label: "ML Models" },
              { icon: <Globe />, label: "External APIs" }, { icon: <MessageSquare />, label: "AI Layer" }
            ].map((tech, idx) => (
              <div key={idx} className="flex flex-col items-center p-4 bg-[#FDF8EE] rounded-xl border border-[#E2DFD3]">
                <div className="text-[#10893E] mb-2 bg-white p-2 rounded-lg shadow-sm border border-[#10893E]/20">{tech.icon}</div>
                <h4 className="font-black text-[#0A2F1D] text-xs md:text-sm">{tech.label}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UNIQUE & IMPACT SECTION */}
      <section className="py-16 bg-[#10893E] text-white rounded-t-[2rem] px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-[#FBC02D] mb-4">Our Deep Impact</h2>
            <p className="text-sm md:text-base text-emerald-100 font-medium mb-6">KrishiSetu fundamentally changes how farmers manage their livelihood.</p>
            
            {/* CHANGED TO grid-cols-2 on mobile */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {[
                "Make informed selling decisions.",
                "Maximize profit margins effectively.",
                "Reduce dependency on intermediaries.",
                "Access tech in local languages."
              ].map((impact, idx) => (
                <div key={idx} className="bg-[#0A2F1D]/40 p-4 rounded-xl border border-[#0A2F1D]/50 flex flex-col justify-center">
                  <span className="text-[#FBC02D] text-xl font-black mb-1">{idx + 1}.</span>
                  <span className="font-bold text-[10px] md:text-sm leading-snug">{impact}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}