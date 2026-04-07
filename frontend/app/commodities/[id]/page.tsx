"use client";

import Link from "next/link";
import { useEffect, useState, use } from "react";
import { MapPin, Trophy, ArrowRight, TrendingUp } from "lucide-react";

export default function CropMandisPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const cropId = decodeURIComponent(resolvedParams.id);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const API_BASE = "http://localhost:8000";

    fetch(`${API_BASE}/crops/${encodeURIComponent(cropId)}`)
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  }, [cropId]);

  return (
    <main className="min-h-screen bg-[#FDF8EE] p-6 md:p-12 font-sans relative">
      <div className="max-w-5xl mx-auto relative z-10">
        <Link href="/commodities" className="text-[#10893E] font-bold hover:underline mb-6 inline-block">
          ← Back to Commodities
        </Link>

        <h1 className="text-4xl md:text-5xl font-black text-[#0A2F1D] mb-8">{cropId} Mandis</h1>

        {loading ? (
          <div className="py-12">
            <div className="flex flex-col items-center justify-center mb-16 space-y-4">
              <div className="relative flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-[#10893E]/20 rounded-full"></div>
                <div className="absolute w-16 h-16 border-4 border-[#10893E] border-t-transparent rounded-full animate-spin"></div>
                <MapPin className="absolute w-6 h-6 text-[#10893E] animate-pulse" />
              </div>
              <h3 className="text-xl font-black text-[#0A2F1D] animate-pulse tracking-wide">
                Pinpointing Active Markets...
              </h3>
              <p className="text-sm font-bold text-[#8A9A90] uppercase tracking-[0.2em] animate-pulse delay-150">
                Scanning Cross-State Commodities
              </p>
            </div>

            <div className="w-full h-64 md:h-48 bg-[#10893E]/5 rounded-[2rem] border border-[#E9F3E8]/50 mb-8 animate-pulse relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[shimmer_2.5s_infinite]"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white/40 h-20 rounded-2xl border border-[#E9F3E8]/50 animate-pulse relative overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent animate-[shimmer_1.5s_infinite]"></div>
                </div>
              ))}
            </div>
          </div>
        ) : data?.error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl font-bold">Error loading mandis.</div>
        ) : (
          <div className="space-y-8">

            {/* BEST MANDI HIGHLIGHT */}
            {data.best_mandi && (
              <div className="bg-gradient-to-br from-[#10893E] to-[#0A2F1D] rounded-[2rem] p-8 md:p-10 shadow-[0_15px_30px_rgba(10,47,29,0.2)] text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FBC02D] rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 text-[#FBC02D] font-bold tracking-widest uppercase text-sm mb-2">
                      <Trophy className="w-5 h-5" /> Highest Price Today
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black">{data.best_mandi.name}</h2>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-green-200 font-medium mb-1">Modal Price</p>
                    <p className="text-4xl md:text-5xl font-black text-[#FBC02D]">₹{data.best_mandi.price}<span className="text-xl text-green-100">/q</span></p>
                  </div>
                </div>

                <Link href={`/commodities/${encodeURIComponent(cropId)}/${encodeURIComponent(data.best_mandi.name)}`}>
                  <button className="mt-8 bg-white text-[#0A2F1D] px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#FDF8EE] transition-colors shadow-lg shadow-white/10">
                    Analyze with AI <TrendingUp className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            )}

            {/* ALL MANDIS */}
            <div>
              <h3 className="text-2xl font-black text-[#0A2F1D] mb-4">All Mandis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.mandis && Array.isArray(data.mandis) && data.mandis.length > 0 ? (
                  data.mandis.map((mandi: any, index: number) => (
                    <Link key={index} href={`/commodities/${encodeURIComponent(cropId)}/${encodeURIComponent(mandi.name)}`}>
                      <div className="bg-white p-6 rounded-[2rem] shadow-[0_4px_15px_rgba(10,47,29,0.04)] hover:shadow-[0_20px_40px_rgba(10,47,29,0.1)] hover:-translate-y-2 transition-all duration-500 border border-[#F0F4F0] flex flex-col justify-between h-full group relative overflow-hidden">

                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#10893E]/5 rounded-full blur-2xl group-hover:bg-[#10893E]/10 transition-colors"></div>

                        <div className="flex justify-between items-start mb-6">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#F5F9F5] to-[#E9F3E8] text-[#10893E] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm border border-[#D1E5D5]/50">
                            <MapPin className="w-6 h-6 drop-shadow-sm" />
                          </div>
                          <div className="bg-[#FFF8E7] px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-[#FBC02D]/30 shadow-sm">
                            <TrendingUp className="w-3.5 h-3.5 text-[#B7791F]" />
                            <span className="text-[10px] font-black text-[#B7791F] uppercase tracking-tighter">Live Price</span>
                          </div>
                        </div>

                        <div className="mb-4 flex-1">
                          <h4 className="text-xl font-black text-[#0A2F1D] leading-tight mb-2 group-hover:text-[#10893E] transition-colors line-clamp-2" title={mandi.name}>
                            {mandi.name}
                          </h4>
                          <div className="space-y-1">
                            <p className="text-[11px] font-bold text-[#8A9A90] uppercase tracking-wider flex items-center gap-1.5">
                              <span className="text-[#4A5D4F]">{mandi.state || "India"}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-baseline gap-1 mt-auto pb-6 border-b border-[#F0F4F0]">
                          <span className="text-3xl font-black text-[#10893E] tracking-tight">₹{mandi.price}</span>
                          <span className="text-[#8A9A90] text-xs font-bold uppercase tracking-wider">/ quintal</span>
                        </div>

                        <div className="flex items-center text-[#10893E] text-sm font-black pt-5 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                          <span className="bg-[#10893E]/10 px-4 py-2 rounded-xl group-hover:bg-[#10893E] group-hover:text-white transition-colors duration-300 flex items-center w-full justify-between">
                            Generate AI Prediction <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full p-8 text-center text-[#627768] font-bold bg-white rounded-2xl border border-[#E2DFD3]">
                    No mandi data actively reporting for this crop today.
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}
