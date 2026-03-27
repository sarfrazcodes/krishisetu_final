"use client";

import React, { useState, useEffect } from "react";
import { useVoice } from "../hooks/useVoice";
import { Mic, MicOff } from "lucide-react";

export default function VoiceButton() {
  // 1. Add a mounted state
  const [mounted, setMounted] = useState(false);

  const { isListening, startListening, stopListening, isSupported, error } = useVoice({
    onTranscriptUpdate: (text) => {
      console.log("Transcript:", text);
    },
  });

  // 2. Set mounted to true ONLY after the component loads in the browser
  useEffect(() => {
    setMounted(true);
  }, []);

  // 3. If it's rendering on the server (not mounted yet), return null to match exactly
  if (!mounted) {
    return null; 
  }

  // If the browser doesn't support the Speech API, don't render the button
  if (!isSupported) {
    return null; 
  }

  return (
    <div className="relative flex items-center justify-center">
      <button
        onClick={isListening ? stopListening : startListening}
        className={`flex items-center justify-center p-4 rounded-full transition-all duration-300 ${
          isListening
            ? "bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.6)] animate-pulse"
            : "bg-gray-900 text-emerald-400 hover:bg-gray-800 hover:text-emerald-300 border border-gray-800 shadow-md hover:shadow-[0_0_15px_rgba(52,211,153,0.2)]"
        }`}
        title={isListening ? "Stop Voice Assistant" : "Start Voice Assistant"}
      >
        {isListening ? (
          <Mic className="w-7 h-7" />
        ) : (
          <MicOff className="w-7 h-7" />
        )}
      </button>

      {error && (
        <div className="absolute top-full mt-4 right-0 w-max text-sm bg-red-950/90 text-red-400 px-4 py-2 rounded-lg border border-red-900/50 backdrop-blur-sm">
          {error}
        </div>
      )}
    </div>
  );
}