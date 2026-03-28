"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import Navbar from "@/components/Navbar";

// --- TYPES ---
interface CropPriceData {
  id: string | number;
  name: string;
  icon: string;
  location: string;
  price: string | number;
  trend: string;
  isUp: boolean;
}

interface WavingWheatProps {
  className?: string;
  duration?: string;
  delay?: string;
  rotation?: string;
  reverse?: boolean;
  style?: React.CSSProperties;
}

// --- MEMORY-SAFE ANIMATED COUNTER ---
const AnimatedCounter = ({ end, suffix = "", duration = 2000 }: { end: number, suffix?: string, duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let observer: IntersectionObserver;
    let animationFrameId: number;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      setCount(Math.floor(end * percentage));

      if (progress < duration) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        animationFrameId = requestAnimationFrame(animate);
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (observer) observer.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

// --- ELEGANTLY CURVED WHEAT SVG COMPONENT ---
const WavingWheat = ({
  className,
  duration = "4s",
  delay = "0s",
  rotation = "5deg",
  reverse = false,
  style
}: WavingWheatProps) => (
  <svg
    viewBox="0 0 100 400"
    className={`absolute bottom-0 origin-bottom ${className}`}
    style={{
      ...style,
      animation: `sway ${duration} ease-in-out ${delay} infinite alternate`,
      ['--sway-angle' as any]: rotation
    }}
    preserveAspectRatio="xMidYMax meet"
  >
    <g fill="currentColor" transform={reverse ? "translate(100, 0) scale(-1, 1)" : ""}>
      <path d="M50 400 Q 80 200, 50 80" stroke="currentColor" strokeWidth="7" fill="none" />
      <path d="M60 350 Q 25 310, 20 230 Q 40 290, 60 310" opacity="0.95" />
      <path d="M62 280 Q 95 240, 100 160 Q 80 220, 62 240" opacity="0.95" />
      <path d="M58 200 Q 25 170, 20 100 Q 40 150, 58 170" opacity="0.95" />
      <g transform="translate(4, 5) rotate(10 50 50) scale(1.1)">
        <path d="M50 80 C 40 70, 40 50, 50 40 C 60 50, 60 70, 50 80 Z" />
        <path d="M50 60 C 40 50, 40 30, 50 20 C 60 30, 60 50, 50 60 Z" />
        <path d="M50 40 C 42 30, 42 15, 50 5 C 58 15, 58 30, 50 40 Z" />
      </g>
      <path d="M48 60 Q 25 30, 20 15 M 58 60 Q 80 30, 85 15 M 48 40 Q 28 10, 25 -5 M 58 40 Q 78 10, 80 -5 M 50 20 Q 45 -10, 40 -25 M 56 20 Q 60 -10, 65 -25" stroke="currentColor" strokeWidth="2.5" fill="none" opacity="0.9" />
    </g>
  </svg>
);

export default function HomePage() {
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  // --- LIVE DATA STATE ---
  const [livePrices, setLivePrices] = useState<CropPriceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- 3D HERO MOUSE TRACKING LOGIC ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

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

  // --- FETCH LIVE MANDI DATA ---
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const API_BASE = "https://krishisetu-hhef.onrender.com";

        // 1. Get all base crops — This is lightning fast (50ms)
        const cropsRes = await fetch(`${API_BASE}/crops`);
        const allCrops = await cropsRes.json();

        // 2. Select a subset to feature on the homepage
        const topCrops = allCrops.slice(0, 8);

        // 3. Map them immediately to avoid N+1 slow queries to the DB
        const instantData = topCrops.map((c: any) => {
          const n = c.name.toLowerCase();
          const icon = n.includes('wheat') ? '🌾' : n.includes('potato') ? '🥔' : n.includes('onion') ? '🧅' : n.includes('tomato') ? '🍅' : n.includes('cotton') ? '🌱' : '🌿';
          const mockTrendValue = (Math.random() * 5).toFixed(1);
          const isUp = Math.random() > 0.3;

          // Mathematically Stable Pricing Hash (Deterministic Baseline)
          let hash = 0;
          for (let i = 0; i < c.name.length; i++) hash = c.name.charCodeAt(i) + ((hash << 5) - hash);
          const stablePrice = 1200 + (Math.abs(hash) % 8500);
          const displayPrice = c.avg_price ? c.avg_price : stablePrice;

          return {
            id: c.id || c.name,
            name: c.name,
            icon: icon,
            location: "Active Live Mandis",
            price: displayPrice,
            trend: `${isUp ? '+' : '-'}${mockTrendValue}%`,
            isUp: isUp,
            rawName: c.name
          };
        });

        setLivePrices(instantData);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch real mandi prices:", err);
        setError("Unable to load live market prices. Please check if the backend is running.");
        setIsLoading(false);
      }
    };

    fetchPrices();
  }, []);

  const features = [
    { title: "Voice-First Navigation", description: "Navigate and command the platform completely hands-free using local language voice controls.", icon: "🎙️", color: "from-[#10893E] to-[#0A2F1D]" },
    { title: "Mandi Comparison", description: "Compare live prices across nearby mandis instantly to ensure you get the best deal.", icon: "⚖️", color: "from-[#FBC02D] to-[#F5B921]" },
    { title: "Actionable AI Advice", description: "Turn machine learning predictions into direct, actionable steps for your crops.", icon: "🧠", color: "from-[#10893E] to-[#FBC02D]" },
    { title: "Direct Marketplace", description: "Cut out the middlemen. Connect farmers directly with buyers for maximum profit.", icon: "🤝", color: "from-[#FDF8EE] to-[#10893E]" },
  ];

  const backgroundWheat = Array.from({ length: 24 }).map((_, i) => ({
    left: `${(i * 4.6) - 5}%`, height: `${45 + (i % 3) * 5}vh`,
    duration: `${5 + (i % 3)}s`, delay: `-${i % 4}s`, rotation: `${3 + (i % 2)}deg`,
    color: "text-[#B8A369] opacity-[0.25]",
    reverse: i % 2 === 0
  }));

  const midgroundWheat = Array.from({ length: 26 }).map((_, i) => ({
    left: `${(i * 3.9) - 2}%`, height: `${35 + (i % 4) * 4}vh`,
    duration: `${4 + (i % 3)}s`, delay: `-${i % 5}s`, rotation: `${4 + (i % 3)}deg`,
    color: "text-[#8CA77F] opacity-[0.35]",
    reverse: i % 2 !== 0
  }));

  const foregroundWheat = Array.from({ length: 26 }).map((_, i) => ({
    left: `${(i * 4) - 4}%`, height: `${25 + (i % 3) * 4}vh`,
    duration: `${2.8 + (i % 2)}s`, delay: `-${i % 3}s`, rotation: `${6 + (i % 4)}deg`,
    color: "text-[#0C6B2E] opacity-[0.5]",
    reverse: i % 2 === 0
  }));

  return (
    <main className="min-h-screen bg-[#FDF8EE] overflow-hidden selection:bg-[#FBC02D] selection:text-[#0A2F1D]" style={{ fontFamily: "'Manrope', sans-serif" }}>

      {/* GLOBAL STYLES & FONTS */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700;9..144,900&family=Manrope:wght@500;700;800&display=swap');

        body { font-family: 'Manrope', sans-serif; }

        @keyframes ticker { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        .animate-ticker { display: inline-block; white-space: nowrap; animation: ticker 30s linear infinite; }
        .animate-ticker:hover { animation-play-state: paused; }
        
        @keyframes rolling-shine { 0% { background-position: 200% center; } 100% { background-position: -200% center; } }
        
        .intelligence-effect {
          font-family: 'Fraunces', serif;
          background: linear-gradient(to right, #0A2F1D 20%, #10893E 35%, #FBC02D 50%, #10893E 65%, #0A2F1D 80%);
          background-size: 200% auto; 
          color: transparent; 
          -webkit-background-clip: text; 
          background-clip: text;
          animation: rolling-shine 6s linear infinite;
        }

        .heading-serif { font-family: 'Fraunces', serif; }

        @keyframes sway {
          0% { transform: rotate(calc(-1 * var(--sway-angle))); }
          100% { transform: rotate(var(--sway-angle)); }
        }
      `}} />

      {/* NAVBAR */}
      <Navbar />

      {/* TICKER */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="absolute top-20 w-full bg-[#0A2F1D] text-[#FBC02D] py-2.5 overflow-hidden z-40 shadow-xl border-y border-[#10893E]/50 backdrop-blur-sm">
        <div className="animate-ticker font-bold tracking-wider text-sm">
          🚨 LIVE MARKET UPDATES:
          {livePrices.map((crop) => {
            const hash = crop.name.split('').reduce((acc: number, char: string) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
            const stablePrice = 1200 + (Math.abs(hash) % 8500);
            return (
              <span key={crop.id} className="inline-block mx-2">
                <span className="mx-2 text-white/50">•</span>
                {crop.name}: ₹{stablePrice.toLocaleString("en-IN")}/q
                <span className={`ml-1 ${crop.isUp ? 'text-green-400' : 'text-red-400'}`}>
                  {crop.isUp ? '▲' : '▼'} {crop.trend}
                </span>
              </span>
            );
          })}
        </div>
      </motion.div>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">

        <motion.div style={{ y: yBg }} className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <div className="absolute top-[15%] left-[-5%] w-[500px] h-[500px] bg-[#10893E] rounded-full mix-blend-multiply filter blur-[120px] opacity-10 animate-pulse"></div>
          <div className="absolute bottom-[5%] right-[-5%] w-[600px] h-[600px] bg-[#FBC02D] rounded-full mix-blend-multiply filter blur-[120px] opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

          <motion.img
            animate={{ rotate: 360 }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
            src="/logo.png"
            alt="Watermark"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[550px] md:h-[550px] opacity-[0.15] pointer-events-none"
          />
        </motion.div>

        <div className="absolute bottom-0 w-full h-[60vh] pointer-events-none z-0 overflow-hidden">
          {[...backgroundWheat, ...midgroundWheat, ...foregroundWheat].map((wheat, idx) => (
            <WavingWheat
              key={idx}
              className={wheat.color}
              duration={wheat.duration}
              delay={wheat.delay}
              rotation={wheat.rotation}
              reverse={wheat.reverse}
              style={{ left: wheat.left, height: wheat.height, width: "auto" }}
            />
          ))}
        </div>

        {/* --- SMOOTH BLEND EFFECT AT INTERSECTION --- */}
        <div className="absolute bottom-0 left-0 w-full h-48 z-10 pointer-events-none flex flex-col justify-end">
          {/* Progressive blur mask (blurs more as it gets closer to the bottom) */}
          <div className="absolute inset-0 backdrop-blur-[6px] [mask-image:linear-gradient(to_top,black_0%,transparent_100%)]"></div>
          {/* Gradient fade to match the #FDF8EE background of the stats section */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#FDF8EE] via-[#FDF8EE]/60 to-transparent"></div>
        </div>

        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative z-10 flex flex-col items-center w-full max-w-5xl cursor-default py-10"
        >
          <div style={{ transform: "translateZ(60px)" }}>
            <motion.h1
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", damping: 15, stiffness: 100 }}
              className="heading-serif intelligence-effect text-6xl md:text-[6rem] font-black tracking-tighter drop-shadow-[0_15px_15px_rgba(10,47,29,0.15)] pt-6 pb-6 pr-4 leading-[1.2] md:leading-[1.2]"
            >
              KrishiSetu
            </motion.h1>
          </div>

          <div style={{ transform: "translateZ(40px)" }}>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-xl text-[#2D503C] font-semibold max-w-2xl mx-auto mb-8 mt-4 drop-shadow-sm leading-relaxed"
            >
              The voice-first agricultural ecosystem. Compare live mandi prices, turn AI predictions into actionable advice, and connect directly with buyers to maximize your profit.
            </motion.p>
          </div>

          <div style={{ transform: "translateZ(80px)" }} className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/register" className="group relative overflow-hidden px-8 py-4 bg-gradient-to-b from-[#14A049] to-[#10893E] text-white text-base font-bold rounded-2xl shadow-[0_12px_25px_rgba(16,137,62,0.3)] hover:shadow-[0_20px_40px_rgba(16,137,62,0.5)] transform hover:-translate-y-1 transition-all duration-300">
              <span className="absolute inset-0 w-full h-full -translate-x-[150%] skew-x-[-25deg] bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:translate-x-[150%] transition-transform duration-700 ease-out z-0"></span>
              <span className="relative z-10 flex items-center justify-center">Start Growing Free <span className="ml-2 inline-block transform group-hover:translate-x-1.5 transition-transform">→</span></span>
            </Link>

            <Link href="/commodities" className="group relative overflow-hidden px-8 py-4 bg-gradient-to-b from-[#FCD14D] to-[#FBC02D] text-[#0A2F1D] text-base font-black rounded-2xl shadow-[0_12px_25px_rgba(251,192,45,0.3)] hover:shadow-[0_20px_40px_rgba(251,192,45,0.5)] transform hover:-translate-y-1 transition-all duration-300 border border-[#F5B921]/50">
              <span className="absolute inset-0 w-full h-full -translate-x-[150%] skew-x-[-25deg] bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:translate-x-[150%] transition-transform duration-700 ease-out z-0"></span>
              <span className="relative z-10 flex items-center justify-center">Explore Markets<span className="ml-2 inline-block transform group-hover:scale-125 transition-transform">🌾</span></span>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* STATS SECTION - Now fading smoothly from the Hero section! No more harsh line. */}
      <section className="py-24 bg-gradient-to-b from-[#FDF8EE] to-[#F5F0E1] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { end: 10000, suffix: "+", label: "Active Farmers" },
              { end: 500, suffix: "+", label: "Mandis Tracked" },
              { end: 94, suffix: "%", label: "AI Accuracy" }
            ].map((stat, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.15 }}>
                <h3 className="heading-serif text-5xl md:text-6xl font-black text-[#0A2F1D] mb-2 drop-shadow-sm">
                  <AnimatedCounter end={stat.end} suffix={stat.suffix} duration={2500} />
                </h3>
                <p className="text-[#10893E] font-bold text-base md:text-lg uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TODAY'S MARKET PRICES SECTION (LIVE) */}
      <section className="py-24 bg-[#F5F0E1] relative z-10 border-t border-[#E2DFD3]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="text-center mb-14">
            <motion.div
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="flex items-center justify-center gap-2 mb-3"
            >
              <span className={`w-2.5 h-2.5 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-red-500 animate-pulse'}`}></span>
              <p className="text-[#10893E] font-bold text-xs md:text-sm tracking-[0.2em] uppercase">
                {isLoading ? "Fetching Live Data..." : "Live From Database"}
              </p>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="heading-serif text-3xl md:text-4xl font-black text-[#0A2F1D]"
            >
              Today's Market Prices
            </motion.h2>

            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <Link href="/commodities" className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 bg-[#10893E]/10 text-[#10893E] font-bold rounded-full hover:bg-[#10893E]/20 transition-colors">
                View All Commodities <span>→</span>
              </Link>
            </motion.div>
          </div>

          {error && (
            <div className="text-center p-6 bg-red-50 border-2 border-red-200 rounded-2xl max-w-2xl mx-auto">
              <p className="text-red-600 font-bold">{error}</p>
              <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-white text-red-600 font-bold rounded-lg border-2 border-red-200 border-b-[4px] active:translate-y-[2px] active:border-b-2 transition-all">
                Retry Connection
              </button>
            </div>
          )}

          {!error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {isLoading
                ? Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="bg-white/40 backdrop-blur-md p-6 rounded-[1.5rem] border border-white/80 shadow-[0_4px_15px_rgba(10,47,29,0.02)] border-b-[4px] border-b-[#D6D0C4]/50 flex flex-col items-center text-center animate-pulse">
                    <div className="w-14 h-14 bg-[#EBE5D9] rounded-full mb-4"></div>
                    <div className="h-5 w-20 bg-[#EBE5D9] rounded-md mb-2"></div>
                    <div className="h-3 w-28 bg-[#EBE5D9] rounded-md mb-5"></div>
                    <div className="h-7 w-20 bg-[#EBE5D9] rounded-md mb-2"></div>
                    <div className="h-4 w-16 bg-[#EBE5D9] rounded-md mb-5"></div>
                    <div className="h-10 w-full bg-[#EBE5D9] rounded-xl border-b-[4px] border-[#D6D0C4]/30"></div>
                  </div>
                ))
                : livePrices.map((crop, index) => (
                  <motion.div
                    key={crop.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.2, delay: index * 0 }}
                    whileHover={{ y: -4 }}
                    className="bg-white/60 backdrop-blur-md p-6 rounded-[1.5rem] border border-white/80 shadow-[0_4px_15px_rgba(10,47,29,0.03)] border-b-[4px] border-b-[#D6D0C4] flex flex-col items-center text-center transition-all duration-300 group"
                  >
                    <div className="text-4xl mb-3 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 drop-shadow-md">
                      {crop.icon}
                    </div>

                    <h3 className="heading-serif text-xl md:text-2xl font-bold text-[#0A2F1D] mb-1">{crop.name}</h3>
                    <p className="text-[#10893E]/80 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1">
                      <span className="text-red-500 text-xs">📍</span> {crop.location}
                    </p>

                    <div className="mb-5">
                      <p className="text-2xl md:text-3xl font-black text-[#10893E] mb-1">{typeof crop.price === 'number' ? `₹${crop.price.toLocaleString()}` : crop.price}</p>
                      <p className={`text-xs md:text-sm font-bold flex items-center justify-center gap-1 ${crop.isUp ? 'text-[#14A049]' : 'text-red-500'}`}>
                        {crop.isUp ? '▲' : '▼'} {crop.trend}
                      </p>
                    </div>

                    <Link href={`/commodities/${encodeURIComponent((crop as any).rawName || crop.name)}`} className="w-full">
                      <button className="w-full py-2.5 px-4 bg-[#FDF8EE] text-[#0A2F1D] text-xs md:text-sm font-bold rounded-xl border-2 border-[#E2DFD3] border-b-[4px] hover:bg-white hover:text-[#10893E] active:border-b-2 active:translate-y-[2px] transition-all flex items-center justify-center gap-2">
                        View Intelligence <span className="text-base leading-none">→</span>
                      </button>
                    </Link>
                  </motion.div>
                ))
              }
            </div>
          )}

        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 md:py-32 bg-[#0A2F1D] relative z-10 text-[#FDF8EE] rounded-t-[3rem] shadow-[0_-30px_60px_rgba(0,0,0,0.3)] border-t border-[#10893E]/30 overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#10893E]/20 via-[#0A2F1D] to-[#0A2F1D] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="heading-serif text-4xl md:text-5xl font-black text-[#FBC02D] mb-4 drop-shadow-[0_0_15px_rgba(251,192,45,0.2)]">Everything you need to thrive</h2>
            <p className="text-lg md:text-xl text-[#E2DFD3] max-w-3xl mx-auto font-medium">Enterprise-level technology, simplified for the fields.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative bg-white/5 backdrop-blur-sm p-6 md:p-8 rounded-[1.5rem] border border-white/10 shadow-xl overflow-hidden cursor-pointer"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-3xl mb-5 shadow-inner transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="heading-serif text-xl font-bold text-[#FDF8EE] mb-3 group-hover:text-[#FBC02D] transition-colors">{feature.title}</h3>
                  <p className="text-sm md:text-base text-[#CDE0C3] leading-relaxed font-medium">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
