import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sukriti Chikan - Handcrafted Lucknowi Chikankari",
  description:
    "Shop authentic handcrafted Lucknowi Chikankari kurtis, suits, sarees and more. Direct from artisans.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cream text-gray-800 font-serif">
        {children}
      </body>
    </html>
  );
}
