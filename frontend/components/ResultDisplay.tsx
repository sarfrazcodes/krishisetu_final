/**
 * components/ResultDisplay.tsx
 * ─────────────────────────────────────────────────────────
 * Displays prediction results with a Listen button for TTS
 * ─────────────────────────────────────────────────────────
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { default as VoiceModuleType } from "@/lib/voiceModule";

interface ResultDisplayProps {
  result: string | null;
  isLoading: boolean;
  error: string | null;
}

export default function ResultDisplay({
  result,
  isLoading,
  error,
}: ResultDisplayProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsReady, setTtsReady] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(true);
  const voiceRef = useRef<typeof VoiceModuleType | null>(null);

  useEffect(() => {
    import("@/lib/voiceModule").then((mod) => {
      voiceRef.current = mod.default;

      if (!mod.default.isTTSSupported()) {
        setTtsSupported(false);
        return;
      }

      const tryLoad = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          setTtsReady(true);
        }
      };

      tryLoad();
      window.speechSynthesis.onvoiceschanged = () => {
        tryLoad();
      };
    });

    return () => {
      voiceRef.current?.stopSpeaking();
    };
  }, []);

  const speak = useCallback((text: string) => {
    const vm = voiceRef.current;
    if (!vm || !ttsReady) return;

    vm.speak(text, {
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
    });
  }, [ttsReady]);

  useEffect(() => {
    if (!result || !ttsReady) return;

    const timer = setTimeout(() => speak(result), 150);
    return () => clearTimeout(timer);
  }, [result, ttsReady, speak]);

  const handleListenClick = () => {
    const vm = voiceRef.current;
    if (!vm) return;

    if (vm.isSpeaking()) {
      vm.stopSpeaking();
      setIsSpeaking(false);
    } else if (result) {
      speak(result);
    }
  };

  const showSkeleton = isLoading;
  const showError = !isLoading && !!error;
  const showResult = !isLoading && !error && !!result;
  const showEmpty = !isLoading && !error && !result;

  const listenDisabled = !result || !ttsReady || !ttsSupported;
  const listenLabel = !ttsSupported
    ? "TTS not supported in this browser"
    : !ttsReady
    ? "Loading voices…"
    : !result
    ? "No result yet"
    : isSpeaking
    ? "Stop speaking"
    : "Read result aloud";

  return (
    <div className="rd-root">
      <span className="rd-label">Prediction Result</span>

      <div
        className={[
          "rd-box",
          showSkeleton ? "rd-box--loading" : "",
          showError ? "rd-box--error" : "",
          showResult ? "rd-box--result" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        role="region"
        aria-live="polite"
        aria-label="Prediction result"
        id="result"
      >
        {showSkeleton && (
          <div className="rd-skeleton">
            <div className="rd-skeleton-line rd-skeleton-line--long" />
            <div className="rd-skeleton-line rd-skeleton-line--short" />
          </div>
        )}
        {showError && <span className="rd-error-text">❌ {error}</span>}
        {showResult && <span className="rd-result-text">{result}</span>}
        {showEmpty && (
          <span className="rd-placeholder">
            Prediction will appear here after you submit a query…
          </span>
        )}
      </div>

      <div className="rd-tts-row">
        <button
          type="button"
          className={[
            "rd-listen-btn",
            isSpeaking ? "rd-listen-btn--speaking" : "",
            listenDisabled ? "rd-listen-btn--disabled" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={handleListenClick}
          disabled={listenDisabled}
          aria-label={listenLabel}
          title={listenLabel}
        >
          {isSpeaking ? "🔇 Stop" : "🔊 Listen"}
        </button>

        <span className="rd-tts-hint">
          {!ttsSupported
            ? "TTS unavailable in this browser"
            : !ttsReady
            ? "Loading voices…"
            : result
            ? "Auto-played · click to replay"
            : "Speak or type a query first"}
        </span>
      </div>

      <style>{`
        .rd-root {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          width: 100%;
        }
        .rd-label {
          font-size: 0.7rem;
          font-family: monospace;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          opacity: 0.4;
          color: var(--foreground);
        }

        .rd-box {
          border: 1px solid rgba(128,128,128,0.2);
          border-radius: 8px;
          padding: 1rem;
          min-height: 4rem;
          background: var(--background);
          transition: border-color 0.3s;
        }
        .rd-box--error { border-color: rgba(239,68,68,0.4); }
        .rd-box--result {
          border-color: rgba(34,197,94,0.3);
          animation: resultReveal 0.3s ease-out;
        }
        @keyframes resultReveal {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .rd-result-text {
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--foreground);
        }
        .rd-error-text { font-size: 0.88rem; color: #dc2626; }
        .rd-placeholder {
          font-size: 0.85rem;
          opacity: 0.35;
          font-style: italic;
          color: var(--foreground);
        }

        .rd-skeleton { display: flex; flex-direction: column; gap: 0.5rem; }
        .rd-skeleton-line {
          height: 12px;
          border-radius: 4px;
          background: linear-gradient(
            90deg,
            rgba(128,128,128,0.08) 25%,
            rgba(128,128,128,0.18) 50%,
            rgba(128,128,128,0.08) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        .rd-skeleton-line--long { width: 85%; }
        .rd-skeleton-line--short { width: 55%; }
        @keyframes shimmer {
          from { background-position: 200% 0; }
          to { background-position: -200% 0; }
        }

        .rd-tts-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .rd-listen-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.5rem 1.1rem;
          border: 1px solid rgba(128,128,128,0.3);
          border-radius: 7px;
          background: transparent;
          color: var(--foreground);
          font-size: 0.85rem;
          font-family: inherit;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, transform 0.12s, opacity 0.2s;
          outline: none;
          white-space: nowrap;
        }
        .rd-listen-btn:hover:not(.rd-listen-btn--disabled) {
          background: rgba(128,128,128,0.08);
          border-color: rgba(128,128,128,0.5);
        }
        .rd-listen-btn:active:not(.rd-listen-btn--disabled) {
          transform: scale(0.96);
        }
        .rd-listen-btn--speaking {
          border-color: rgba(239,68,68,0.5);
          color: #dc2626;
          background: rgba(239,68,68,0.06);
        }
        .rd-listen-btn--disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        .rd-tts-hint {
          font-size: 0.72rem;
          font-family: monospace;
          opacity: 0.38;
          color: var(--foreground);
        }
      `}</style>
    </div>
  );
}