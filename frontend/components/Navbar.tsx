"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import VoiceDropdown from "@/components/VoiceDropdown";

const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
];

export default function Navbar() {
  const [isVoiceDropdownOpen, setIsVoiceDropdownOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const langRef = useRef<HTMLDivElement>(null);
  const voiceButtonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleVoiceDropdown = () => {
    setIsVoiceDropdownOpen((prev) => !prev);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
        className="fixed top-0 w-full flex justify-between items-center px-4 md:px-8 py-4 z-50 bg-[#FDF8EE]/80 backdrop-blur-md border-b-[3px] border-[#D6D0C4] shadow-[0_4px_20px_rgba(10,47,29,0.05)]"
      >
        {/* LEFT — Brand / Nav links */}
        <div className="flex items-center gap-6 md:gap-8">
          
          {/* CIRCULAR 3D LOGO BUTTON */}
          <Link href="/" className="relative group">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white border-2 border-[#D6D0C4] border-b-[4px] shadow-sm overflow-hidden hover:bg-[#F5F0E1] hover:-translate-y-[2px] active:border-b-2 active:translate-y-[2px] transition-all duration-200">
              <img 
                src="/logo.png" 
                alt="KrishiSetu Logo" 
                className="w-10 h-10 object-contain rounded-full" 
              />
            </div>
            <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#0A2F1D] text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              KrishiSetu Home
            </span>
          </Link>

          {/* Navigation links */}
          <div className="hidden md:flex items-center gap-4">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/user_explore/commodities">Explore Mandi</NavLink>
            <NavLink href="/marketplace">Market</NavLink>
          </div>
        </div>

        {/* RIGHT — utilities + auth */}
        <div className="flex items-center gap-3 md:gap-4">

          {/* 3D LANGUAGE SWITCHER */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen((o) => !o)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border-2 border-[#D6D0C4] border-b-[4px] text-[#0A2F1D] font-bold text-sm hover:bg-[#F5F0E1] hover:-translate-y-[2px] active:border-b-2 active:translate-y-[2px] transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#10893E]">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span>{selectedLang.native}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={`transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`}>
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-44 bg-white border-2 border-[#D6D0C4] border-b-[6px] rounded-2xl shadow-xl overflow-hidden z-50"
                >
                  <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => { setSelectedLang(lang); setLangOpen(false); }}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-black transition-colors border-b border-[#D6D0C4]/30 last:border-0
                          ${selectedLang.code === lang.code
                            ? "bg-[#10893E]/10 text-[#10893E]"
                            : "text-[#0A2F1D] hover:bg-[#FBC02D]/20"
                          }`}
                      >
                        <span>{lang.label}</span>
                        <span className="text-xs opacity-60 font-bold">{lang.native}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 3D VOICE MIC BUTTON - Opens Dropdown */}
          <button
            ref={voiceButtonRef}
            onClick={toggleVoiceDropdown}
            className={`relative flex items-center justify-center w-11 h-11 rounded-xl border-2 border-b-[4px] font-bold transition-all
              ${isVoiceDropdownOpen
                ? "bg-[#10893E] text-white border-[#0C6B2E] shadow-[0_0_15px_rgba(16,137,62,0.4)]"
                : "bg-white border-[#D6D0C4] text-[#0A2F1D] hover:bg-[#F5F0E1] hover:-translate-y-[2px] active:border-b-2 active:translate-y-[2px]"
              }`}
            title="Open voice assistant"
          >
            {isVoiceDropdownOpen && (
              <span className="absolute inset-0 rounded-xl animate-ping bg-[#10893E] opacity-30" />
            )}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="2" width="6" height="11" rx="3" />
              <path d="M5 10a7 7 0 0 0 14 0M12 19v3M8 22h8" />
            </svg>
          </button>

          <div className="w-[2px] h-8 bg-[#D6D0C4]/50 mx-1 hidden md:block rounded-full"></div>

          {/* 3D LOG IN BUTTON */}
          <Link
            href="/login"
            className="hidden md:flex px-5 py-2.5 rounded-xl bg-[#10893E] text-white font-black text-sm border-2 border-[#0C6B2E] border-b-[4px] hover:bg-[#14A049] hover:-translate-y-[2px] active:border-b-2 active:translate-y-[2px] transition-all shadow-[0_4px_15px_rgba(16,137,62,0.2)]"
          >
            Log In
          </Link>

          {/* 3D SIGN UP BUTTON */}
          <Link
            href="/register"
            className="px-6 py-2.5 rounded-xl bg-[#FBC02D] text-[#0A2F1D] font-black text-sm border-2 border-[#D4A017]/80 border-b-[4px] hover:bg-[#FCD14D] hover:-translate-y-[2px] active:border-b-2 active:translate-y-[2px] transition-all flex items-center gap-2 shadow-[0_4px_15px_rgba(251,192,45,0.2)]"
          >
            Sign Up <span className="text-lg leading-none transform hover:rotate-12 transition-transform">✨</span>
          </Link>

        </div>
      </motion.nav>

      {/* Voice Dropdown */}
      <VoiceDropdown 
        isOpen={isVoiceDropdownOpen}
        onClose={() => setIsVoiceDropdownOpen(false)}
        triggerRef={voiceButtonRef}
      />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #F5F0E1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #D6D0C4;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #10893E;
        }
      `}</style>
    </>
  );
}

// 3D PILL NAV LINKS
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center px-4 py-2 rounded-xl bg-white border-2 border-[#D6D0C4] border-b-[4px] text-[#0A2F1D] font-bold text-sm hover:bg-[#F5F0E1] hover:-translate-y-[2px] active:border-b-2 active:translate-y-[2px] transition-all"
    >
      {children}
    </Link>
  );
}