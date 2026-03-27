"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import VoiceDropdown from "@/components/VoiceDropdown";
import { Globe, LogIn, UserPlus, LogOut, LayoutDashboard, Mic } from "lucide-react";
import { useTranslation } from "@/components/TranslationProvider";
import { motion, AnimatePresence } from "framer-motion";

const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
];

export default function Navbar() {
  const { language, setLanguage, t } = useTranslation();
  const [isVoiceDropdownOpen, setIsVoiceDropdownOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const selectedLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  const langRef = useRef<HTMLDivElement>(null);
  const voiceButtonRef = useRef<any>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    
    // Auth Check
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch(e) {}

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.replace("/login"); // Force history wipe
  };

  const toggleVoiceDropdown = () => {
    setIsVoiceDropdownOpen((prev) => !prev);
  };

  return (
    <>
      <nav className="fixed top-0 w-full flex justify-between items-center px-4 md:px-8 py-3.5 z-50 bg-white shadow-sm border-b border-emerald-100">
        <div className="flex items-center gap-6">

          {/* Simple Clean Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-emerald-200 shadow-sm">
              <img
                src="/logo.png"
                alt="KrishiSetu Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xl font-bold text-emerald-900 hidden md:inline">KrishiSetu</span>
          </Link>

          {/* Clean Navigation links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-slate-600 font-medium hover:text-emerald-700 transition-colors">Home</Link>
            <Link href="/commodities" className="text-slate-600 font-medium hover:text-emerald-700 transition-colors">Mandis</Link>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-4">

          {/* Simple Language Switcher */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen((o) => !o)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-900 font-semibold text-sm hover:bg-emerald-100 transition-colors border border-emerald-100"
            >
              <Globe className="w-4 h-4 text-emerald-700" />
              <span>{selectedLang.native}</span>
            </button>

            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 bg-white border border-emerald-100 rounded-xl shadow-lg overflow-hidden z-50"
                >
                  <div className="max-h-[300px] overflow-y-auto">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => { setLanguage(lang.code); setLangOpen(false); }}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold transition-colors border-b border-emerald-50 last:border-0
                          ${language === lang.code
                            ? "bg-emerald-50 text-emerald-700"
                            : "text-slate-700 hover:bg-slate-50"
                          }`}
                      >
                        <span>{lang.native}</span>
                        <span className="text-xs text-slate-400 font-normal">{lang.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Clean Voice Assisant */}
          <button
            ref={voiceButtonRef}
            onClick={toggleVoiceDropdown}
            className={`flex items-center justify-center p-2.5 rounded-full transition-colors
              ${isVoiceDropdownOpen
                ? "bg-amber-100 text-amber-700"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              }`}
            title="Voice Search"
          >
            <Mic className="w-5 h-5" />
          </button>

          <div className="w-[1px] h-6 bg-emerald-100 mx-1 hidden md:block"></div>

          {/* Simple Clean Auth Buttons */}
          {user ? (
            <>
              <Link 
                href={user.role === 'buyer' ? '/buyer-dashboard' : '/farmer-dashboard'}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-emerald-800 font-semibold text-sm hover:bg-emerald-50 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              <button 
                onClick={handleLogout}
                className="px-5 py-2.5 rounded-lg bg-red-50 text-red-600 font-semibold text-sm hover:bg-red-100 transition-colors shadow-sm flex items-center gap-2 border border-red-200"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/login"
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-emerald-800 font-semibold text-sm hover:bg-emerald-50 transition-colors"
              >
                <LogIn className="w-4 h-4" /> Log In
              </Link>

              <Link 
                href="/register"
                className="px-5 py-2.5 rounded-lg bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" /> Sign Up
              </Link>
            </>
          )}

        </div>
      </nav>

      <VoiceDropdown
        isOpen={isVoiceDropdownOpen}
        onClose={() => setIsVoiceDropdownOpen(false)}
        triggerRef={voiceButtonRef}
      />
    </>
  );
}