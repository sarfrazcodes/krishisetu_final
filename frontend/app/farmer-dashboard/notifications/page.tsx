"use client";

import React, { useState, useEffect } from "react";
import { Clock, Trash2, Check, ArrowLeft, Phone, ArrowRight } from "lucide-react";
import Link from "next/link";

type ComponentType = "Marketplace" | "Advisor" | "Forecast" | "System";

interface FarmerNotification {
  id: string; category: ComponentType; title: string; message: string;
  timestamp: string; isRead: boolean; actionLink?: string;
  buyerData?: { name: string; phone: string; };
}

const farmerNotifs: FarmerNotification[] = [
  { id: "1", category: "Forecast", title: "Price Spike Predicted!", message: "Our AI models show a 15% increase in Wheat prices for next week.", timestamp: "12 mins ago", isRead: false, actionLink: "/farmer-dashboard/price-prediction" },
  { id: "2", category: "Marketplace", title: "High Demand", message: "Punjab Agro is looking for 200q of Mustard nearby.", timestamp: "1 hour ago", isRead: false, actionLink: "/farmer-dashboard/marketplace", buyerData: { name: "Punjab Agro", phone: "+91 98765 43210" } },
  { id: "3", category: "System", title: "Payment Credited", message: "₹45,000 added to your wallet.", timestamp: "1 day ago", isRead: true }
];

export default function NotificationsPage() {
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState(farmerNotifs);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const getCategoryStyles = (cat: ComponentType) => {
    switch (cat) {
      case "Marketplace": return "bg-green-50 text-[#10893E] border-green-100";
      case "Forecast": return "bg-yellow-50 text-[#B8860B] border-yellow-100";
      case "System": return "bg-slate-100 text-[#0A2F1D] border-slate-200";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 relative z-10 w-full animate-fade-in overflow-x-hidden">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4">
          <div className="space-y-2">
            <Link href="/farmer-dashboard" className="text-[#10893E] text-sm md:text-base font-bold flex items-center gap-2 hover:-translate-x-1 transition-transform w-fit">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl md:text-4xl font-black text-[#0A2F1D]">Farm Alerts</h1>
            <p className="text-[#627768] font-medium text-sm md:text-base">Unified updates from all modules.</p>
          </div>
          <button onClick={() => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))} className="px-4 md:px-6 py-2 md:py-3 bg-white border border-slate-200 rounded-xl text-[#0A2F1D] text-sm md:text-base font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2 w-full md:w-auto justify-center">
            <Check className="w-4 h-4" /> Mark All Read
          </button>
        </header>

        <div className="grid gap-4 md:gap-6">
          {notifications.map((notif) => (
            <div key={notif.id} className={`bg-white border border-[#E2DFD3] shadow-sm rounded-2xl md:rounded-[2rem] transition-all ${notif.isRead ? 'opacity-70' : 'hover:-translate-y-1'}`}>
              <div className="p-5 md:p-6 flex flex-col sm:flex-row gap-4 md:gap-6 items-start">
                
                <div className="flex flex-row sm:flex-col items-center gap-3 shrink-0 w-full sm:w-auto">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-[1.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-xl md:text-2xl">
                    {notif.category === "Marketplace" && "🏪"}{notif.category === "Forecast" && "📈"}{notif.category === "System" && "💰"}
                  </div>
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded border ${getCategoryStyles(notif.category)}`}>{notif.category}</span>
                </div>

                <div className="flex-1 w-full min-w-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4 mb-2">
                    <h2 className="text-lg md:text-xl font-black text-[#0A2F1D] leading-tight">{notif.title}</h2>
                    <div className="flex items-center gap-1 text-[10px] md:text-xs font-bold text-[#627768] bg-slate-50 px-2 py-1 rounded w-fit">
                      <Clock className="w-3 h-3" /> {notif.timestamp}
                    </div>
                  </div>
                  
                  <p className="text-[#2D503C] text-sm md:text-base font-medium mb-4">{notif.message}</p>

                  {notif.buyerData && (
                    <div className="bg-slate-50 border border-slate-200 p-3 md:p-4 rounded-xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#10893E] flex items-center justify-center text-white shrink-0"><Phone className="w-3 h-3 md:w-4 md:h-4"/></div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-[#0A2F1D] truncate">{notif.buyerData.name}</p>
                          <p className="text-[10px] md:text-xs font-bold text-[#10893E]">Verified Bulk Buyer</p>
                        </div>
                      </div>
                      <a href={`tel:${notif.buyerData.phone}`} className="w-full sm:w-auto px-4 py-2 md:py-2.5 bg-[#FBC02D] text-[#0A2F1D] font-black text-xs md:text-sm rounded-lg text-center hover:bg-[#F5B921]">Call Buyer</a>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-slate-100 gap-3 sm:gap-4">
                    <div className="flex gap-4">
                      {!notif.isRead && (
                        <button onClick={() => setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n))} className="text-xs font-bold text-[#10893E] hover:underline flex items-center gap-1"><Check className="w-3 h-3" /> Mark read</button>
                      )}
                      <button onClick={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))} className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1"><Trash2 className="w-3 h-3" /> Remove</button>
                    </div>
                    {notif.actionLink && (
                      <Link href={notif.actionLink} className="flex items-center gap-1 text-xs md:text-sm font-black text-[#0A2F1D] hover:text-[#10893E] transition-colors w-full sm:w-auto justify-end">
                        Open {notif.category} <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}