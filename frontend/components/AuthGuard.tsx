"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Basic Auth Check
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    let user = null;
    try {
      user = JSON.parse(localStorage.getItem("user") || "null");
    } catch(e) {}

    const isAuth = !!(token && user);
    
    // Core routes definition
    const isPublicOnly = pathname === "/" || pathname === "/login" || pathname === "/register";
    const isDashboard = pathname.includes("dashboard");

    if (isAuth) {
      // 1. Logged in: Block Home/Login/Register and redirect to Dashboard
      if (isPublicOnly) {
         router.replace(user?.role === "buyer" ? "/buyer-dashboard" : "/farmer-dashboard");
      } 
      // 2. Prevent role crossing (Buyers accessing Farmer dashboard etc.)
      else if (pathname.includes("farmer-dashboard") && user?.role === "buyer") {
         router.replace("/buyer-dashboard");
      } 
      else if (pathname.includes("buyer-dashboard") && user?.role !== "buyer") {
         router.replace("/farmer-dashboard");
      }
      else {
         setAuthorized(true);
      }
    } else {
      // 3. Not Logged in: Block Dashboards
      if (isDashboard) {
         router.replace("/login");
      } else {
         setAuthorized(true);
      }
    }
  }, [pathname, router]);

  // Flash Masking to prevent unauthorized views natively
  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#FDF8EE] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}
