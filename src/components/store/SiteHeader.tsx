"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartContext";
import { BagIcon, Outline, WhatsAppIcon } from "./Stitch";
import { whatsappLink } from "@/lib/catalog";

const NAV = [
  { href: "/#collections", label: "Collection" },
  { href: "/#story", label: "The Craft" },
  { href: "/#size", label: "Size & Care" },
  { href: "/#contact", label: "Contact" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <header className="site-header">
        <Link href="/" className="brand">
          Sukriti Chikan
        </Link>
        <nav className={`nav ${open ? "open" : ""}`} aria-label="Primary">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <a className="stitch ghost hide-mobile" href={whatsappLink()} target="_blank" rel="noopener">
            <Outline />
            <WhatsAppIcon />
            WhatsApp
          </a>
          <Link href="/cart" className="bag" aria-label={`Shopping bag, ${count} items`}>
            <BagIcon />
            {count > 0 && <span className="count">{count}</span>}
          </Link>
          <button
            type="button"
            className="menu-toggle"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>
      <div className={`nav-overlay ${open ? "open" : ""}`} onClick={() => setOpen(false)} />
    </>
  );
}
