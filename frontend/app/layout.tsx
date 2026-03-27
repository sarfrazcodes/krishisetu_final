import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import NetworkWarning from "@/components/NetworkWarning";
import TranslationProvider from "@/components/TranslationProvider";
import AuthGuard from "@/components/AuthGuard";

export const metadata: Metadata = {
  title: "KrishiSetu | AI Agricultural Platform",
  description: "Next-gen insights for commodities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning={true}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning={true}>
        <TranslationProvider>
          <AuthGuard>
            {children}
            <NetworkWarning />
          </AuthGuard>
        </TranslationProvider>
      </body>
    </html>
  );
}
