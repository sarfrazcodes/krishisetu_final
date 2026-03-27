"use client";

import Link from "next/link";
import { useState } from "react";
import { Sprout, TrendingUp, TrendingDown, ChevronRight, Star } from "lucide-react";
import Navbar from "@/components/Navbar";

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
    <>
      {/* Add Navbar */}
      <Navbar />
      
      {/* Main Content - Add padding-top to account for fixed navbar */}
      <div className="min-h-screen bg-gradient-to-b from-[#FDF8EE] to-white pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#10893E] to-[#FBC02D] rounded-full blur-xl opacity-60" />
                <img 
                  src="/logo.png" 
                  alt="KrishiSetu" 
                  className="relative w-16 h-16 rounded-full shadow-lg"
                />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#0A2F1D] to-[#10893E] bg-clip-text text-transparent">
              Select Crops
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose a crop to view real-time market prices, AI forecasts, and nearby arbitrage opportunities.
            </p>
          </div>

          {/* Live Market Ticker - Matching Landing Page */}
          <div className="mb-10 bg-white rounded-2xl shadow-lg border border-[#D6D0C4] overflow-hidden">
            <div className="bg-gradient-to-r from-[#FBC02D] to-[#FCD14D] px-6 py-3">
              <h2 className="text-sm font-bold text-[#0A2F1D] flex items-center gap-2">
                <span className="text-lg">📊</span>
                LIVE MARKET UPDATES
              </h2>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { market: "Ludhiana", crop: "Wheat", price: "2,275", change: "+15", trend: "up" },
                { market: "Khanna", crop: "Paddy", price: "2,203", change: "-5", trend: "down" },
                { market: "Jalandhar", crop: "Mustard", price: "5,450", change: "+8", trend: "up" },
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <p className="text-xs text-gray-500">{item.market}</p>
                      <p className="font-bold text-[#0A2F1D]">{item.crop}</p>
                    </div>
                    <span className={`text-xs font-semibold ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {item.change} {item.trend === 'up' ? '↑' : '↓'}
                    </span>
                  </div>
                  <p className="text-xl font-bold text-[#10893E]">₹{item.price}</p>
                  <p className="text-xs text-gray-400">per quintal</p>
                </div>
              ))}
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeCategory === cat
                    ? "bg-[#10893E] text-white shadow-md"
                    : "bg-white text-[#0A2F1D] border border-[#D6D0C4] hover:border-[#10893E] hover:text-[#10893E]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Crop Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-[#0A2F1D]">Available Markets</h2>
              <span className="text-sm font-bold text-[#10893E] bg-green-50 border border-green-200 px-4 py-1.5 rounded-full">
                {filtered.length} crops
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filtered.map(crop => (
                <Link
                  key={crop.id}
                  href={`/commodity/${crop.id}/markets`}
                  className="group flex flex-col bg-white border border-[#D6D0C4] rounded-2xl p-5 hover:border-[#10893E] hover:shadow-xl transition-all cursor-pointer relative"
                >
                  {/* Popular Badge */}
                  {crop.isPopular && (
                    <div className="absolute top-0 right-0 bg-[#FBC02D] px-3 py-1 rounded-bl-xl rounded-tr-xl flex items-center gap-1">
                      <Star className="w-3 h-3 text-[#0A2F1D] fill-[#0A2F1D] shrink-0" />
                      <span className="text-[10px] font-extrabold text-[#0A2F1D] uppercase tracking-wider truncate">
                        Popular
                      </span>
                    </div>
                  )}

                  {/* Icon + Trend row */}
                  <div className="flex items-start justify-between mb-4 gap-2">
                    <div className="w-14 h-14 shrink-0 bg-gradient-to-br from-green-50 to-yellow-50 rounded-2xl flex items-center justify-center group-hover:from-green-100 group-hover:to-yellow-100 transition-all border border-green-100">
                      <Sprout className="w-7 h-7 text-[#10893E]" />
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
                        <div className="flex items-center text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                          — Stable
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Name + Category */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-[#0A2F1D] mb-0.5 line-clamp-2 break-words leading-snug">
                      {crop.name}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium truncate">{crop.category}</p>
                  </div>

                  {/* Price */}
                  {crop.modal_price !== null && (
                    <div className="mt-3">
                      <span className="text-xl font-extrabold text-[#10893E]">
                        ₹{crop.modal_price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-gray-400 ml-1">/ quintal</span>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-sm font-bold text-[#10893E] group-hover:text-[#0C6B2E]">
                    <span className="truncate mr-2">View Markets</span>
                    <ChevronRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}