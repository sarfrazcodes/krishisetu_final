/**
 * components/VoiceInput.tsx
 * ─────────────────────────────────────────────────────────
 * Mic button + text input field.
 * Lazy-loads VoiceModule (browser-only) via useEffect.
 * ─────────────────────────────────────────────────────────
 */

"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type KeyboardEvent,
} from "react";
import StatusBadge, { type StatusType } from "./StatusBadge";
import type { default as VoiceModuleType, SupportedLang } from "@/lib/voiceModule";

interface VoiceInputProps {
  /** Called when the user submits a query (Enter key or submit button) */
  onSubmit: (query: string) => void;
  /** Pass loading state so the input disables during API call */
  isLoading?: boolean;
}

export default function VoiceInput({ onSubmit, isLoading = false }: VoiceInputProps) {
  const [inputValue, setInputValue]   = useState("");
  const [isInterim, setIsInterim]     = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus]           = useState<{ msg: string; type: StatusType }>({
    msg: "Ready",
    type: "idle",
  });
  const [lang, setLang] = useState<SupportedLang>("en");

  const voiceRef = useRef<typeof VoiceModuleType | null>(null);

  useEffect(() => {
    import("@/lib/voiceModule").then((mod) => {
      voiceRef.current = mod.default;
    });
  }, []);

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value as SupportedLang;
    setLang(selected);
    voiceRef.current?.setLanguage(selected);
    setStatus({ msg: `Language updated`, type: "idle" });
  };

  const handleSubmit = useCallback(() => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      setStatus({ msg: "⚠ Please enter or speak a query first", type: "error" });
      return;
    }
    onSubmit(trimmed);
  }, [inputValue, onSubmit]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  const handleMicClick = () => {
    const vm = voiceRef.current;
    if (!vm) return;

    if (!vm.isSTTSupported()) {
      setStatus({
        msg: "🚫 Voice input not supported — use Chrome or Edge",
        type: "error",
      });
      return;
    }

    if (vm.isListening()) {
      vm.stopListening();
      return;
    }

    vm.startListening({
      onStart() {
        setIsListening(true);
        setStatus({ msg: "🎤 Listening…", type: "listening" });
        vm.stopSpeaking();
      },
      onInterim(text) {
        setInputValue(text);
        setIsInterim(true);
      },
      onResult(text) {
        setInputValue(text);
        setIsInterim(false);
        setStatus({ msg: `✓ Heard: "${text}"`, type: "success" });
        setTimeout(() => {
          onSubmit(text);
        }, 600);
      },
      onError(msg) {
        setIsListening(false);
        setIsInterim(false);
        setStatus({ msg: `⚠ ${msg}`, type: "error" });
      },
      onEnd() {
        setIsListening(false);
        setIsInterim(false);
      },
    });
  };

  return (
    <div className="vi-root">
      <div className="vi-lang-row">
        <label htmlFor="langSelect" className="vi-lang-label">
          Language:
        </label>
        <select
          id="langSelect"
          value={lang}
          onChange={handleLangChange}
          className="vi-lang-select"
          aria-label="Select voice language"
        >
          <option value="en">English (India)</option>
          <option value="hi">Hindi</option>
          <option value="pa">Punjabi</option>
        </select>

        <div
          className={`vi-wave ${isListening ? "vi-wave--active" : ""}`}
          aria-hidden="true"
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} style={{ animationDelay: `${i * 0.12}s` }} />
          ))}
        </div>
      </div>

      <div className="vi-input-row">
        <input
          type="text"
          id="userInput"
          className={`vi-input ${isInterim ? "vi-input--interim" : ""}`}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='e.g. "Wheat price in Ludhiana"'
          disabled={isLoading}
          autoComplete="off"
          aria-label="Type or speak your crop price query"
        />

        <button
          type="button"
          className={`vi-mic-btn ${isListening ? "vi-mic-btn--active" : ""}`}
          onClick={handleMicClick}
          disabled={isLoading}
          aria-label={isListening ? "Stop listening" : "Start voice input"}
          title="Click to speak your query"
        >
          🎤
        </button>
      </div>

      <StatusBadge message={status.msg} type={status.type} />

      <button
        type="button"
        className="vi-submit-btn"
        onClick={handleSubmit}
        disabled={isLoading || !inputValue.trim()}
        aria-label="Get price prediction"
      >
        {isLoading ? "Fetching…" : "Get Prediction →"}
      </button>

      <style>{`
        .vi-root {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          width: 100%;
        }

        .vi-lang-row {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-wrap: wrap;
        }
        .vi-lang-label {
          font-size: 0.82rem;
          color: var(--foreground);
          opacity: 0.6;
          white-space: nowrap;
        }
        .vi-lang-select {
          background: var(--background);
          color: var(--foreground);
          border: 1px solid rgba(128,128,128,0.25);
          border-radius: 6px;
          padding: 0.3em 0.65em;
          font-size: 0.82rem;
          cursor: pointer;
          outline: none;
          transition: border-color 0.2s;
        }
        .vi-lang-select:hover,
        .vi-lang-select:focus {
          border-color: rgba(128,128,128,0.5);
        }

        .vi-wave {
          display: flex;
          align-items: center;
          gap: 2px;
          height: 16px;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .vi-wave--active { opacity: 1; }
        .vi-wave span {
          display: block;
          width: 3px;
          border-radius: 2px;
          background: var(--foreground);
          opacity: 0.7;
          animation: waveBar 0.85s ease-in-out infinite;
        }
        .vi-wave span:nth-child(1) { height: 5px; }
        .vi-wave span:nth-child(2) { height: 10px; }
        .vi-wave span:nth-child(3) { height: 15px; }
        .vi-wave span:nth-child(4) { height: 9px; }
        .vi-wave span:nth-child(5) { height: 5px; }

        @keyframes waveBar {
          0%,100% { transform: scaleY(0.35); }
          50%      { transform: scaleY(1); }
        }

        .vi-input-row {
          display: flex;
          gap: 0.5rem;
        }
        .vi-input {
          flex: 1;
          background: var(--background);
          color: var(--foreground);
          border: 1px solid rgba(128,128,128,0.25);
          border-radius: 8px;
          padding: 0.65rem 0.9rem;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: inherit;
        }
        .vi-input::placeholder { opacity: 0.4; }
        .vi-input:focus {
          border-color: rgba(128,128,128,0.5);
          box-shadow: 0 0 0 3px rgba(128,128,128,0.08);
        }
        .vi-input--interim {
          font-style: italic;
          opacity: 0.7;
          animation: inputPulse 1s ease-in-out infinite alternate;
        }
        @keyframes inputPulse {
          from { border-color: rgba(59,130,246,0.4); }
          to   { border-color: rgba(59,130,246,0.8); }
        }
        .vi-input:disabled { opacity: 0.4; cursor: not-allowed; }

        .vi-mic-btn {
          width: 44px;
          height: 44px;
          flex-shrink: 0;
          border-radius: 50%;
          border: 1px solid rgba(128,128,128,0.25);
          background: var(--background);
          font-size: 1.1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, border-color 0.2s, box-shadow 0.2s, transform 0.12s;
          outline: none;
        }
        .vi-mic-btn:hover:not(:disabled) {
          border-color: rgba(128,128,128,0.5);
        }
        .vi-mic-btn:active:not(:disabled) { transform: scale(0.94); }
        .vi-mic-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .vi-mic-btn--active {
          border-color: rgba(59,130,246,0.6);
          box-shadow: 0 0 0 4px rgba(59,130,246,0.12),
                      0 0 14px rgba(59,130,246,0.2);
          animation: micPulse 1.2s ease-in-out infinite;
        }
        @keyframes micPulse {
          0%,100% { box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
          50%      { box-shadow: 0 0 0 7px rgba(59,130,246,0.06), 0 0 20px rgba(59,130,246,0.18); }
        }

        .vi-submit-btn {
          width: 100%;
          padding: 0.75rem;
          background: var(--foreground);
          color: var(--background);
          border: none;
          border-radius: 8px;
          font-size: 0.95rem;
          font-family: inherit;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.12s;
          outline: none;
        }
        .vi-submit-btn:hover:not(:disabled) { opacity: 0.85; }
        .vi-submit-btn:active:not(:disabled) { transform: scale(0.98); }
        .vi-submit-btn:disabled { opacity: 0.35; cursor: not-allowed; }
      `}</style>
    </div>
  );
}