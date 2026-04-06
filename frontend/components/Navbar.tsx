"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import VoiceDropdown from "@/components/VoiceDropdown";
import { Globe, LogIn, UserPlus, LogOut, LayoutDashboard, Mic, Menu, X } from "lucide-react"; // Added Menu and X
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Added mobile menu state
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
    setIsMobileMenuOpen(false);
    window.location.replace("/login"); // Force history wipe
  };

  const toggleVoiceDropdown = () => {
    setIsVoiceDropdownOpen((prev) => !prev);
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white shadow-sm border-b border-emerald-100">
        <div className="flex justify-between items-center px-4 md:px-8 py-3.5">
          <div className="flex items-center gap-6">

            {/* Simple Clean Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border border-emerald-200 shadow-sm shrink-0">
                <img
                  src="/logo.png"
                  alt="KrishiSetu Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-lg md:text-xl font-bold text-emerald-900 hidden sm:inline">KrishiSetu</span>
            </Link>

            {/* Clean Navigation links (Desktop Only) */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-slate-600 font-medium hover:text-emerald-700 transition-colors">Home</Link>
              <Link href="/commodities" className="text-slate-600 font-medium hover:text-emerald-700 transition-colors">Mandis</Link>
              <Link href="/about" className="text-slate-600 font-medium hover:text-emerald-700 transition-colors">About Us</Link>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">

            {/* Simple Language Switcher */}
            <div ref={langRef} className="relative">
              <button
                onClick={() => setLangOpen((o) => !o)}
                className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-2 rounded-lg bg-emerald-50 text-emerald-900 font-semibold text-xs md:text-sm hover:bg-emerald-100 transition-colors border border-emerald-100"
              >
                <Globe className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-700" />
                <span className="hidden sm:inline">{selectedLang.native}</span>
                <span className="sm:hidden">{selectedLang.code.toUpperCase()}</span>
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

            {/* Premium Voice AI Chip */}
            <button
              ref={voiceButtonRef}
              onClick={toggleVoiceDropdown}
              className={`flex items-center justify-center gap-2 md:gap-2.5 px-3 md:px-4 py-2 md:py-2.5 rounded-full font-bold text-xs md:text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all
                ${isVoiceDropdownOpen
                  ? "bg-gradient-to-r from-amber-400 to-[#FBC02D] text-[#0A2F1D] shadow-[0_4px_15px_rgba(251,192,45,0.4)] border border-amber-300"
                  : "bg-gradient-to-r from-[#10893E] to-emerald-600 text-white hover:from-emerald-600 hover:to-[#10893E] border border-emerald-500"
                }`}
              title="Ask KrishiSetu AI"
            >
              <div className={`flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full ${isVoiceDropdownOpen ? 'bg-amber-100' : 'bg-white/20'}`}>
                <Mic className={`w-3 h-3 md:w-3.5 md:h-3.5 ${isVoiceDropdownOpen ? 'text-amber-800 animate-pulse' : 'text-white'}`} />
              </div>
              <span className="hidden lg:block tracking-wide">
                {isVoiceDropdownOpen ? "Listening..." : "Talk with KrishiSetu"}
              </span>
            </button>

            <div className="w-[1px] h-6 bg-emerald-100 mx-1 hidden md:block"></div>

            {/* Desktop Auth Buttons (Hidden on Mobile) */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <Link 
                    href={user.role === 'buyer' ? '/buyer-dashboard' : '/farmer-dashboard'}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-emerald-800 font-semibold text-sm hover:bg-emerald-50 transition-colors"
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
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-emerald-800 font-semibold text-sm hover:bg-emerald-50 transition-colors"
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

            {/* Mobile Hamburger Button */}
            <button 
              className="md:hidden p-1.5 text-emerald-900 hover:bg-emerald-50 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-emerald-100 bg-white absolute w-full left-0 top-full shadow-xl overflow-hidden z-40"
            >
              <div className="flex flex-col px-6 py-4 space-y-4">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-700 font-bold text-lg py-2 border-b border-emerald-50">Home</Link>
                <Link href="/commodities" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-700 font-bold text-lg py-2 border-b border-emerald-50">Mandis</Link>
                <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-700 font-bold text-lg py-2 border-b border-emerald-50">About Us</Link>
                
                <div className="pt-4 flex flex-col gap-3">
                  {user ? (
                    <>
                      <Link 
                        href={user.role === 'buyer' ? '/buyer-dashboard' : '/farmer-dashboard'}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-100"
                      >
                        <LayoutDashboard className="w-5 h-5" /> Go to Dashboard
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-600 font-bold border border-red-100"
                      >
                        <LogOut className="w-5 h-5" /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        href="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-100"
                      >
                        <LogIn className="w-5 h-5" /> Log In
                      </Link>
                      <Link 
                        href="/register"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 text-white font-bold shadow-md"
                      >
                        <UserPlus className="w-5 h-5" /> Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <VoiceDropdown
        isOpen={isVoiceDropdownOpen}
        onClose={() => setIsVoiceDropdownOpen(false)}
        triggerRef={voiceButtonRef}
      />
    </>
  );
}