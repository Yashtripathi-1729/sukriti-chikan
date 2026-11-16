import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sukriti Chikan — Hand-embroidered Chikankari from Lucknow",
  description:
    "Kurtis, suits, sarees and dupattas in hand-embroidered Lucknowi Chikankari, made in small batches with artisan families. Order on WhatsApp.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="min-h-screen bg-cream text-gray-800 font-serif">
        {children}
      </body>
    </html>
  );
}
