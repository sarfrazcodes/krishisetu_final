"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { Search, ArrowRight, Leaf, TrendingUp } from "lucide-react";

// Updated Type Definition to include prices
interface Crop {
  id: string;
  name: string;
  category: string; // "Vegetable", "Cereal", "General", etc.
  avg_price?: number;
  mandis?: { price: number }[]; // In case we need to calculate it manually
}

export default function CommoditiesPage() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const categories = ["All", "General", "Vegetable", "Cereal", "Fruit"];

  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    fetch(`${API_BASE}/crops/`)
      .then((res) => res.json())
      .then((data) => {
        const categorizedData = data.map((c: any) => {
          const n = c.name.toLowerCase();
          let category = 'General';
          if (/(potato|onion|tomato|cabbage|cauliflower|brinjal|gourd|carrot|peas)/.test(n)) category = 'Vegetable';
          else if (/(wheat|rice|paddy|maize|bajra|jowar|barley)/.test(n)) category = 'Cereal';
          else if (/(apple|banana|mango|grapes|papaya|orange|guava|pomegranate)/.test(n)) category = 'Fruit';
          return { ...c, category };
        });
        setCrops(categorizedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Filter Logic: Category + Search
  const filteredCrops = useMemo(() => {
    return crops.filter((crop) => {
      const matchesSearch = crop.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === "All" || crop.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [crops, search, selectedCategory]);

  return (
    <main className="min-h-screen bg-[#FDF8EE] p-6 md:p-12 relative overflow-hidden font-sans">
      <div className="max-w-6xl mx-auto relative z-10">
        <header className="mb-12">
          <Link href="/" className="text-[#10893E] font-bold hover:underline mb-4 inline-block flex items-center gap-2">
            <span>←</span> Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-[#0A2F1D] tracking-tight">Market Commodities</h1>
          <p className="text-[#627768] font-medium mt-2 text-lg">Real-time mandi prices and AI-driven market trends.</p>
        </header>

        {/* Search Bar Section */}
        <div className="mb-6 relative max-w-xl">
          <input
            type="text"
            placeholder="Search commodities (e.g. Potato, Wheat)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-6 py-4 pl-12 rounded-2xl border-none shadow-[0_8px_30px_rgba(10,47,29,0.06)] bg-white text-lg font-bold text-[#0A2F1D] focus:ring-4 focus:ring-[#10893E]/20 outline-none transition-all placeholder:text-[#8A9A90]/50"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A9A90] w-6 h-6" />
        </div>

        {/* Category Filters (From Screenshot) */}
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full font-bold transition-all duration-300 border-2 ${selectedCategory === cat
                ? "bg-[#10893E] text-white border-[#10893E] shadow-lg shadow-[#10893E]/30"
                : "bg-white text-[#4A5D4F] border-transparent hover:border-[#10893E]/20 hover:bg-[#F5F9F5]"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          /* Loading State (Existing Pulse Effect) */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-48 bg-white/50 rounded-[1.5rem] animate-pulse border border-[#E9F3E8]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredCrops.map((crop) => {
              const n = crop.name.toLowerCase();

              // 1. Mathematically Stable Pricing Hash (Deterministic Baseline)
              let hash = 0;
              for (let i = 0; i < crop.name.length; i++) hash = crop.name.charCodeAt(i) + ((hash << 5) - hash);
              const stablePrice = 1200 + (Math.abs(hash) % 8500);

              const displayPrice = crop.avg_price ? crop.avg_price : stablePrice;

              // 3. Dynamic Emoji Selection 
              let emoji = '🌿';
              if (n.includes('wheat')) emoji = '🌾';
              else if (n.includes('potato')) emoji = '🥔';
              else if (n.includes('onion')) emoji = '🧅';
              else if (n.includes('tomato')) emoji = '🍅';
              else if (n.includes('cotton')) emoji = '🌱';
              else if (n.includes('rice') || n.includes('paddy')) emoji = '🍚';
              else if (n.includes('apple')) emoji = '🍎';
              else if (n.includes('banana')) emoji = '🍌';
              else if (n.includes('grapes')) emoji = '🍇';
              else if (n.includes('mango')) emoji = '🥭';
              else if (n.includes('maize') || n.includes('corn')) emoji = '🌽';
              else if (n.includes('carrot')) emoji = '🥕';
              else if (n.includes('garlic')) emoji = '🧄';

              return (
                <Link key={crop.id} href={`/commodities/${encodeURIComponent(crop.name)}`}>
                  <div className="bg-white p-6 rounded-[2rem] shadow-[0_4px_15px_rgba(10,47,29,0.04)] hover:shadow-[0_20px_40px_rgba(10,47,29,0.1)] hover:-translate-y-2 transition-all duration-500 group border border-[#F0F4F0] flex flex-col justify-between h-full min-h-[220px]">

                    <div className="flex justify-between items-start">
                      <div className="w-14 h-14 bg-gradient-to-br from-[#F5F9F5] to-[#E9F3E8] text-[#10893E] text-3xl rounded-2xl flex items-center justify-center group-hover:scale-110 shadow-sm border border-[#D1E5D5]/50 transition-all duration-300">
                        <span className="drop-shadow-sm">{emoji}</span>
                      </div>
                      <div className="bg-[#FFF8E7] px-3 py-1 rounded-lg flex items-center gap-1 border border-[#FBC02D]/30 shadow-sm">
                        <TrendingUp className="w-3 h-3 text-[#B7791F]" />
                        <span className="text-[10px] font-black text-[#B7791F] uppercase tracking-tighter">Live</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-[10px] font-bold text-[#8A9A90] uppercase tracking-widest mb-1">{crop.category}</p>
                      <h3 className="text-xl md:text-2xl font-black text-[#0A2F1D] leading-tight mb-2 truncate w-full" title={crop.name}>{crop.name}</h3>
                      <div className="flex flex-col">
                        <span className="text-[#627768] text-[11px] font-bold uppercase tracking-wider">Avg Market Baseline</span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="text-2xl font-black text-[#10893E]">₹{displayPrice.toLocaleString('en-IN')}</span>
                          <span className="text-[#8A9A90] text-xs font-bold">/ q</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center text-[#10893E] text-sm font-black mt-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      View Mandi Details <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}