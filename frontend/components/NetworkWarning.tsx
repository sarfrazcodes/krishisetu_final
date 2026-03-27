"use client";

import { useEffect, useState } from "react";
import { WifiOff, AlertTriangle } from "lucide-react";

export default function NetworkWarning() {
  const [isSlow, setIsSlow] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const updateNetworkStatus = () => {
      // Check offline status first
      if (!navigator.onLine) {
        setIsOffline(true);
        setIsSlow(false);
        return;
      }
      setIsOffline(false);

      // Check for strictly slow connection if the NetworkInformation API is supported
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        if (connection && (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g')) {
          setIsSlow(true);
        } else {
          setIsSlow(false);
        }
      }
    };

    // Initial check
    updateNetworkStatus();

    // Listeners for online/offline toggles
    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);

    // Listener for connection speed changes (Chrome/Android)
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      connection.addEventListener('change', updateNetworkStatus);
    }

    return () => {
      window.removeEventListener("online", updateNetworkStatus);
      window.removeEventListener("offline", updateNetworkStatus);
      if ('connection' in navigator) {
         const connection = (navigator as any).connection;
         connection.removeEventListener('change', updateNetworkStatus);
      }
    };
  }, []);

  if (!mounted) return null;
  if (!isSlow && !isOffline) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[9999] px-4 w-full max-w-sm animate-in slide-in-from-bottom duration-500">
      <div className={`flex items-center gap-3 p-4 rounded-2xl shadow-2xl border ${isOffline ? 'bg-red-50 border-red-200 shadow-red-500/10' : 'bg-orange-50 border-orange-200 shadow-orange-500/10'}`}>
        <div className={`p-2 rounded-full ${isOffline ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
          {isOffline ? <WifiOff className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
        </div>
        <div>
          <h4 className={`text-sm font-bold ${isOffline ? 'text-red-900' : 'text-orange-900'}`}>
            {isOffline ? 'No Internet Connection' : 'Slow Connection Detected'}
          </h4>
          <p className={`text-xs mt-0.5 font-medium ${isOffline ? 'text-red-700' : 'text-orange-700'}`}>
            {isOffline 
              ? 'You are offline. KrishiSetu will reload when connection is restored.' 
              : 'Data may take longer to load due to weak network strength.'}
          </p>
        </div>
      </div>
    </div>
  );
}
