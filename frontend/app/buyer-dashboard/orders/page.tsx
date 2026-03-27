"use client";

import React, { useState, useEffect } from "react";
import { 
  Package, MapPin, CheckCircle2, Clock, ChevronRight, Search, Filter, 
  X, Route, Receipt, Sprout, ShieldCheck, Truck
} from "lucide-react";
import Link from "next/link";

// --- MOCK DATA ---
type OrderStatus = "Pending" | "Dispatched" | "In Transit" | "Delivered";

interface Order {
  id: string;
  crop: string;
  quantity: string;
  price: string;
  farmer: string;
  location: string;
  status: OrderStatus;
  progress: number;
  eta: string;
  icon: string;
  harvestDate: string;
}

const activeOrders: Order[] = [
  {
    id: "ORD-8821",
    crop: "Wheat (Lok-1)",
    quantity: "100 Quintals",
    price: "₹2,50,000",
    farmer: "Harpreet Singh",
    location: "Ludhiana, Punjab",
    status: "In Transit",
    progress: 65,
    eta: "Today, 4:30 PM",
    icon: "🌾",
    harvestDate: "Mar 20, 2026"
  },
  {
    id: "ORD-8822",
    crop: "Potato (Kufri)",
    quantity: "50 Quintals",
    price: "₹57,500",
    farmer: "Gurdeep Agro",
    location: "Jalandhar, Punjab",
    status: "Dispatched",
    progress: 25,
    eta: "Tomorrow, 10:00 AM",
    icon: "🥔",
    harvestDate: "Mar 24, 2026"
  },
  {
    id: "ORD-8819",
    crop: "Mustard Seed",
    quantity: "200 Quintals",
    price: "₹12,10,000",
    farmer: "Manjit Farms (Organic)",
    location: "Amritsar, Punjab",
    status: "Pending",
    progress: 5,
    eta: "Awaiting Dispatch",
    icon: "🌻",
    harvestDate: "Mar 25, 2026"
  }
];

export default function ActiveOrdersPage() {
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<"All" | OrderStatus>("All");
  
  // Modal States
  const [traceOrder, setTraceOrder] = useState<Order | null>(null);
  const [detailsOrder, setDetailsOrder] = useState<Order | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const filteredOrders = filter === "All" 
    ? activeOrders 
    : activeOrders.filter(o => o.status === filter);

  return (
    <main className="p-4 md:p-8 relative z-10 w-full animate-fade-in pb-24">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#0A2F1D] mb-1 drop-shadow-sm">Active Orders</h1>
          <p className="text-[#627768] font-medium">Track your inbound shipments and delivery status.</p>
        </div>
        
        <div className="flex space-x-4 items-center w-full md:w-auto">
          <Link href="/buyer-dashboard/notifications">
            <button className="bg-white border border-[#E2DFD3] shadow-sm p-3 rounded-xl text-xl hover:scale-110 hover:-translate-y-1 transition-all relative">
              🔔<span className="absolute top-2 right-2 w-2 h-2 bg-[#FBC02D] rounded-full shadow-[0_0_8px_#FBC02D]"></span>
            </button>
          </Link>
        </div>
      </header>

      {/* --- SEARCH & FILTER BAR --- */}
      <div className="bg-white border border-[#E2DFD3] shadow-sm p-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A9A90] w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by Order ID, Crop, or Farmer..." 
            className="w-full pl-12 pr-4 py-3 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10893E] text-[#0A2F1D] font-medium shadow-inner transition-colors"
          />
        </div>
        
        {/* Status Filters */}
        <div className="flex space-x-2 w-full md:w-auto overflow-x-auto hide-scrollbar pb-2 md:pb-0">
          {["All", "Pending", "Dispatched", "In Transit", "Delivered"].map((status) => (
            <button 
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-5 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all duration-150 ${
                filter === status 
                ? 'bg-[#0A2F1D] text-white shadow-md' 
                : 'bg-white/60 text-[#627768] hover:bg-white hover:text-[#0A2F1D] border border-transparent hover:border-[#E2DFD3]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* --- ORDERS LIST --- */}
      <div className="space-y-6">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white border border-[#E2DFD3] shadow-sm p-6 md:p-8 rounded-[2rem] hover:shadow-[0_15px_30px_rgba(10,47,29,0.08)] transition-all duration-300 group">
            
            <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
              
              {/* Left Details */}
              <div className="flex items-start gap-5 min-w-[300px]">
                <div className="w-16 h-16 bg-white/80 rounded-2xl shadow-inner border border-white flex items-center justify-center text-4xl shrink-0 transform group-hover:scale-105 transition-transform">
                  {order.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black tracking-widest text-[#10893E] uppercase">{order.id}</span>
                    {order.status === "Delivered" && <CheckCircle2 className="w-4 h-4 text-[#10893E]" />}
                  </div>
                  <h3 className="font-black text-2xl text-[#0A2F1D] leading-tight">{order.crop}</h3>
                  <p className="text-[#627768] font-bold mt-1 text-sm flex items-center gap-1">
                    <Package className="w-4 h-4" /> {order.quantity} • <span className="text-[#10893E]">{order.price}</span>
                  </p>
                </div>
              </div>

              {/* Middle: Progress Bar */}
              <div className="flex-1 w-full lg:px-8">
                <div className="flex justify-between text-xs font-bold text-[#0A2F1D] mb-3">
                  <span className={order.progress >= 5 ? "text-[#10893E]" : "opacity-40"}>Pending</span>
                  <span className={order.progress >= 25 ? "text-[#10893E]" : "opacity-40"}>Dispatched</span>
                  <span className={order.progress >= 65 ? "text-[#10893E]" : "opacity-40"}>In Transit</span>
                  <span className={order.progress >= 100 ? "text-[#10893E]" : "opacity-40"}>Delivered</span>
                </div>
                
                {/* 3D Progress Track */}
                <div className="w-full h-3 bg-white/60 rounded-full shadow-inner overflow-hidden border border-white/80 relative">
                  <div 
                    className={`h-full rounded-full relative transition-all duration-1000 ease-out ${
                      order.status === "Delivered" ? "bg-[#10893E]" : "bg-gradient-to-r from-[#FCD14D] to-[#FBC02D]"
                    }`}
                    style={{ width: `${order.progress}%` }}
                  >
                    {order.status === "In Transit" && (
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.4)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] animate-[slide_1s_linear_infinite]"></div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-3">
                  <p className="text-xs font-bold text-[#627768] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {order.farmer} ({order.location})
                  </p>
                  <p className="text-xs font-black text-[#0A2F1D] flex items-center gap-1 bg-white/50 px-2 py-1 rounded-md shadow-sm">
                    <Clock className="w-3.5 h-3.5 text-[#10893E]" /> ETA: {order.eta}
                  </p>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex lg:flex-col gap-3 w-full lg:w-auto shrink-0">
                <button 
                  onClick={() => setTraceOrder(order)}
                  className="flex-1 lg:flex-none py-3 px-6 bg-[#10893E] text-white rounded-xl font-bold shadow-[0_4px_10px_rgba(16,137,62,0.3)] hover:bg-[#0A2F1D] transition-all text-sm flex items-center justify-center gap-2"
                >
                  <Route className="w-4 h-4" /> Traceability
                </button>
                <button 
                  onClick={() => setDetailsOrder(order)}
                  className="flex-1 lg:flex-none py-3 px-6 bg-white/60 border border-white text-[#0A2F1D] rounded-xl font-bold shadow-sm hover:bg-white transition-all text-sm flex items-center justify-center gap-1 group"
                >
                  <Receipt className="w-4 h-4" /> Details
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* =========================================
          MODALS
      ========================================= */}

      {/* TRACEABILITY MODAL */}
      {traceOrder && (
        <div className="fixed inset-0 bg-[#0A2F1D]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-[#E2DFD3] shadow-sm w-full max-w-md rounded-[2.5rem] p-8 relative">
            <button onClick={() => setTraceOrder(null)} className="absolute top-6 right-6 text-[#627768] hover:text-[#0A2F1D] transition-colors">
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-black text-[#0A2F1D] mb-1">Crop Provenance</h2>
            <p className="text-[#10893E] font-bold text-sm mb-6 uppercase tracking-wider">{traceOrder.id}</p>

            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#10893E] before:to-transparent">
              
              {/* Step 1: Harvest */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[#10893E] text-white shadow shrink-0 z-10">
                  <Sprout className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-white/80 shadow-sm border border-white">
                  <h3 className="font-black text-[#0A2F1D]">Harvested</h3>
                  <p className="text-xs font-bold text-[#627768]">{traceOrder.harvestDate} • Farm Location</p>
                </div>
              </div>

              {/* Step 2: Quality Check */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[#10893E] text-white shadow shrink-0 z-10">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-white/80 shadow-sm border border-white">
                  <h3 className="font-black text-[#0A2F1D]">Quality Verified</h3>
                  <p className="text-xs font-bold text-[#627768]">Grade A Certified • Mandi Audit</p>
                </div>
              </div>

              {/* Step 3: Logistics */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow shrink-0 z-10 ${traceOrder.progress >= 25 ? 'bg-[#10893E] text-white' : 'bg-[#E2DFD3] text-[#8A9A90]'}`}>
                  <Truck className="w-4 h-4" />
                </div>
                <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-white shadow-sm ${traceOrder.progress >= 25 ? 'bg-white/80' : 'bg-white/40 opacity-60'}`}>
                  <h3 className="font-black text-[#0A2F1D]">Dispatched</h3>
                  <p className="text-xs font-bold text-[#627768]">{traceOrder.progress >= 25 ? 'Left Mandi/Farm' : 'Awaiting Truck'}</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* DETAILS MODAL */}
      {detailsOrder && (
        <div className="fixed inset-0 bg-[#0A2F1D]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-[#E2DFD3] shadow-sm w-full max-w-md rounded-[2.5rem] p-8 relative bg-white/90">
            <button onClick={() => setDetailsOrder(null)} className="absolute top-6 right-6 text-[#627768] hover:text-[#0A2F1D] transition-colors">
              <X className="w-6 h-6" />
            </button>

            <div className="text-center border-b border-dashed border-[#8A9A90] pb-6 mb-6">
              <h2 className="text-2xl font-black text-[#0A2F1D]">Order Receipt</h2>
              <p className="text-[#627768] text-sm mt-1">{detailsOrder.id}</p>
            </div>

            <div className="space-y-4 text-sm font-medium text-[#0A2F1D]">
              <div className="flex justify-between">
                <span className="text-[#8A9A90]">Supplier</span>
                <span className="font-bold">{detailsOrder.farmer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A9A90]">Commodity</span>
                <span className="font-bold">{detailsOrder.crop}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A9A90]">Volume</span>
                <span className="font-bold">{detailsOrder.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A9A90]">Payment Status</span>
                <span className="font-bold text-[#10893E] bg-[#10893E]/10 px-2 py-0.5 rounded">Escrow Secured</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-solid border-[#EBE5D9]">
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold text-[#8A9A90] uppercase tracking-wider">Total Value</span>
                <span className="text-3xl font-black text-[#10893E]">{detailsOrder.price}</span>
              </div>
            </div>

            <button onClick={() => setDetailsOrder(null)} className="w-full mt-8 py-4 bg-[#0A2F1D] text-white rounded-xl font-bold shadow-md hover:bg-[#10893E] transition-colors">
              Close Details
            </button>
          </div>
        </div>
      )}

    </main>
  );
}
