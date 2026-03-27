"use client";

import React, { createContext, useContext, useState, useEffect, useLayoutEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";

// Silence Next.js Hydration Errors caused by active Client-Side DOM Mutation Translators!
if (typeof window !== "undefined") {
   const originalError = console.error;
   console.error = (...args) => {
      if (typeof args[0] === "string" && (
         args[0].includes("Hydration failed") ||
         args[0].includes("Text content does not match") ||
         args[0].includes("Warning: Text content did not match")
      )) {
         return;
      }
      originalError(...args);
   };
}

type TranslationContextType = {
   language: string;
   setLanguage: (lang: string) => void;
   t: (text: string) => string;
};

const TranslationContext = createContext<TranslationContextType>({
   language: "en",
   setLanguage: () => { },
   t: (t) => t,
});

export const useTranslation = () => useContext(TranslationContext);

const globalDictionary: Record<string, Record<string, string>> = {};

export default function TranslationProvider({ children }: { children: ReactNode }) {
   const [language, setLanguageState] = useState("en");
   const [dictionary, setDictionary] = useState<Record<string, string>>({});
   const [isTranslating, setIsTranslating] = useState(false);
   const pathname = usePathname();

   // 0. Auto-Scroll & Route Change Hiding Engine
   useEffect(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      if (language !== "en") {
         setIsTranslating(true); // Mask Next.js route transition
         // Failsafe release if observer catches 0 nodes
         setTimeout(() => setIsTranslating(false), 800);
      }
   }, [pathname, language]);

   // 0.5 Hydration Lock Failsafe
   const [isHydrated, setIsHydrated] = useState(false);
   useEffect(() => {
      setIsHydrated(true);
   }, []);

   // 1. Load persisted language securely & Fetch master dictionary from Local Server Cache
   useEffect(() => {
      fetch("/api/translate").then(r => r.json()).then(data => {
         if (data && data.dictionary) {
            for (const lang in data.dictionary) globalDictionary[lang] = data.dictionary[lang];
         }
      }).catch(() => {});

      const saved = localStorage.getItem("krishisetu_lang");
      if (saved && saved !== "en") {
         setLanguageState(saved);
         setIsTranslating(true); // Hide English until first translation resolves
         setDictionary(globalDictionary[saved] || {});
      }
   }, []);

   const setLanguage = (lang: string) => {
      localStorage.setItem("krishisetu_lang", lang);
      window.location.reload(); // Force full React un-hydration to flush dirty mutated DOM nodes globally
   };

   // 1. Queue to batch fast-firing translate calls from rendering components
   const translateQueue = React.useRef<Set<string>>(new Set());
   const timeoutRef = React.useRef<any>(null);

   const processQueue = async () => {
      const texts = Array.from(translateQueue.current);
      translateQueue.current.clear();
      if (texts.length === 0 || language === "en") return;

      try {
         const res = await fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ texts, targetLang: language }),
         });
         const data = await res.json();

         setDictionary(prev => {
            const next = { ...prev };
            texts.forEach((txt, i) => {
               if (data.results[i]) {
                  next[txt] = data.results[i];
                  if (!globalDictionary[language]) globalDictionary[language] = {};
                  globalDictionary[language][txt] = data.results[i];
               }
            });
            return next;
         });
      } catch (err) {
         console.error("Translation sync failed:", err);
      }
   };

   const t = (text: string) => {
      if (!text || language === "en") return text;
      if (dictionary[text]) return dictionary[text];

      // Auto-queue unknown strings
      if (!translateQueue.current.has(text)) {
         translateQueue.current.add(text);
         if (timeoutRef.current) clearTimeout(timeoutRef.current);
         timeoutRef.current = setTimeout(processQueue, 50); // 50ms batching threshold (Zero Lag UI)
      }
      return text; // Return english momentarily while fetching translation
   };

   // Native String Dictionary & DOM Overrides handled below.
   // 3. Ultra-fast Pre-Paint DOM Mutation Observer blocks English flash globally
   useLayoutEffect(() => {
      // CRITICAL: Block DOM Mutations completely until React visually finishes the initial 
      // Server-Side-Render matching loop (Hydration) to circumvent the Next.js Error Overlay Crash.
      if (!isHydrated || language === "en" || typeof document === "undefined") return;

      let timeout: any;
      const pendingNodes = new Set<Text>();

      const scanAndTranslateTextNodes = async () => {
         const textsToTranslate = new Set<string>();
         const nodeMap = new Map<string, Text[]>(); // Group same-text nodes

         pendingNodes.forEach(node => {
            const txt = node.nodeValue?.trim();
            if (txt && txt.length > 1 && /[a-zA-Z]/.test(txt)) {
               // Guard Brand Name & Languages from literal destruction
               if (node.parentElement && node.parentElement.tagName !== "SCRIPT" && node.parentElement.tagName !== "STYLE") {
                  const lowerTxt = txt.toLowerCase();
                  if (lowerTxt === "english" || lowerTxt === "hindi" || lowerTxt === "punjabi") return;
                  if (txt === "हिन्दी" || txt === "ਪੰਜਾਬੀ") return;

                  if (!globalDictionary[language]?.[txt]) {
                     textsToTranslate.add(txt);
                     if (!nodeMap.has(txt)) nodeMap.set(txt, []);
                     nodeMap.get(txt)!.push(node);
                  }
               }
            }
         });
         pendingNodes.clear();

         const uniqueTexts = Array.from(textsToTranslate);
         if (uniqueTexts.length === 0) {
            setIsTranslating(false);
            return;
         }

         try {
            // Bulk fetch
            const res = await window.fetch("/api/translate", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ texts: uniqueTexts, targetLang: language }),
            });
            const tData = await res.json();

            if (!globalDictionary[language]) globalDictionary[language] = {};

            // Apply back to nodes directly
            uniqueTexts.forEach((txt, i) => {
               const translation = tData.results[i];
               if (translation) {
                  globalDictionary[language][txt] = translation;
                  setDictionary(prev => ({ ...prev, [txt]: translation }));
                  nodeMap.get(txt)?.forEach(node => {
                     if (node.nodeValue) {
                        node.nodeValue = translation;
                     }
                  });
               }
            });
         } catch (e) {
            console.warn("Translation API failed:", e);
         } finally {
            setIsTranslating(false); // Unblock screen after first massive pass
         }
      };

      // Instant Synchronous Replacement engine (Zero Flash)
      const instantlyReplaceCachedNodes = (nodes: Text[]) => {
         nodes.forEach(node => {
            const txt = node.nodeValue?.trim();
            if (txt && txt.length > 1 && globalDictionary[language]?.[txt]) {
               if (node.parentElement && node.parentElement.tagName !== "SCRIPT" && node.parentElement.tagName !== "STYLE") {
                  node.nodeValue = globalDictionary[language][txt];
               }
            } else if (txt && txt.length > 1 && /[a-zA-Z]/.test(txt)) {
               pendingNodes.add(node);
            }
         });
      };

      // Deep tree scan on mount
      const initialNodes: Text[] = [];
      const treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let currentNode = treeWalker.nextNode();
      while (currentNode) {
         initialNodes.push(currentNode as Text);
         currentNode = treeWalker.nextNode();
      }
      instantlyReplaceCachedNodes(initialNodes);
      
      if (pendingNodes.size > 0) {
         scanAndTranslateTextNodes();
      } else {
         setIsTranslating(false); // CRITICAL: Release UI layer instantly if 100% of nodes matched the local JSON Dictionary!
      }

      // Listen to new nodes mounting
      const observer = new MutationObserver((mutations) => {
         const newTextNodes: Text[] = [];
         mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
               if (node.nodeType === Node.TEXT_NODE) newTextNodes.push(node as Text);
               else if (node.nodeType === Node.ELEMENT_NODE) {
                  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
                  let n = walker.nextNode();
                  while (n) { newTextNodes.push(n as Text); n = walker.nextNode(); }
               }
            });
         });

         instantlyReplaceCachedNodes(newTextNodes); // PRE-PAINT FLUSH IMPERATIVE!

         if (pendingNodes.size > 0) {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(scanAndTranslateTextNodes, 150); // Fetch network delay only
         }
      });

      observer.observe(document.body, { childList: true, subtree: true });

      return () => {
         observer.disconnect();
         if (timeout) clearTimeout(timeout);
      };
   }, [language]);

   return (
      <TranslationContext.Provider value={{ language, setLanguage, t }}>
         {isTranslating && (
            <div className="fixed inset-0 z-[9999] bg-[#FDFBF7] flex flex-col items-center justify-center animate-out fade-out duration-300 pointer-events-none">
               <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
               <p className="text-emerald-800 font-bold text-sm tracking-widest uppercase">Converting Native Language...</p>
            </div>
         )}
         {children}
      </TranslationContext.Provider>
   );
}
