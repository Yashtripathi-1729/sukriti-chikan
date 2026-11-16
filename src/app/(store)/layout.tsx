import { Cormorant_Garamond, Tenor_Sans } from "next/font/google";
import { CartProvider } from "@/components/store/CartContext";
import SiteHeader from "@/components/store/SiteHeader";
import SiteFooter from "@/components/store/SiteFooter";
import "./store.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const body = Tenor_Sans({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-body",
});

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`store ${display.variable} ${body.variable}`}>
      <CartProvider>
        <div className="grain" aria-hidden="true" />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </CartProvider>
    </div>
  );
}
