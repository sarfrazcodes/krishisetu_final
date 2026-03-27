"use client";

import Link from "next/link";
import { useState } from "react";
import { Sprout, TrendingUp, TrendingDown, ChevronRight, Star } from "lucide-react";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
interface CommodityWithMeta {
  id: string | number;
  name: string;
  category: string;
  modal_price: number | null;
  trend: "up" | "down" | "flat" | null;
  isPopular: boolean;
}

// ─────────────────────────────────────────────
// MOCK DATA — replace with your DB fetch
// ─────────────────────────────────────────────
const MOCK_COMMODITIES: CommodityWithMeta[] = [
  { id: "1", name: "Wheat",        category: "Cereals",    modal_price: 2400,  trend: "up",   isPopular: true  },
  { id: "2", name: "Rice",         category: "Cereals",    modal_price: 3100,  trend: "flat", isPopular: true  },
  { id: "3", name: "Potato",       category: "Vegetables", modal_price: 1100,  trend: "up",   isPopular: true  },
  { id: "4", name: "Tomato",       category: "Vegetables", modal_price: 2200,  trend: "down", isPopular: true  },
  { id: "5", name: "Onion",        category: "Vegetables", modal_price: 1800,  trend: "up",   isPopular: true  },
  { id: "6", name: "Cauliflower",  category: "Vegetables", modal_price: 2000,  trend: "up",   isPopular: false },
  { id: "7", name: "Cotton",       category: "Cash Crops", modal_price: 6600,  trend: "flat", isPopular: false },
  { id: "8", name: "Mustard",      category: "Oilseeds",   modal_price: 5875,  trend: "up",   isPopular: false },
  { id: "9", name: "Soybean",      category: "Oilseeds",   modal_price: 4400,  trend: "down", isPopular: false },
  { id: "10", name: "Mango",       category: "Fruits",     modal_price: 3200,  trend: "up",   isPopular: false },
];

export default function CommoditiesPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(MOCK_COMMODITIES.map(c => c.category)))];
  const filtered = activeCategory === "All"
    ? MOCK_COMMODITIES
    : MOCK_COMMODITIES.filter(c => c.category === activeCategory);

  return (
    <div className="min-h-screen bg-green-50 font-sans">
      <div className="max-w-[95%] mx-auto space-y-10 p-6 md:p-10">

        {/* ── Header ── */}
        <div className="space-y-4 mt-6 mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">
            Select Crops
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl">
            Choose a crop to view real-time market prices, AI forecasts, and nearby arbitrage opportunities.
          </p>
        </div>

        {/* ── Category Filter Tabs ── */}
        <div className="flex flex-wrap gap-2 mb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                activeCategory === cat
                  ? "bg-green-700 text-white border-green-700 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:border-green-400 hover:text-green-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Grid ── */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-800">Available Markets</h2>
            <span className="text-base font-bold text-green-800 bg-green-200 border border-green-300 px-4 py-1.5 rounded-full">
              {filtered.length} crops
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filtered.map(crop => (
              <Link
                key={crop.id}
                href={`/commodity/${crop.id}/markets`}
                className="group flex flex-col bg-white border border-green-200 rounded-2xl p-5 hover:border-green-600 hover:shadow-lg transition-all cursor-pointer relative shadow-sm"
              >
                {/* Popular Badge */}
                {crop.isPopular && (
                  <div className="absolute top-0 right-0 bg-yellow-100 px-3 py-1 rounded-bl-xl flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-600 fill-yellow-600 shrink-0" />
                    <span className="text-[10px] font-extrabold text-yellow-800 uppercase tracking-wider truncate">
                      Popular
                    </span>
                  </div>
                )}

                {/* Icon + Trend row */}
                <div className="flex items-start justify-between mb-4 gap-2">
                  <div className="w-14 h-14 shrink-0 bg-green-50 rounded-2xl flex items-center justify-center group-hover:bg-green-100 transition-colors border border-green-100">
                    <Sprout className="w-7 h-7 text-green-700" />
                  </div>

                  <div className="shrink-0">
                    {crop.trend === "up" && (
                      <div className="flex items-center text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                        <TrendingUp className="w-3.5 h-3.5 mr-1" /> Rise
                      </div>
                    )}
                    {crop.trend === "down" && (
                      <div className="flex items-center text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full border border-red-100">
                        <TrendingDown className="w-3.5 h-3.5 mr-1" /> Fall
                      </div>
                    )}
                    {(crop.trend === "flat" || crop.trend === null) && (
                      <div className="flex items-center text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
                        — Stable
                      </div>
                    )}
                  </div>
                </div>

                {/* Name + Category */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-slate-900 mb-0.5 line-clamp-2 break-words leading-snug">
                    {crop.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium truncate">{crop.category}</p>
                </div>

                {/* Price */}
                {crop.modal_price !== null && (
                  <div className="mt-3">
                    <span className="text-base font-extrabold text-green-700">
                      ₹{crop.modal_price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">/ quintal</span>
                  </div>
                )}

                {/* Footer */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-green-700 group-hover:text-green-800">
                  <span className="truncate mr-2">View Markets</span>
                  <ChevronRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
