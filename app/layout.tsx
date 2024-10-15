import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Built | Projects for developers",
  description: "Where you find all the best projects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
          {children}
      </body>
    </html>
  );
}
