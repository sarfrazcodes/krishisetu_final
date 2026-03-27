"use client";

import React, { useState, useEffect } from "react";
import { 
  Clock, Trash2, Check, ArrowLeft, Phone, ArrowRight 
} from "lucide-react";
import Link from "next/link";

type ComponentType = "Procurement" | "Orders" | "Analytics" | "System";

interface BuyerNotification {
  id: string;
  category: ComponentType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionLink?: string;
  farmerData?: { name: string; phone: string; location: string };
}

const buyerNotifs: BuyerNotification[] = [
  {
    id: "1",
    category: "Procurement",
    title: "Offer Accepted!",
    message: "Harpreet Singh has accepted your offer of ₹2,450/q for 100q of Wheat (Lok-1).",
    timestamp: "10 mins ago",
    isRead: false,
    actionLink: "/buyer-dashboard/orders",
    farmerData: { name: "Harpreet Singh", phone: "+91 98123 45678", location: "Ludhiana" }
  },
  {
    id: "2",
    category: "Orders",
    title: "Shipment Dispatched",
    message: "Your Potato (Kufri) order from Gurdeep Agro has left the farm. ETA: 4 Hours.",
    timestamp: "1 hour ago",
    isRead: false,
    actionLink: "/buyer-dashboard/orders"
  },
  {
    id: "3",
    category: "Analytics",
    title: "Price Drop Alert: Mustard",
    message: "Mustard prices in Haryana have dropped by 4%. Our AI suggests sourcing within the next 48 hours.",
    timestamp: "3 hours ago",
    isRead: false,
    actionLink: "/buyer-dashboard/analytics"
  },
  {
    id: "4",
    category: "System",
    title: "Escrow Funded",
    message: "₹14.5L has been successfully added to your KrishiSetu escrow wallet for upcoming transactions.",
    timestamp: "1 day ago",
    isRead: true,
  }
];

export default function BuyerNotificationsPage() {
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState(buyerNotifs);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const getCategoryStyles = (cat: ComponentType) => {
    switch (cat) {
      case "Procurement": return "bg-[#10893E]/10 text-[#10893E] border-[#10893E]/20";
      case "Analytics": return "bg-[#FBC02D]/10 text-[#B8860B] border-[#FBC02D]/20";
      case "Orders": return "bg-[#0A2F1D]/10 text-[#0A2F1D] border-[#0A2F1D]/20";
      case "System": return "bg-gray-100 text-gray-600 border-gray-200";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotif = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen p-4 md:p-10 relative z-10 w-full animate-fade-in">
      
      {/* HEADER SECTION */}
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-2">
            <Link href="/buyer-dashboard" className="text-[#10893E] font-bold flex items-center gap-2 hover:-translate-x-1 transition-transform">
              <ArrowLeft className="w-4 h-4" /> Back to Overview
            </Link>
            <h1 className="text-4xl font-black text-[#0A2F1D]">Buyer Alerts Hub</h1>
            <p className="text-[#627768] font-medium">Unified updates on your supply chain and market intelligence.</p>
          </div>
          
          <button onClick={markAllRead} className="px-6 py-3 bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl text-[#0A2F1D] font-bold shadow-sm hover:bg-white transition-all flex items-center gap-2">
            <Check className="w-4 h-4" /> Mark All Read
          </button>
        </header>

        {/* NOTIFICATIONS GRID */}
        <div className="grid gap-6">
          {notifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`relative overflow-hidden glass-panel rounded-[2.5rem] transition-all duration-300 ${
                notif.isRead ? 'opacity-60 saturate-[0.8]' : 'hover:shadow-[0_20px_40px_rgba(10,47,29,0.1)] hover:-translate-y-1'
              }`}
            >
              {/* Floating Background Glow for Unread */}
              {!notif.isRead && <div className="absolute top-0 right-0 w-32 h-32 bg-[#10893E]/5 blur-3xl pointer-events-none"></div>}

              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
                
                {/* Visual Icon with Category Tag */}
                <div className="flex flex-col items-center gap-3 shrink-0">
                   <div className="w-16 h-16 rounded-[1.5rem] bg-white shadow-inner border border-[#EBE5D9] flex items-center justify-center text-2xl">
                     {notif.category === "Procurement" && "🤝"}
                     {notif.category === "Analytics" && "📈"}
                     {notif.category === "Orders" && "🚚"}
                     {notif.category === "System" && "💰"}
                   </div>
                   <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${getCategoryStyles(notif.category)}`}>
                     {notif.category}
                   </span>
                </div>

                {/* Content Area */}
                <div className="flex-1 space-y-3 w-full">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-black text-[#0A2F1D] leading-tight">{notif.title}</h2>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#627768] bg-white/40 px-2 py-1 rounded-lg shrink-0">
                      <Clock className="w-3 h-3" /> {notif.timestamp}
                    </div>
                  </div>
                  
                  <p className="text-[#2C4B35] font-medium leading-relaxed">{notif.message}</p>

                  {/* Context-Specific Action Cards (Farmer Contact) */}
                  {notif.farmerData && (
                    <div className="bg-white/60 border border-white p-4 rounded-2xl shadow-inner flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#10893E] flex items-center justify-center text-white shrink-0"><Phone className="w-4 h-4"/></div>
                        <div>
                          <p className="text-sm font-black text-[#0A2F1D]">{notif.farmerData.name}</p>
                          <p className="text-xs font-bold text-[#10893E]">Verified Farmer • {notif.farmerData.location}</p>
                        </div>
                      </div>
                      <a href={`tel:${notif.farmerData.phone}`} className="px-6 py-2 bg-[#FBC02D] text-[#0A2F1D] font-black text-xs rounded-xl shadow-md text-center hover:bg-[#F5B921] transition-colors">Call Farmer</a>
                    </div>
                  )}

                  {/* Global Footer Actions */}
                  <div className="flex flex-wrap items-center justify-between pt-4 border-t border-[#0A2F1D]/5 mt-4">
                    <div className="flex gap-4">
                      {!notif.isRead && (
                        <button onClick={() => markRead(notif.id)} className="text-xs font-bold text-[#10893E] hover:underline flex items-center gap-1">
                          <Check className="w-3 h-3" /> Mark as read
                        </button>
                      )}
                      <button onClick={() => deleteNotif(notif.id)} className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1">
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>

                    {notif.actionLink && (
                      <Link href={notif.actionLink} className="flex items-center gap-2 text-sm font-black text-[#0A2F1D] hover:gap-3 transition-all group mt-4 sm:mt-0">
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