import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";

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
      <body className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        {children}
        <Script
          defer
          src="https://analytics.theblogrammer.com:8443/script.js"
          data-website-id="c39655af-d491-479b-9add-e3f723e8da55"
        />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
