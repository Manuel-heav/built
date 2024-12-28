import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { GoogleAnalytics } from "@next/third-parties/google";
import LogLib from "@loglib/tracker/react";
import { ThemeProvider } from "@/components/theme/theme-provider";

export const metadata: Metadata = {
  title: "Built | Projects For Developers",
  description: "Where you find all the best projects",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <body 
        className="absolute inset-0 -z-10 h-full w-full bg-background
          [background-image:var(--background-pattern)]
          [background-size:14px_24px]
          transition-colors duration-300"
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <GoogleAnalytics gaId="G-YLFT1NCPY2" />
        <LogLib
          config={{
            id: "built-iota_vercel",
          }}
        />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
