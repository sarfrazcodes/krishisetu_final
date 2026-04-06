"use client";

import React, { useState, useEffect } from "react";
import { 
  Package, MapPin, CheckCircle2, Clock, Search, 
  X, Route, Receipt, Sprout, ShieldCheck, Truck
} from "lucide-react";
import Link from "next/link";

type OrderStatus = "Pending" | "Dispatched" | "In Transit" | "Delivered";

interface Order {
  id: string; crop: string; quantity: string; price: string;
  farmer: string; location: string; status: OrderStatus;
  progress: number; eta: string; icon: string; harvestDate: string;
}

const activeOrders: Order[] = [
  { id: "ORD-8821", crop: "Wheat (Lok-1)", quantity: "100q", price: "₹2,50,000", farmer: "Harpreet Singh", location: "Ludhiana", status: "In Transit", progress: 65, eta: "Today, 4:30 PM", icon: "🌾", harvestDate: "Mar 20" },
  { id: "ORD-8822", crop: "Potato (Kufri)", quantity: "50q", price: "₹57,500", farmer: "Gurdeep Agro", location: "Jalandhar", status: "Dispatched", progress: 25, eta: "Tomorrow", icon: "🥔", harvestDate: "Mar 24" },
  { id: "ORD-8819", crop: "Mustard Seed", quantity: "200q", price: "₹12,10,000", farmer: "Manjit Farms", location: "Amritsar", status: "Pending", progress: 5, eta: "Awaiting Dispatch", icon: "🌻", harvestDate: "Mar 25" }
];

export default function ActiveOrdersPage() {
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<"All" | OrderStatus>("All");
  const [traceOrder, setTraceOrder] = useState<Order | null>(null);
  const [detailsOrder, setDetailsOrder] = useState<Order | null>(null);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const filteredOrders = filter === "All" ? activeOrders : activeOrders.filter(o => o.status === filter);

  return (
    <main className="p-4 md:p-8 relative z-10 w-full animate-fade-in pb-24 overflow-x-hidden">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0A2F1D] mb-1 drop-shadow-sm">Active Orders</h1>
          <p className="text-[#627768] font-medium text-sm md:text-base">Track your inbound shipments and delivery status.</p>
        </div>
        <Link href="/buyer-dashboard/notifications">
          <button className="bg-white border border-[#E2DFD3] shadow-sm p-3 rounded-xl text-lg md:text-xl hover:-translate-y-1 transition-all relative w-fit">
            🔔<span className="absolute top-2 right-2 w-2 h-2 bg-[#FBC02D] rounded-full"></span>
          </button>
        </Link>
      </header>

      {/* SEARCH & FILTER */}
      <div className="bg-white border border-[#E2DFD3] shadow-sm p-4 rounded-2xl md:rounded-[2rem] mb-6 md:mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A9A90] w-4 h-4 md:w-5 md:h-5" />
          <input type="text" placeholder="Search Order ID or Crop..." className="w-full pl-10 md:pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10893E] text-[#0A2F1D] font-medium shadow-inner text-sm md:text-base" />
        </div>
        <div className="flex space-x-2 md:space-x-3 w-full lg:w-auto overflow-x-auto hide-scrollbar pb-2 lg:pb-0">
          {["All", "Pending", "Dispatched", "In Transit", "Delivered"].map((status) => (
            <button key={status} onClick={() => setFilter(status as any)} className={`px-4 md:px-5 py-2 md:py-2.5 rounded-xl font-bold whitespace-nowrap text-sm md:text-base transition-all shrink-0 ${filter === status ? 'bg-[#0A2F1D] text-white' : 'bg-slate-50 text-[#627768] border border-slate-200'}`}>
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* ORDERS LIST */}
      <div className="space-y-4 md:space-y-6">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white border border-[#E2DFD3] shadow-sm p-5 md:p-8 rounded-2xl md:rounded-[2rem] hover:-translate-y-1 transition-all">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
              
              <div className="flex items-start gap-4 md:gap-5 w-full lg:w-auto">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100 flex items-center justify-center text-2xl md:text-4xl shrink-0">
                  {order.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] md:text-xs font-black tracking-widest text-[#10893E] uppercase">{order.id}</span>
                    {order.status === "Delivered" && <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-[#10893E]" />}
                  </div>
                  <h3 className="font-black text-lg md:text-2xl text-[#0A2F1D] leading-tight truncate">{order.crop}</h3>
                  <p className="text-[#627768] font-bold mt-1 text-xs md:text-sm flex flex-wrap items-center gap-1">
                    <Package className="w-3 h-3 md:w-4 md:h-4 shrink-0" /> {order.quantity} • <span className="text-[#10893E]">{order.price}</span>
                  </p>
                </div>
              </div>

              <div className="flex-1 w-full lg:px-6">
                <div className="flex justify-between text-[10px] md:text-xs font-bold text-[#0A2F1D] mb-2 md:mb-3">
                  <span className={order.progress >= 5 ? "text-[#10893E]" : "opacity-40"}>Pending</span>
                  <span className={order.progress >= 25 ? "text-[#10893E]" : "opacity-40"}>Dispatched</span>
                  <span className={order.progress >= 65 ? "text-[#10893E]" : "opacity-40"}>Transit</span>
                  <span className={order.progress >= 100 ? "text-[#10893E]" : "opacity-40"}>Delivered</span>
                </div>
                <div className="w-full h-2 md:h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div className={`h-full rounded-full transition-all duration-1000 ${order.status === "Delivered" ? "bg-[#10893E]" : "bg-[#FBC02D]"}`} style={{ width: `${order.progress}%` }}></div>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-3 gap-2">
                  <p className="text-[10px] md:text-xs font-bold text-[#627768] flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 shrink-0" /> {order.farmer} ({order.location})
                  </p>
                  <p className="text-[10px] md:text-xs font-black text-[#0A2F1D] flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md w-fit">
                    <Clock className="w-3 h-3 text-[#10893E]" /> ETA: {order.eta}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-2 md:gap-3 w-full lg:w-auto shrink-0 mt-2 lg:mt-0">
                <button onClick={() => setTraceOrder(order)} className="flex-1 lg:flex-none py-2.5 md:py-3 px-4 md:px-6 bg-[#10893E] text-white rounded-xl font-bold shadow-md hover:bg-[#0A2F1D] transition-colors text-xs md:text-sm flex items-center justify-center gap-2">
                  <Route className="w-3 h-3 md:w-4 md:h-4" /> Traceability
                </button>
                <button onClick={() => setDetailsOrder(order)} className="flex-1 lg:flex-none py-2.5 md:py-3 px-4 md:px-6 bg-slate-50 border border-slate-200 text-[#0A2F1D] rounded-xl font-bold hover:bg-white transition-colors text-xs md:text-sm flex items-center justify-center gap-1">
                  <Receipt className="w-3 h-3 md:w-4 md:h-4" /> Details
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* TRACEABILITY MODAL */}
      {traceOrder && (
        <div className="fixed inset-0 bg-[#0A2F1D]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-[#E2DFD3] shadow-xl w-full max-w-md rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 relative">
            <button onClick={() => setTraceOrder(null)} className="absolute top-4 md:top-6 right-4 md:right-6 text-[#627768] hover:text-[#0A2F1D]">
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <h2 className="text-xl md:text-2xl font-black text-[#0A2F1D] mb-1">Crop Provenance</h2>
            <p className="text-[#10893E] font-bold text-xs md:text-sm mb-6 uppercase tracking-wider">{traceOrder.id}</p>

            <div className="space-y-4 md:space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-[#10893E]/30">
              
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse">
                <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border-2 md:border-4 border-white bg-[#10893E] text-white z-10 shrink-0"><Sprout className="w-3 h-3 md:w-4 md:h-4" /></div>
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-3 md:p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h3 className="font-black text-[#0A2F1D] text-sm md:text-base">Harvested</h3>
                  <p className="text-[10px] md:text-xs font-bold text-[#627768]">{traceOrder.harvestDate}</p>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse">
                <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border-2 md:border-4 border-white bg-[#10893E] text-white z-10 shrink-0"><ShieldCheck className="w-3 h-3 md:w-4 md:h-4" /></div>
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-3 md:p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h3 className="font-black text-[#0A2F1D] text-sm md:text-base">Quality Verified</h3>
                  <p className="text-[10px] md:text-xs font-bold text-[#627768]">Grade A Certified</p>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse">
                <div className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border-2 md:border-4 border-white z-10 shrink-0 ${traceOrder.progress >= 25 ? 'bg-[#10893E] text-white' : 'bg-slate-200 text-[#8A9A90]'}`}><Truck className="w-3 h-3 md:w-4 md:h-4" /></div>
                <div className={`w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-3 md:p-4 rounded-xl border border-slate-200 ${traceOrder.progress >= 25 ? 'bg-slate-50' : 'bg-white opacity-60'}`}>
                  <h3 className="font-black text-[#0A2F1D] text-sm md:text-base">Dispatched</h3>
                  <p className="text-[10px] md:text-xs font-bold text-[#627768]">{traceOrder.progress >= 25 ? 'Left Mandi' : 'Awaiting Truck'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DETAILS MODAL */}
      {detailsOrder && (
        <div className="fixed inset-0 bg-[#0A2F1D]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-[#E2DFD3] shadow-xl w-full max-w-md rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 relative">
            <button onClick={() => setDetailsOrder(null)} className="absolute top-4 md:top-6 right-4 md:right-6 text-[#627768] hover:text-[#0A2F1D]"><X className="w-5 h-5 md:w-6 md:h-6" /></button>
            <div className="text-center border-b border-dashed border-[#8A9A90] pb-4 md:pb-6 mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-black text-[#0A2F1D]">Order Receipt</h2>
              <p className="text-[#627768] text-xs md:text-sm mt-1">{detailsOrder.id}</p>
            </div>
            <div className="space-y-3 md:space-y-4 text-xs md:text-sm font-medium text-[#0A2F1D]">
              <div className="flex justify-between"><span className="text-[#8A9A90]">Supplier</span><span className="font-bold">{detailsOrder.farmer}</span></div>
              <div className="flex justify-between"><span className="text-[#8A9A90]">Commodity</span><span className="font-bold">{detailsOrder.crop}</span></div>
              <div className="flex justify-between"><span className="text-[#8A9A90]">Volume</span><span className="font-bold">{detailsOrder.quantity}</span></div>
              <div className="flex justify-between"><span className="text-[#8A9A90]">Payment</span><span className="font-bold text-[#10893E] bg-[#10893E]/10 px-2 py-0.5 rounded">Escrow Secured</span></div>
            </div>
            <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-slate-200">
              <div className="flex justify-between items-end">
                <span className="text-[10px] md:text-xs font-bold text-[#8A9A90] uppercase tracking-wider">Total Value</span>
                <span className="text-2xl md:text-3xl font-black text-[#10893E]">{detailsOrder.price}</span>
              </div>
            </div>
            <button onClick={() => setDetailsOrder(null)} className="w-full mt-6 md:mt-8 py-3 md:py-4 bg-[#0A2F1D] text-white rounded-xl font-bold hover:bg-[#10893E] transition-colors text-sm md:text-base">Close Details</button>
          </div>
        </div>
      )}
    </main>
  );
}