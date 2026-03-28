"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

interface VoiceDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement>;
}

type StatusType = "idle" | "listening" | "heard" | "loading" | "success" | "error";

const LANGUAGE_OPTIONS = [
  { label: "Hindi", code: "hi-IN" },
  { label: "Punjabi", code: "pa-IN" },
  { label: "Marathi", code: "mr-IN" },
  { label: "Tamil", code: "ta-IN" },
  { label: "English (India)", code: "en-IN" },
];

const QUICK_EXAMPLES = [
  "Wheat price in Ludhiana",
  "Potato rates in Delhi",
  "Corn price Maharashtra",
];

export default function VoiceDropdown({ isOpen, onClose, triggerRef }: VoiceDropdownProps) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [statusType, setStatusType] = useState<StatusType>("idle");
  const [statusMessage, setStatusMessage] = useState("Ready");
  const [selectedLang, setSelectedLang] = useState(LANGUAGE_OPTIONS[0]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  // Eagerly load available browser voices
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  // Audio function
  const playAudio = (text: string, langCode: string, actionType: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // stop previous
      const utterance = new SpeechSynthesisUtterance(text);
      let targetLang = "en-IN";
      if (langCode?.toLowerCase().includes("hindi") || langCode?.toLowerCase().includes("punjabi") || selectedLang.code === "hi-IN") {
        targetLang = "hi-IN";
      }
      utterance.lang = targetLang;

      // Force proper localized Voice Profile (Google Hindi / Native OS Dialect)
      const voices = window.speechSynthesis.getVoices();
      const localizedVoice = voices.find(v => v.lang === targetLang || v.lang.replace('_', '-') === targetLang) || voices.find(v => v.lang.includes(targetLang.split('-')[0]));
      
      if (localizedVoice) {
        utterance.voice = localizedVoice;
      }
      
      utterance.rate = 0.95; // Slightly slower, highly empathetic pacing
      
      utterance.onend = () => {
        if (actionType === "ask_clarification") {
          // Restart microphone instantly for continuous dialogue
          if (!isListening) toggleListening();
        }
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose, triggerRef]);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }
  }, [isOpen, onClose]);

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      stopListening();
      setQuery("");
      setResult(null);
      setError(null);
      setIsLoading(false);
      setStatusType("idle");
      setStatusMessage("Ready");
    }
  }, [isOpen]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
      setStatusType("idle");
      setStatusMessage("Ready");
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatusType("error");
      setStatusMessage("Speech recognition not supported in this browser");
      return;
    }

    const recognition: SpeechRecognition = new SpeechRecognition();
    recognition.lang = selectedLang.code;
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
      setStatusType("listening");
      setStatusMessage("Listening…");
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join("");
      setQuery(transcript);
      if (event.results[event.results.length - 1].isFinal) {
        setStatusType("heard");
        setStatusMessage(`✓ Heard: "${transcript}"`);
        // Auto-submit instantly
        handleSubmit(transcript);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.onerror = () => {
      setIsListening(false);
      recognitionRef.current = null;
      setStatusType("error");
      setStatusMessage("Microphone error. Please check permissions.");
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [isListening, selectedLang, stopListening]);

  const handleSubmit = async (overrideQuery?: string) => {
    const textToSubmit = overrideQuery || query;
    const trimmed = textToSubmit.trim();
    if (!trimmed || isLoading) return;

    setIsLoading(true);
    setResult(null);
    setError(null);
    setStatusType("loading");
    setStatusMessage("Fetching prediction…");

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://krishisetu-hhef.onrender.com";
      
      let role = "guest";
      let userId = null;
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const u = JSON.parse(storedUser);
          role = String(u.role || "guest").toLowerCase();
          userId = u.id || null;
        }
      } catch(e) {}

      let pageContextText = "";
      try {
        pageContextText = document.body.innerText.substring(0, 2000).replace(/\s+/g, ' ');
      } catch(e) {}

      const response = await fetch(`${API_URL}/voice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: trimmed,
          role: role,
          user_id: userId,
          pathname: pathname || "/",
          page_content: pageContextText
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Failed to process voice command");
      
      setResult(data.message);
      setStatusType("success");
      setStatusMessage(`Action: ${data.action || 'success'}`);
      
      // Text-to-Speech Output
      playAudio(data.message, data.language || "Hindi", data.action || "");

      // Interactive Navigation Routing (Wait slightly so voice starts)
      if (data.action === "navigate" && data.route) {
        setTimeout(() => {
          router.push(data.route);
        }, 150); 
        onClose();
      }

      // Real-time Visual Form Prefill (Navigate Farmer to UI Listing Editor)
      if (data.action === "add_listing") {
        setTimeout(() => {
           let targetUrl = "/farmer-dashboard/new-listing";
           if (data.crop || data.quantity) {
             const params = new URLSearchParams();
             if (data.crop) params.append("crop", data.crop);
             if (data.quantity) params.append("quantity", data.quantity);
             targetUrl += `?${params.toString()}`;
           }
           router.push(targetUrl);
        }, 300);
        onClose();
      }

    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
      setStatusType("error");
      setStatusMessage("Error");
    } finally {
      setIsLoading(false);
    }
  };

  const fillExample = (text: string) => {
    setQuery(text);
    setResult(null);
    setError(null);
    setStatusType("idle");
    setStatusMessage("Ready");
    inputRef.current?.focus();
  };

  // Status dot color
  const statusDotColor: Record<StatusType, string> = {
    idle: "bg-gray-400",
    listening: "bg-green-500 animate-pulse",
    heard: "bg-green-500",
    loading: "bg-yellow-400 animate-pulse",
    success: "bg-green-500",
    error: "bg-red-500",
  };

  const statusTextColor: Record<StatusType, string> = {
    idle: "text-gray-500",
    listening: "text-green-600",
    heard: "text-green-700",
    loading: "text-yellow-600",
    success: "text-green-700",
    error: "text-red-600",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Dropdown panel */}
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.18 }}
            className="fixed top-20 right-4 w-[450px] max-w-[calc(100vw-2rem)] z-50"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-green-50 to-yellow-50 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="2" width="6" height="11" rx="3" />
                      <path d="M5 10a7 7 0 0 0 14 0M12 19v3M8 22h8" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Talk with KrishiSetu</h3>
                    <p className="text-xs text-gray-500">I will reply instantly in your language</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-500 hover:text-gray-700"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">

                {/* Language selector */}
                <div className="flex items-center gap-3">
                  <label className="text-xs font-medium text-gray-500 whitespace-nowrap">Language:</label>
                  <select
                    value={selectedLang.code}
                    onChange={(e) => {
                      const found = LANGUAGE_OPTIONS.find((l) => l.code === e.target.value);
                      if (found) setSelectedLang(found);
                    }}
                    className="flex-1 text-sm px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {LANGUAGE_OPTIONS.map((l) => (
                      <option key={l.code} value={l.code}>{l.label}</option>
                    ))}
                  </select>
                </div>

                {/* Input + Mic */}
                <div className="flex gap-2 items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder='e.g. "Wheat price in Ludhiana"'
                    className="flex-1 px-4 py-3 rounded-xl bg-gray-900 text-white placeholder-gray-500 text-sm border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={toggleListening}
                    title={isListening ? "Stop listening" : "Start listening"}
                    className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 border transition-all duration-150 ${
                      isListening
                        ? "bg-green-700 border-green-500"
                        : "bg-gray-800 border-gray-600 hover:border-gray-400"
                    }`}
                  >
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={isListening ? "#86efac" : "#9ca3af"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="9" y="2" width="6" height="11" rx="3" />
                      <path d="M5 10a7 7 0 0 0 14 0M12 19v3M8 22h8" />
                    </svg>
                  </button>
                </div>

                {/* Status bar — always visible */}
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 min-h-[38px]">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDotColor[statusType]}`} />
                  <span className={`text-xs font-medium truncate ${statusTextColor[statusType]}`}>
                    {statusMessage}
                  </span>
                </div>

                {/* Submit button — always visible */}
                <button
                  onClick={() => handleSubmit()}
                  disabled={!query.trim() || isLoading}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    query.trim() && !isLoading
                      ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      Fetching…
                    </>
                  ) : (
                    <>
                      Ask KrishiSetu
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </>
                  )}
                </button>

                {/* Result */}
                {result && (
                  <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                    <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">KrishiSetu Voice Response</p>
                    <p className="text-sm text-gray-800 leading-relaxed">{result}</p>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="p-4 rounded-xl bg-red-950 border border-red-800">
                    <div className="flex items-start gap-2">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" className="flex-shrink-0 mt-0.5">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8v4M12 16h.01" />
                      </svg>
                      <p className="text-sm text-red-300 leading-relaxed">{error}</p>
                    </div>
                  </div>
                )}

                {/* Quick examples — hidden while loading or result shown */}
                {!isLoading && !result && (
                  <div className="pt-1 border-t border-gray-100">
                    <p className="text-xs text-gray-400 mb-2">Quick examples:</p>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_EXAMPLES.map((ex) => (
                        <button
                          key={ex}
                          onClick={() => fillExample(ex)}
                          className="text-xs px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50 hover:bg-yellow-50 hover:border-yellow-300 text-gray-600 hover:text-gray-800 transition-all"
                        >
                          {ex}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}