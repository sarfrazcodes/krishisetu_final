"use client";

import React, { useState, useEffect } from "react";
import { 
  Bell, TrendingUp, UserPlus, Package, Clock, Trash2, 
  Check, ArrowLeft, Phone, CheckCircle2, MessageSquare, 
  MapPin, Wallet, ArrowRight 
} from "lucide-react";
import Link from "next/link";

type ComponentType = "Marketplace" | "Advisor" | "Forecast" | "Calculator" | "Mandi" | "System";

interface FarmerNotification {
  id: string;
  category: ComponentType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionLink?: string;
  buyerData?: { name: string; phone: string; };
}

const allComponentNotifs: FarmerNotification[] = [
  {
    id: "1",
    category: "Forecast",
    title: "Price Spike Predicted!",
    message: "Our AI models show a 15% increase in Wheat prices for next week. Consider holding your stock.",
    timestamp: "12 mins ago",
    isRead: false,
    actionLink: "/farmer-dashboard/price-prediction"
  },
  {
    id: "2",
    category: "Marketplace",
    title: "High Demand in Ludhiana",
    message: "A new buyer 'Punjab Agro' is looking for 200q of Mustard nearby.",
    timestamp: "1 hour ago",
    isRead: false,
    actionLink: "/farmer-dashboard/marketplace",
    buyerData: { name: "Ramesh Kumar", phone: "+91 98765 43210" }
  },
  {
    id: "3",
    category: "Advisor",
    title: "Weather Alert: Pest Risk",
    message: "High humidity detected. Check your Wheat crop for aphids. Ask the AI Advisor for organic solutions.",
    timestamp: "3 hours ago",
    isRead: false,
    actionLink: "/farmer-dashboard/advisor"
  },
  {
    id: "4",
    category: "System",
    title: "Payment Credited",
    message: "₹45,000 for your last potato harvest has been successfully added to your wallet.",
    timestamp: "1 day ago",
    isRead: true,
  }
];

export default function NotificationsPage() {
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState(allComponentNotifs);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const getCategoryStyles = (cat: ComponentType) => {
    switch (cat) {
      case "Marketplace": return "bg-[#10893E]/10 text-[#10893E] border-[#10893E]/20";
      case "Forecast": return "bg-[#FBC02D]/10 text-[#B8860B] border-[#FBC02D]/20";
      case "Advisor": return "bg-blue-50 text-blue-600 border-blue-100";
      case "System": return "bg-[#0A2F1D]/5 text-[#0A2F1D] border-[#0A2F1D]/10";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-10 relative z-10 w-full animate-fade-in">
      
      {/* HEADER SECTION */}
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-2">
            <Link href="/farmer-dashboard" className="text-[#10893E] font-bold flex items-center gap-2 hover:-translate-x-1 transition-transform">
              <ArrowLeft className="w-4 h-4" /> Dashboard
            </Link>
            <h1 className="text-4xl font-black text-[#0A2F1D]">Farm Alerts Hub</h1>
            <p className="text-[#627768] font-medium">Unified updates from all KrishiSetu modules.</p>
          </div>
          
          <button className="px-6 py-3 bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl text-[#0A2F1D] font-bold shadow-sm hover:bg-white transition-all flex items-center gap-2">
            <Check className="w-4 h-4" /> Mark All Read
          </button>
        </header>

        {/* NOTIFICATIONS GRID */}
        <div className="grid gap-6">
          {notifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`relative overflow-hidden bg-white border border-[#E2DFD3] shadow-sm rounded-[2.5rem] transition-all duration-300 ${
                notif.isRead ? 'opacity-60 saturate-[0.8]' : 'hover:shadow-[0_20px_40px_rgba(10,47,29,0.1)] hover:-translate-y-1'
              }`}
            >
              {/* Floating Background Glow for Unread */}
              {!notif.isRead && <div className="absolute top-0 right-0 w-32 h-32 bg-[#10893E]/5 blur-3xl pointer-events-none"></div>}

              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
                
                {/* Visual Icon with Category Tag */}
                <div className="flex flex-col items-center gap-3">
                   <div className="w-16 h-16 rounded-[1.5rem] bg-white shadow-inner border border-[#EBE5D9] flex items-center justify-center text-2xl">
                     {notif.category === "Marketplace" && "🏪"}
                     {notif.category === "Forecast" && "📈"}
                     {notif.category === "Advisor" && "🤖"}
                     {notif.category === "System" && "💰"}
                   </div>
                   <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${getCategoryStyles(notif.category)}`}>
                     {notif.category}
                   </span>
                </div>

                {/* Content Area */}
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-black text-[#0A2F1D] leading-tight">{notif.title}</h2>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#627768] bg-white/40 px-2 py-1 rounded-lg">
                      <Clock className="w-3 h-3" /> {notif.timestamp}
                    </div>
                  </div>
                  
                  <p className="text-[#2C4B35] font-medium leading-relaxed">{notif.message}</p>

                  {/* Context-Specific Action Cards */}
                  {notif.buyerData && (
                    <div className="bg-white/60 border border-white p-4 rounded-2xl shadow-inner flex justify-between items-center mt-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#10893E] flex items-center justify-center text-white"><Phone className="w-4 h-4"/></div>
                        <div>
                          <p className="text-sm font-black text-[#0A2F1D]">{notif.buyerData.name}</p>
                          <p className="text-xs font-bold text-[#10893E]">Verified Bulk Buyer</p>
                        </div>
                      </div>
                      <a href={`tel:${notif.buyerData.phone}`} className="px-4 py-2 bg-[#FBC02D] text-[#0A2F1D] font-black text-xs rounded-xl shadow-md">Call Buyer</a>
                    </div>
                  )}

                  {/* Global Footer Actions */}
                  <div className="flex flex-wrap items-center justify-between pt-4 border-t border-[#0A2F1D]/5">
                    <div className="flex gap-4">
                      {!notif.isRead && (
                        <button className="text-xs font-bold text-[#10893E] hover:underline flex items-center gap-1">
                          <Check className="w-3 h-3" /> Mark as read
                        </button>
                      )}
                      <button className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1">
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>

                    {notif.actionLink && (
                      <Link href={notif.actionLink} className="flex items-center gap-2 text-sm font-black text-[#0A2F1D] hover:gap-3 transition-all group">
                        Open {notif.category} <ArrowRight className="w-4 h-4 text-[#10893E]" />
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
