import Link from "next/link";
import { whatsappLink } from "@/lib/catalog";

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="bel" aria-hidden="true" style={{ top: 0, opacity: 0.25 }} />
      <div className="wrap" style={{ position: "relative", display: "flex", flexDirection: "column", gap: 48 }}>
        <div className="cols">
          <div style={{ gridColumn: "span 6", display: "flex", flexDirection: "column", gap: 14 }}>
            <span className="brand" style={{ color: "var(--ivory)" }}>
              Sukriti Chikan
            </span>
            <p style={{ fontSize: 14, lineHeight: 1.7, maxWidth: 380 }}>
              Hand-embroidered Chikankari from Lucknow, Uttar Pradesh. Made in small batches with artisan families.
            </p>
          </div>
          <div style={{ gridColumn: "span 3", display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
            <span className="label">Shop</span>
            <Link href="/#collections">The collection</Link>
            <Link href="/#size">Size guide</Link>
            <Link href="/cart">Your bag</Link>
          </div>
          <div style={{ gridColumn: "span 3", display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
            <span className="label">Help</span>
            <Link href="/#size">Care</Link>
            <Link href="/#contact">Contact</Link>
            <a href={whatsappLink()} target="_blank" rel="noopener">
              WhatsApp
            </a>
          </div>
        </div>
        <div className="legal">
          <span>&copy; {new Date().getFullYear()} Sukriti Chikan · Prices in INR, inclusive of GST</span>
          <span>Lucknow, Uttar Pradesh, India</span>
        </div>
      </div>
    </footer>
  );
}
