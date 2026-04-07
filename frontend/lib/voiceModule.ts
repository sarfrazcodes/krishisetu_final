// @ts-nocheck
/**
 * lib/voiceModule.ts
 * ─────────────────────────────────────────────────────────
 * Pure voice logic — zero DOM coupling, zero React coupling.
 * Safe to import in any client component via dynamic import.
 *
 * Exports a singleton: VoiceModule
 * ─────────────────────────────────────────────────────────
 */

/* ── Browser type augmentation ─────────────────────────── */
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

/* ── Public types ──────────────────────────────────────── */
export type SupportedLang = "en" | "hi" | "pa";

export interface STTCallbacks {
  onStart?: () => void;
  onInterim?: (text: string) => void;
  onResult?: (text: string) => void;
  onError?: (message: string) => void;
  onEnd?: () => void;
}

export interface TTSOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
}

/* ── Language map ──────────────────────────────────────── */
const LANG_MAP: Record<SupportedLang, string> = {
  en: "en-IN",
  hi: "hi-IN",
  pa: "pa-IN",
};

/* ── Error map ─────────────────────────────────────────── */
const STT_ERRORS: Record<string, string> = {
  "not-allowed":         "Microphone permission denied. Please allow mic access in your browser.",
  "no-speech":           "No speech detected. Please try speaking again.",
  network:               "Network error during speech recognition.",
  aborted:               "Listening was cancelled.",
  "audio-capture":       "No microphone found on this device.",
  "service-not-allowed": "Speech service blocked. Ensure you are on HTTPS or localhost.",
};

/* ── VoiceModule (singleton IIFE) ──────────────────────── */
const VoiceModule = (() => {
  let recognition: SpeechRecognition | null = null;
  let _isListening = false;
  let _activeLang: string = LANG_MAP.en;

  /* ── Support flags ─────────────────────────────────── */
  const isSTTSupported = (): boolean =>
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const isTTSSupported = (): boolean =>
    typeof window !== "undefined" && "speechSynthesis" in window;

  const isListening = (): boolean => _isListening;

  const isSpeaking = (): boolean =>
    isTTSSupported() && window.speechSynthesis.speaking;

  /* ── Language control ──────────────────────────────── */
  const setLanguage = (lang: SupportedLang): void => {
    _activeLang = LANG_MAP[lang] ?? LANG_MAP.en;
  };

  const getLanguage = (): string => _activeLang;

  /* ── STT internals ─────────────────────────────────── */
  function _buildRecognition(): SpeechRecognition {
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    const r = new SR();
    r.lang = _activeLang;
    r.continuous = false;
    r.interimResults = true;
    r.maxAlternatives = 1;
    return r;
  }

  /* ── STT public ────────────────────────────────────── */
  function startListening(callbacks: STTCallbacks = {}): void {
    if (!isSTTSupported()) {
      callbacks.onError?.(
        "Speech recognition is not supported in this browser. Please use Chrome or Edge."
      );
      return;
    }

    if (_isListening) {
      stopListening();
      return;
    }

    recognition = _buildRecognition();
    _isListening = true;

    recognition.onstart = () => callbacks.onStart?.();

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        event.results[i].isFinal ? (final += t) : (interim += t);
      }

      if (interim) callbacks.onInterim?.(interim);
      if (final)   callbacks.onResult?.(final.trim());
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      _isListening = false;
      const msg = STT_ERRORS[event.error] ?? `Speech error: ${event.error}`;
      callbacks.onError?.(msg);
    };

    recognition.onend = () => {
      _isListening = false;
      callbacks.onEnd?.();
    };

    recognition.start();
  }

  function stopListening(): void {
    if (recognition && _isListening) {
      recognition.stop();
      _isListening = false;
    }
  }

  /* ── TTS public ────────────────────────────────────── */
  const selectBestVoice = (voices: SpeechSynthesisVoice[], targetLang: string): SpeechSynthesisVoice | null => {
    const normalizedTarget = targetLang.replace('_', '-').toLowerCase();
    const isFemaleVoice = (voice: SpeechSynthesisVoice) =>
      /female|woman|girl|féminin|feminine/i.test(`${voice.name} ${voice.voiceURI}`);

    const exactMatches = voices.filter(
      (voice) => voice.lang.replace('_', '-').toLowerCase() === normalizedTarget
    );
    const exactFemale = exactMatches.find(isFemaleVoice);
    if (exactFemale) return exactFemale;
    if (exactMatches.length) return exactMatches[0];

    const primary = normalizedTarget.split('-')[0];
    const startsWithMatches = voices.filter((voice) =>
      voice.lang.replace('_', '-').toLowerCase().startsWith(primary)
    );
    const startsWithFemale = startsWithMatches.find(isFemaleVoice);
    if (startsWithFemale) return startsWithFemale;
    if (startsWithMatches.length) return startsWithMatches[0];

    if (primary === 'pa') {
      const hindiMatches = voices.filter((voice) =>
        voice.lang.replace('_', '-').toLowerCase().startsWith('hi')
      );
      const hindiFemale = hindiMatches.find(isFemaleVoice);
      if (hindiFemale) return hindiFemale;
      if (hindiMatches.length) return hindiMatches[0];
    }

    return null;
  };

  function speak(text: string, opts: TTSOptions = {}): void {
    if (!isTTSSupported()) {
      console.warn("[VoiceModule] TTS not supported in this browser.");
      return;
    }

    stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang  = opts.lang  ?? _activeLang;
    utterance.rate  = opts.rate  ?? 0.95;
    utterance.pitch = opts.pitch ?? 1;

    const voices = window.speechSynthesis.getVoices();
    const bestVoice = selectBestVoice(voices, utterance.lang);
    if (bestVoice) utterance.voice = bestVoice;

    utterance.onstart = () => opts.onStart?.();
    utterance.onend   = () => opts.onEnd?.();
    utterance.onerror = (e) => console.error("[VoiceModule] TTS error:", e.error);

    window.speechSynthesis.speak(utterance);
  }

  function stopSpeaking(): void {
    if (isTTSSupported() && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
  }

  /* ── Public API ────────────────────────────────────── */
  return {
    startListening,
    stopListening,
    isListening,
    isSTTSupported,
    speak,
    stopSpeaking,
    isSpeaking,
    isTTSSupported,
    setLanguage,
    getLanguage,
    LANG_MAP,
  } as const;
})();

export default VoiceModule;