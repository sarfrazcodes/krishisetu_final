"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  Mic, TrendingUp, Users, Brain, Globe, 
  CloudSun, ShieldCheck, Zap, Handshake, Network, LayoutTemplate, Database, Cog, LineChart, MessageSquare 
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function AboutPage() {
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <main className="min-h-screen bg-[#FDF8EE] selection:bg-[#FBC02D] selection:text-[#0A2F1D] font-sans overflow-hidden">
      <Navbar />

      {/* Global Styles for Fonts */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700;9..144,900&family=Manrope:wght@500;700;800&display=swap');
        .heading-serif { font-family: 'Fraunces', serif; }
      `}} />

      {/* HERO SECTION */}
      <section className="relative pt-40 pb-20 px-4 md:px-8 max-w-7xl mx-auto flex flex-col items-center text-center z-10">
        <motion.div style={{ y: yBg }} className="absolute inset-0 pointer-events-none -z-10 flex justify-center items-center">
          <div className="w-[600px] h-[600px] bg-[#10893E] rounded-full mix-blend-multiply opacity-5 filter blur-[100px]"></div>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="max-w-4xl">
          <span className="inline-block py-1.5 px-4 rounded-full bg-[#FFF9E6] text-[#D49800] border border-[#FBC02D]/40 font-bold text-sm tracking-wider uppercase mb-6 shadow-sm">
            Built by Team 404
          </span>
          <h1 className="heading-serif text-5xl md:text-7xl font-black text-[#0A2F1D] leading-[1.1] mb-6 tracking-tight">
            Bridging the gap between <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10893E] to-[#FBC02D]">farmers</span> and <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10893E] to-[#FBC02D]">technology.</span>
          </h1>
          <p className="text-lg md:text-xl text-[#2D503C] font-medium leading-relaxed max-w-2xl mx-auto mb-10">
            KrishiSetu is a voice-first agriculture intelligence platform designed to help farmers make smarter selling decisions using real-time insights.
          </p>
        </motion.div>
      </section>

      {/* THE PROBLEM & OUR APPROACH */}
      <section className="py-20 bg-white relative z-10 border-y border-[#E2DFD3]/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* The Problem */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
              <h2 className="heading-serif text-3xl md:text-4xl font-black text-[#0A2F1D] mb-6">The Problem We Solve</h2>
              <p className="text-[#2D503C] text-lg font-medium mb-8 leading-relaxed">
                Agriculture is unpredictable, and millions of farmers struggle to get fair prices because they lack access to the right information at the right time.
              </p>
              
              <ul className="space-y-4">
                {[
                  "Lack of access to real-time mandi prices.",
                  "Difficulty in predicting future price trends.",
                  "Vulnerability to sudden weather changes.",
                  "Digital literacy and language barriers preventing tech adoption."
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-[#FFF8F8] border border-red-100">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-black mt-0.5">!</span>
                    <span className="text-[#0A2F1D] font-bold text-base md:text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* The Approach */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
              <h2 className="heading-serif text-3xl md:text-4xl font-black text-[#0A2F1D] mb-6">Our Approach</h2>
              <p className="text-[#2D503C] text-lg font-medium mb-8 leading-relaxed">
                We designed KrishiSetu to transform raw data into simple, actionable decisions. We don't just show charts; we give clear advice.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: <TrendingUp />, title: "Best Mandi", desc: "Automatically identifies the most profitable nearby mandi." },
                  { icon: <CloudSun />, title: "Weather Impact", desc: "Analyzes weather conditions to mitigate crop risks." },
                  { icon: <ShieldCheck />, title: "Sell or Wait", desc: "Provides simple, direct advice on when to sell your yield." },
                  { icon: <Handshake />, title: "Direct Market", desc: "Enables direct interaction between farmers and buyers." },
                ].map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-[#F5F9F5] border border-[#10893E]/20 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-[#10893E]/10 text-[#10893E] flex items-center justify-center mb-4">
                      {item.icon}
                    </div>
                    <h3 className="font-black text-[#0A2F1D] text-lg mb-2">{item.title}</h3>
                    <p className="text-[#4A5D4F] text-sm font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* VOICE AND ACCESSIBILITY - IMPORTANT SECTION */}
      <section className="py-24 bg-[#0A2F1D] relative z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#10893E]/30 via-transparent to-transparent pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#FBC02D] text-[#0A2F1D] mb-6 shadow-[0_0_30px_rgba(251,192,45,0.3)]">
              <Mic size={32} />
            </div>
            <h2 className="heading-serif text-4xl md:text-6xl font-black text-[#FDF8EE] mb-6">Voice & Accessibility</h2>
            <p className="text-[#CDE0C3] text-xl font-medium leading-relaxed">
              KrishiSetu is built for real farmers, not just tech users. We believe that technology should adapt to the user, not the other way around.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { title: "Voice Navigation", desc: "Fully voice-enabled system. Navigate and command the platform entirely hands-free." },
              { title: "Multilingual Support", desc: "Farmers can speak and listen in Hindi, Punjabi, or English seamlessly." },
              { title: "On-Demand Explanations", desc: "Users can ask the system to explain any page or chart in their native language." },
              { title: "Simplified Responses", desc: "The system translates complex market data into natural, conversational advice." }
            ].map((item, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[2rem] hover:bg-white/10 transition-colors">
                <h3 className="text-[#FBC02D] font-black text-xl mb-3">{item.title}</h3>
                <p className="text-[#FDF8EE]/80 font-medium leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* INTELLIGENCE LAYER & MARKETPLACE */}
      <section className="py-24 bg-[#F5F0E1] relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-[#FBC02D] rounded-[3rem] transform rotate-3 scale-105 opacity-20"></div>
              <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-[#E2DFD3] relative z-10 shadow-xl">
                <div className="w-14 h-14 bg-[#FFF9E6] text-[#D49800] rounded-2xl flex items-center justify-center mb-6 border border-[#FBC02D]/30"><Brain size={28} /></div>
                <h3 className="heading-serif text-3xl font-black text-[#0A2F1D] mb-4">Intelligence Layer</h3>
                <p className="text-[#2D503C] font-medium text-lg mb-6 leading-relaxed">
                  Our system uses multiple machine learning models trained on decades of historical mandi data to forecast market movements.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3"><Zap className="text-[#10893E] mt-1 shrink-0" size={20} /><span className="text-[#2D503C] font-bold">A general model handles highly volatile or less common crops.</span></li>
                  <li className="flex items-start gap-3"><Zap className="text-[#10893E] mt-1 shrink-0" size={20} /><span className="text-[#2D503C] font-bold">Specialized models significantly improve accuracy for key staples like wheat and rice.</span></li>
                  <li className="flex items-start gap-3"><ShieldCheck className="text-[#10893E] mt-1 shrink-0" size={20} /><span className="text-[#2D503C] font-bold">If a prediction fails due to lack of local data, an AI fallback system ensures advice is always available.</span></li>
                </ul>
              </div>
            </motion.div>
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="order-1 lg:order-2">
              <h2 className="heading-serif text-4xl md:text-5xl font-black text-[#0A2F1D] mb-6">More Than Just Predictions</h2>
              <p className="text-[#2D503C] text-lg font-medium leading-relaxed mb-6">
                While AI powers the core of KrishiSetu, our integrated marketplace ensures that farmers can immediately act on the Intelligence they receive.
              </p>
              <div className="bg-[#10893E] text-white p-6 rounded-2xl shadow-lg border-b-4 border-[#0A2F1D]/50">
                <h4 className="font-black text-xl mb-2 flex items-center gap-2"><Network /> Marketplace Integration</h4>
                <p className="text-emerald-100 font-medium text-sm leading-relaxed">
                  Farmers can instantly add crop listings based on AI advice, while verified buyers can post specific crop requirements. This direct interaction slashes dependency on middlemen and increases profit margins by up to 20%.
                </p>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* TECH OVERVIEW */}
      <section className="py-20 bg-white border-t border-[#E2DFD3]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="heading-serif text-3xl md:text-4xl font-black text-[#0A2F1D] mb-12">
            Technology Overview
          </motion.h2>

          <motion.div 
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {[
              { icon: <LayoutTemplate />, label: "Frontend", desc: "Modern web interface" },
              { icon: <Cog />, label: "Backend", desc: "Scalable API system" },
              { icon: <Database />, label: "Database", desc: "Structured ag-data" },
              { icon: <LineChart />, label: "ML Models", desc: "Price prediction" },
              { icon: <Globe />, label: "External APIs", desc: "Mandi & Weather" },
              { icon: <MessageSquare />, label: "AI Layer", desc: "Voice & fallback" }
            ].map((tech, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="flex flex-col items-center p-6 bg-[#FDF8EE] rounded-2xl border border-[#E2DFD3]">
                <div className="text-[#10893E] mb-3 bg-white p-3 rounded-xl shadow-sm border border-[#10893E]/20">{tech.icon}</div>
                <h4 className="font-black text-[#0A2F1D] text-sm md:text-base mb-1">{tech.label}</h4>
                <p className="text-xs text-[#627768] font-medium">{tech.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* UNIQUE & IMPACT SECTION */}
      <section className="py-24 bg-[#10893E] relative z-10 text-white overflow-hidden rounded-t-[3rem] shadow-[0_-20px_40px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <h2 className="heading-serif text-4xl font-black text-[#FBC02D] mb-6">What Makes Us Unique?</h2>
              <ul className="space-y-4">
                {[
                  "Decision-focused design, not just visual data dumps.",
                  "A true voice-first experience accessible for low-literacy users.",
                  "Robust multilingual accessibility out of the box.",
                  "Deep integration of ML forecasts, live weather, and market data.",
                  "Highly reliable system with intelligent AI fallback logic."
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                    <span className="text-[#FBC02D] font-black mt-0.5">✓</span>
                    <span className="font-bold text-base md:text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <h2 className="heading-serif text-4xl font-black text-[#FBC02D] mb-6">Our Deep Impact</h2>
              <p className="text-lg text-emerald-100 font-medium mb-8 leading-relaxed">
                By making complex market data accessible and understandable, KrishiSetu fundamentally changes how farmers manage their livelihood.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  "Make highly informed selling decisions.",
                  "Maximize profit margins effectively.",
                  "Reduce the strong dependency on aggressive intermediaries.",
                  "Access state-of-the-art technology completely in their own language."
                ].map((impact, idx) => (
                  <div key={idx} className="bg-[#0A2F1D]/40 p-5 rounded-2xl border border-[#0A2F1D]/50 flex flex-col justify-center">
                    <span className="text-[#FBC02D] text-2xl font-black mb-2">{idx + 1}.</span>
                    <span className="font-bold text-sm md:text-base leading-snug">{impact}</span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

    </main>
  );
}
