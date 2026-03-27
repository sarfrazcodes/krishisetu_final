"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VoiceInput from "./VoiceInput";
import ResultDisplay from "./ResultDisplay";
import type { SupportedLang } from "@/lib/voiceModule";

interface VoiceDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement>;
}

export default function VoiceDropdown({ isOpen, onClose, triggerRef }: VoiceDropdownProps) {
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
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

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }
  }, [isOpen, onClose]);

  const handleSubmit = async (query: string) => {
    console.log("Submitting query:", query);
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to get prediction");
      }
      
      setResult(data.result);
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <React.Fragment key="voice-dropdown">
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Dropdown */}
          <motion.div
            key="dropdown"
            ref={dropdownRef}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, type: "spring", damping: 25 }}
            className="fixed top-20 right-4 w-[450px] max-w-[calc(100vw-2rem)] z-50"
            style={{
              right: "1rem",
              top: "5rem",
            }}
          >
            <div className="bg-white rounded-2xl shadow-2xl border-2 border-[#D6D0C4] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#FDF8EE] to-[#F5F0E1] border-b-2 border-[#D6D0C4]">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎤</span>
                  <h3 className="font-bold text-[#0A2F1D]">Voice Assistant</h3>
                  <span className="text-xs px-2 py-0.5 bg-[#10893E]/10 text-[#10893E] rounded-full font-semibold">
                    Beta
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg hover:bg-white/50 flex items-center justify-center transition-colors text-[#0A2F1D]"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <VoiceInput onSubmit={handleSubmit} isLoading={isLoading} />
                
                <div className="mt-4">
                  <ResultDisplay 
                    result={result}
                    isLoading={isLoading}
                    error={error}
                  />
                </div>

                {/* Quick Tips */}
                <div className="mt-4 pt-3 border-t border-[#D6D0C4]/30">
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    <span className="text-[#10893E]">💡</span>
                    Try: "Wheat price in Ludhiana" or "Potato rates in Delhi"
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
}

// Add React import at the top if not already there
import React from "react";