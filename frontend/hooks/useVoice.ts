// =============================================================================
// hooks/useVoice.ts
// =============================================================================
// PURPOSE: This is a custom React hook. Hooks are functions that let you
// "hook into" React features (like state and lifecycle) from a regular function.
//
// This hook is the BRIDGE between the service layer (voice.ts) and your UI.
// It manages all the STATE (what changed?) and SIDE EFFECTS (do something
// when something changes) related to voice recognition.
//
// Rule of thumb: If your component needs to "do something over time" or
// "remember something", that logic belongs in a hook.
// =============================================================================

import { useState, useEffect, useRef, useCallback } from "react";
import {
  createSpeechRecognition,
  parseTranscriptFromEvent,
  getErrorMessage,
  isSpeechRecognitionSupported,
  VoiceServiceOptions,
} from "../services/voice";

// -----------------------------------------------------------------------------
// STEP 1: Define the Hook's Return Type
// -----------------------------------------------------------------------------
// This describes everything the hook gives back to the component that uses it.
// Exporting it lets other files use this type for their own props.

export interface UseVoiceReturn {
  // --- State ---
  isListening: boolean;     // Is the microphone currently active?
  transcript: string;       // The accumulated final transcript text
  interimTranscript: string; // The live, in-progress text (not yet final)
  error: string | null;     // Any error message, or null if no error
  isSupported: boolean;     // Does this browser support the Web Speech API?

  // --- Actions ---
  startListening: () => void;   // Call this to start the microphone
  stopListening: () => void;    // Call this to stop the microphone
  clearTranscript: () => void;  // Call this to reset the transcript to ""

  // --- Language Control ---
  currentLanguage: string;                  // The active BCP-47 language code
  setLanguage: (lang: string) => void;      // Call this to switch languages
}

// -----------------------------------------------------------------------------
// STEP 2: Hook Options
// -----------------------------------------------------------------------------

export interface UseVoiceOptions extends VoiceServiceOptions {
  // Called every time new final text arrives
  // Useful if parent component wants to react to new transcript text
  onTranscriptUpdate?: (transcript: string) => void;

  // Called if an error occurs — useful for parent-level error handling
  onError?: (error: string) => void;
}

// -----------------------------------------------------------------------------
// STEP 3: The Hook Itself
// -----------------------------------------------------------------------------
// Custom hooks MUST start with "use" — this is a React rule, not just a convention.
// It tells React "this function uses React features like state and effects".

export function useVoice(options: UseVoiceOptions = {}): UseVoiceReturn {
  // --- State Variables ---
  // useState returns [currentValue, setterFunction]
  // When the setter is called, React re-renders the component

  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [interimTranscript, setInterimTranscript] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<string>(
    options.language ?? "en-US"
  );

  // Check once if the browser supports the API
  // This doesn't need to be in state because it never changes during the session
  const isSupported = isSpeechRecognitionSupported();

  // --- Refs ---
  // useRef creates a "box" that holds a value WITHOUT causing re-renders.
  // We use it for the recognition instance because:
  //   1. We need it to persist across re-renders
  //   2. Changing it should NOT trigger a re-render (only state changes do that)
  //   3. We need to call .start() and .stop() on it directly

  const recognitionRef = useRef<ReturnType<typeof createSpeechRecognition>>(null);

  // We also keep a ref to the accumulated transcript so event handlers
  // can always access the latest value without needing it in their closure.
  // (This is a common React pattern to avoid "stale closure" bugs)
  const transcriptRef = useRef<string>("");

  // A ref to track if we intentionally stopped (vs browser auto-stopping)
  const intentionalStopRef = useRef<boolean>(false);

  // Keep options in a ref so event handlers always see the latest callbacks
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  });

  // -----------------------------------------------------------------------------
  // STEP 4: Initialize the Recognition Instance
  // -----------------------------------------------------------------------------
  // useEffect runs AFTER the component renders.
  // The dependency array [currentLanguage] means: re-run this effect
  // whenever currentLanguage changes. This is how we support language switching!

  useEffect(() => {
    // Don't do anything if the browser doesn't support it
    if (!isSupported) return;

    // If there's an existing instance running, stop it before creating a new one
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }

    // Create a fresh recognition instance with the current settings
    const recognition = createSpeechRecognition({
      language: currentLanguage,
      continuous: options.continuous ?? true,
      interimResults: options.interimResults ?? true,
      maxAlternatives: options.maxAlternatives ?? 1,
    });

    if (!recognition) return;

    // -------------------------------------------------------------------------
    // STEP 5: Attach Event Handlers
    // -------------------------------------------------------------------------
    // These are functions the BROWSER calls automatically when things happen.

    // Called when the microphone actually starts (not just when we call .start())
    recognition.onstart = () => {
      setIsListening(true);
      setError(null); // Clear any previous error when starting fresh
      intentionalStopRef.current = false;
      console.log("[useVoice] Listening started in:", currentLanguage);
    };

    // Called when the browser produces a transcript result
    recognition.onresult = (event) => {
      // Use our helper from voice.ts to parse the complex event object
      const { final, interim } = parseTranscriptFromEvent(event);

      // Update the live (interim) transcript for immediate visual feedback
      setInterimTranscript(interim);

      if (final) {
        // Append new final text to the existing accumulated transcript
        // We use the ref here to always get the LATEST transcript value
        const updatedTranscript = transcriptRef.current
          ? `${transcriptRef.current} ${final}`
          : final;

        // Update both the ref and the state
        transcriptRef.current = updatedTranscript;
        setTranscript(updatedTranscript);

        // Clear the interim text since that phrase is now final
        setInterimTranscript("");

        // Notify the parent component if they passed a callback
        optionsRef.current.onTranscriptUpdate?.(updatedTranscript);
      }
    };

    // Called when an error occurs
    recognition.onerror = (event) => {
      // "aborted" is not a real error — it's what happens when we call .abort()
      // We don't want to show an error message for intentional stops
      if (event.error === "aborted") return;

      // "no-speech" is common and non-critical — user just didn't speak
      // We log it but don't show a scary error to the user
      if (event.error === "no-speech") {
        console.log("[useVoice] No speech detected");
        return;
      }

      const humanReadableError = getErrorMessage(event.error);
      setError(humanReadableError);
      setIsListening(false);

      // Notify parent component about the error
      optionsRef.current.onError?.(humanReadableError);

      console.error("[useVoice] Error:", event.error, humanReadableError);
    };

    // Called when recognition stops — either intentionally or automatically
    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript(""); // Clear any hanging interim text

      // In continuous mode, the browser sometimes stops on its own (e.g., after
      // a long silence). We restart it automatically if the stop wasn't intentional.
      if (
        optionsRef.current.continuous &&
        !intentionalStopRef.current &&
        recognitionRef.current
      ) {
        try {
          // Small delay to prevent rapid restart loops
          setTimeout(() => {
            if (!intentionalStopRef.current && recognitionRef.current) {
              recognitionRef.current.start();
            }
          }, 300);
        } catch (e) {
          // This can happen if the component unmounted in the meantime — safe to ignore
          console.log("[useVoice] Could not restart recognition:", e);
        }
      }
    };

    // Save the configured instance to our ref
    recognitionRef.current = recognition;

    // -------------------------------------------------------------------------
    // STEP 6: Cleanup Function
    // -------------------------------------------------------------------------
    // This is CRITICAL. The function returned from useEffect runs when:
    //   1. The component unmounts (removed from the page)
    //   2. The effect re-runs (because currentLanguage changed)
    //
    // Without cleanup, you'd have a memory leak — the old recognition instance
    // would keep running in the background after the component is gone.

    return () => {
      intentionalStopRef.current = true;
      if (recognitionRef.current) {
        recognitionRef.current.abort();
        // Remove event handlers to prevent them firing after cleanup
        recognitionRef.current.onstart = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
      }
      console.log("[useVoice] Cleaned up recognition instance");
    };
  }, [currentLanguage, isSupported]); // Re-run when language changes

  // -----------------------------------------------------------------------------
  // STEP 7: Actions
  // -----------------------------------------------------------------------------
  // useCallback memoizes (caches) a function so it's not recreated on every render.
  // This is a performance optimization AND prevents infinite re-render loops
  // when these functions are passed as props to child components.

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError(
        "Your browser doesn't support speech recognition. Please use Chrome or Edge."
      );
      return;
    }

    if (!recognitionRef.current) {
      setError("Speech recognition is not initialized. Please refresh the page.");
      return;
    }

    if (isListening) {
      console.log("[useVoice] Already listening, ignoring start call");
      return;
    }

    try {
      setError(null); // Clear previous errors
      intentionalStopRef.current = false;
      recognitionRef.current.start();
    } catch (e) {
      // This can throw if recognition is already started
      const message = e instanceof Error ? e.message : "Failed to start";
      console.error("[useVoice] Start error:", message);
      setError(`Could not start microphone: ${message}`);
    }
  }, [isSupported, isListening]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;

    intentionalStopRef.current = true; // Mark as intentional so onend doesn't restart

    try {
      // .stop() finishes the current recognition, .abort() cancels immediately
      // We use stop() for a graceful finish that commits the last interim result
      recognitionRef.current.stop();
    } catch (e) {
      console.log("[useVoice] Stop error (safe to ignore):", e);
    }
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
    transcriptRef.current = "";
  }, []);

  const setLanguage = useCallback(
    (lang: string) => {
      // If currently listening, stop first then the language change
      // will trigger useEffect to re-initialize with the new language
      if (isListening) {
        intentionalStopRef.current = true;
        recognitionRef.current?.stop();
      }
      setCurrentLanguage(lang);
    },
    [isListening]
  );

  // -----------------------------------------------------------------------------
  // STEP 8: Return Everything the Component Needs
  // -----------------------------------------------------------------------------

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    clearTranscript,
    currentLanguage,
    setLanguage,
  };
}

// Export as default too for flexibility
export default useVoice;