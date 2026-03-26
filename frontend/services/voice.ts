// =============================================================================
// services/voice.ts
// =============================================================================
// PURPOSE: This file is the "adapter" between your app and the browser's
// Web Speech API. It handles all the messy browser-compatibility details
// so the rest of your code doesn't have to worry about them.
//
// Think of it like a plug adapter — your app speaks one language,
// the browser speaks another, this file translates.
// =============================================================================
 
// -----------------------------------------------------------------------------
// STEP 1: Type Definitions
// -----------------------------------------------------------------------------
// TypeScript doesn't include Web Speech API types by default in all setups,
// so we declare them manually here. This tells TypeScript "trust me, these
// things exist on the window object in supported browsers."
 
// The SpeechRecognition interface (standard browsers like Chrome, Edge)
interface ISpeechRecognition extends EventTarget {
  continuous: boolean;        // Keep listening after each phrase? true = yes
  interimResults: boolean;    // Return partial (not-yet-final) results?
  lang: string;               // Language code e.g. "en-US" or "hi-IN"
  maxAlternatives: number;    // How many alternative transcripts to return
  start(): void;              // Start listening
  stop(): void;               // Stop gracefully (finishes current utterance)
  abort(): void;              // Stop immediately, discard current utterance
 
  // Event handlers — these are called automatically by the browser
  onstart: ((this: ISpeechRecognition, ev: Event) => void) | null;
  onend: ((this: ISpeechRecognition, ev: Event) => void) | null;
  onerror: ((this: ISpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((this: ISpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
}
 
// The SpeechRecognitionEvent carries the actual transcribed text
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}
 
// Each result has one or more alternatives (transcriptions)
interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}
 
interface SpeechRecognitionResult {
  readonly isFinal: boolean;        // Is this the final transcription?
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}
 
interface SpeechRecognitionAlternative {
  readonly transcript: string;      // The actual text
  readonly confidence: number;      // How confident the browser is (0 to 1)
}
 
interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;           // e.g. "not-allowed", "no-speech", "network"
  readonly message: string;
}
 
// Extend the global Window type to include webkit-prefixed version
// Safari and older browsers use "webkitSpeechRecognition" instead of "SpeechRecognition"
declare global {
  interface Window {
    SpeechRecognition: new () => ISpeechRecognition;
    webkitSpeechRecognition: new () => ISpeechRecognition;
  }
}
 
// -----------------------------------------------------------------------------
// STEP 2: Supported Languages
// -----------------------------------------------------------------------------
// We export this so your UI can show a language picker.
// The keys are human-readable labels; values are BCP-47 language codes.
// Full list: https://cloud.google.com/speech-to-text/docs/languages
 
export const SUPPORTED_LANGUAGES: Record<string, string> = {
  "English (US)": "en-US",
  "English (UK)": "en-GB",
  "Hindi": "hi-IN",
  "Punjabi": "pa-IN",
  "Spanish": "es-ES",
  "French": "fr-FR",
  "German": "de-DE",
  "Japanese": "ja-JP",
};
 
export type SupportedLanguageLabel = keyof typeof SUPPORTED_LANGUAGES;
 
// -----------------------------------------------------------------------------
// STEP 3: Configuration Options
// -----------------------------------------------------------------------------
// Anyone creating a recognition instance can pass these options to customize behavior.
 
export interface VoiceServiceOptions {
  language?: string;          // BCP-47 code, defaults to "en-US"
  continuous?: boolean;       // Keep listening? Defaults to true
  interimResults?: boolean;   // Show partial text? Defaults to true
  maxAlternatives?: number;   // How many alternatives? Defaults to 1
}
 
// -----------------------------------------------------------------------------
// STEP 4: Browser Compatibility Check
// -----------------------------------------------------------------------------
// Not all browsers support the Web Speech API.
// This function checks BEFORE we try to use it, so we can show a nice error
// instead of crashing.
 
export function isSpeechRecognitionSupported(): boolean {
  // Check both the standard and webkit-prefixed versions
  return (
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
  );
}
 
// -----------------------------------------------------------------------------
// STEP 5: Create a SpeechRecognition Instance
// -----------------------------------------------------------------------------
// This is the main factory function. It creates and configures a recognition
// object based on the options you pass.
//
// Returns: A configured SpeechRecognition instance, or null if not supported.
 
export function createSpeechRecognition(
  options: VoiceServiceOptions = {}
): ISpeechRecognition | null {
  // If the browser doesn't support it, return null so the caller can handle it
  if (!isSpeechRecognitionSupported()) {
    console.warn(
      "[VoiceService] Web Speech API is not supported in this browser. " +
      "Try Chrome or Edge."
    );
    return null;
  }
 
  // Use the standard API if available, otherwise fall back to the webkit version
  // The "|| window.webkitSpeechRecognition" is the fallback for Safari/older Chrome
  const SpeechRecognitionConstructor =
    window.SpeechRecognition || window.webkitSpeechRecognition;
 
  // Create a new instance
  const recognition = new SpeechRecognitionConstructor();
 
  // Apply options with sensible defaults
  // The "??" operator means: "use the right side if the left side is null/undefined"
  recognition.lang = options.language ?? "en-US";
  recognition.continuous = options.continuous ?? true;
  recognition.interimResults = options.interimResults ?? true;
  recognition.maxAlternatives = options.maxAlternatives ?? 1;
 
  return recognition;
}
 
// -----------------------------------------------------------------------------
// STEP 6: Parse the Result Event into Plain Text
// -----------------------------------------------------------------------------
// The SpeechRecognitionEvent is complex and nested. This helper flattens it
// into two simple strings: the final transcript and the interim transcript.
//
// FINAL vs INTERIM:
//   - Interim: "hello wor" — still being spoken, may change
//   - Final:   "hello world" — speaker paused, browser committed to this text
 
export interface ParsedTranscript {
  final: string;    // Completed, confident transcription
  interim: string;  // In-progress transcription (useful for live feedback)
}
 
export function parseTranscriptFromEvent(
  event: SpeechRecognitionEvent
): ParsedTranscript {
  let finalTranscript = "";
  let interimTranscript = "";
 
  // Loop through all results in this event
  // (There can be multiple if continuous mode is on and the user spoke multiple sentences)
  for (let i = event.resultIndex; i < event.results.length; i++) {
    const result = event.results[i];
    const text = result[0].transcript; // [0] = first alternative (most likely)
 
    if (result.isFinal) {
      // This sentence is done — append it with a space
      finalTranscript += text + " ";
    } else {
      // Still being spoken — overwrite (don't append) for live feedback
      interimTranscript = text;
    }
  }
 
  return {
    final: finalTranscript.trim(),
    interim: interimTranscript.trim(),
  };
}
 
// -----------------------------------------------------------------------------
// STEP 7: Human-Readable Error Messages
// -----------------------------------------------------------------------------
// The Web Speech API returns cryptic error codes like "not-allowed" or "no-speech".
// This function translates them into messages you can show to your users.
 
export function getErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    "not-allowed":
      "Microphone access was denied. Please allow microphone permission in your browser settings.",
    "no-speech":
      "No speech was detected. Please speak clearly and try again.",
    "audio-capture":
      "No microphone was found. Please connect a microphone and try again.",
    "network":
      "A network error occurred. Please check your internet connection.",
    "aborted":
      "Speech recognition was stopped.",
    "bad-grammar":
      "Speech recognition encountered a grammar error. Please try again.",
    "language-not-supported":
      "The selected language is not supported by your browser.",
    "service-not-allowed":
      "Speech recognition service is not allowed. Try using HTTPS.",
  };
 
  // Return the specific message, or a generic fallback
  return (
    errorMessages[errorCode] ??
    `An unknown error occurred: "${errorCode}". Please try again.`
  );
}
 
// -----------------------------------------------------------------------------
// STEP 8: Backend Integration Helper
// -----------------------------------------------------------------------------
// Once you have a transcript, you might want to send it to your server.
// This is a reusable fetch helper for that purpose.
//
// Usage:
//   await sendTranscriptToBackend("http://localhost:3001/api/transcript", "hello world")
 
export interface TranscriptPayload {
  transcript: string;
  language: string;
  timestamp: string;
}
 
export async function sendTranscriptToBackend(
  apiUrl: string,
  transcript: string,
  language: string = "en-US"
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const payload: TranscriptPayload = {
      transcript,
      language,
      timestamp: new Date().toISOString(), // e.g. "2024-01-15T10:30:00.000Z"
    };
 
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add your auth token here if needed:
        // "Authorization": `Bearer ${yourToken}`
      },
      body: JSON.stringify(payload),
    });
 
    // Check if the HTTP request itself succeeded (status 200-299)
    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }
 
    const data = await response.json();
    return { success: true, message: data.message };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[VoiceService] Failed to send transcript:", message);
    return { success: false, error: message };
  }
}