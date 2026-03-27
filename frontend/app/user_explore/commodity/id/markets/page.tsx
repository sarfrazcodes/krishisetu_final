"use client";

import Link from "next/link";
import { useState } from "react";
import { MapPin, TrendingUp, TrendingDown, ChevronRight, Search, Navigation, Award } from "lucide-react";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
interface MandiResult {
  mandi: {
    id: string;
    name: string;
    state?: string;
  };
  price: number | null;
  trend: "up" | "down" | "flat";
  isBest?: boolean;
}

// ─────────────────────────────────────────────
// MOCK DATA — replace with your DB fetch
// ─────────────────────────────────────────────
const MOCK_COMMODITY_NAME = "Wheat";

const MOCK_MANDIS: MandiResult[] = [
  { mandi: { id: "1", name: "Azadpur Mandi",        state: "Delhi"         }, price: 2400, trend: "up",   isBest: true  },
  { mandi: { id: "2", name: "Ludhiana Mandi",        state: "Punjab"        }, price: 2275, trend: "up",   isBest: false },
  { mandi: { id: "3", name: "Khanna APMC",           state: "Punjab"        }, price: 2203, trend: "down", isBest: false },
  { mandi: { id: "4", name: "Jodhpur (F&V) APMC",   state: "Rajasthan"     }, price: 2180, trend: "flat", isBest: false },
  { mandi: { id: "5", name: "Sanwer APMC",           state: "Madhya Pradesh"}, price: 2310, trend: "up",   isBest: false },
  { mandi: { id: "6", name: "Dhrangadhra APMC",      state: "Gujarat"       }, price: 2150, trend: "down", isBest: false },
];

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────
export default function MarketsPage() {
  // In real usage: const params = useParams(); const commodityId = params.id as string;
  const commodityId = "1"; // placeholder

  const [searchQuery, setSearchQuery] = useState("");

  const filtered = MOCK_MANDIS.filter(item =>
    item.mandi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.mandi.state ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-green-50 font-sans pt-12 pb-20">
      <div className="max-w-[95%] mx-auto space-y-10 px-6">

        {/* ── Header ── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3">
            <Link href="/commodities" className="text-green-700 font-bold flex items-center gap-1 hover:underline mb-2 w-fit">
              ← Back to Crops
            </Link>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 capitalize">
              Select Market — {MOCK_COMMODITY_NAME}
            </h1>
            <p className="text-lg text-slate-500 font-medium">
              We found{" "}
              <span className="text-green-700 font-bold">{filtered.length} active mandis</span>{" "}
              active mandis for your selection.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
            <input
              type="text"
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-green-100 rounded-2xl text-slate-900 shadow-sm focus:border-green-600 outline-none placeholder:text-slate-400 font-bold transition-all"
              placeholder="Search by Mandi or State..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* ── Empty State ── */}
        {filtered.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-green-200 rounded-[2rem] py-24 text-center">
            <Navigation className="w-16 h-16 text-green-200 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-800">No Markets Found</h3>
            <p className="text-slate-500 font-medium mt-2">Try searching for a different state or mandi name.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((item) => (
              <Link
                key={item.mandi.id}
                href={`/dashboard/${commodityId}/${item.mandi.id}`}
                className="group relative bg-white border border-slate-200 rounded-[2rem] p-6 transition-all hover:border-green-600 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between min-h-[260px]"
              >
                {/* Top Badge Row */}
                <div className="flex justify-between items-start mb-4 gap-2">
                  {item.isBest ? (
                    <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 border border-yellow-200 shrink-0">
                      <Award className="w-3 h-3" /> Best Price
                    </div>
                  ) : (
                    <div className="bg-slate-50 text-slate-400 px-2 py-1 rounded-full text-[10px] font-black uppercase border border-slate-100 shrink-0">
                      Active
                    </div>
                  )}

                  {item.trend === "up" ? (
                    <span className="flex items-center text-xs font-black text-green-700 bg-green-50 px-2 py-1 rounded-lg shrink-0">
                      <TrendingUp className="w-3 h-3 mr-1" /> ▲
                    </span>
                  ) : item.trend === "down" ? (
                    <span className="flex items-center text-xs font-black text-red-600 bg-red-50 px-2 py-1 rounded-lg shrink-0">
                      <TrendingDown className="w-3 h-3 mr-1" /> ▼
                    </span>
                  ) : (
                    <span className="flex items-center text-xs font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-lg shrink-0">
                      —
                    </span>
                  )}
                </div>

                {/* Mandi Info */}
                <div className="flex-1 space-y-1 overflow-hidden">
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-green-700 transition-colors leading-snug line-clamp-2 break-words">
                    {item.mandi.name}
                  </h3>
                  {item.mandi.state && (
                    <p className="text-slate-400 font-bold flex items-center gap-1.5 uppercase tracking-wider text-[11px] truncate">
                      <MapPin className="w-3.5 h-3.5 shrink-0" /> {item.mandi.state}
                    </p>
                  )}
                </div>

                {/* Price Display */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-end justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        Today's Price
                      </p>
                      <h4 className="text-2xl font-black text-slate-900 group-hover:text-green-800 transition-colors truncate">
                        {item.price !== null ? `₹${Number(item.price).toLocaleString("en-IN")}` : "—"}
                      </h4>
                    </div>
                    <div className="w-10 h-10 shrink-0 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-green-600 group-hover:border-green-600 transition-all">
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>

                {/* Hover bottom bar */}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-green-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-b-[2rem]" />
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
