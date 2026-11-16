"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useCart } from "@/components/store/CartContext";
import { Outline, WhatsAppIcon } from "@/components/store/Stitch";
import { FREE_SHIPPING_ABOVE, FREE_SIZE, formatPrice, whatsappLink } from "@/lib/catalog";

const sizeText = (size: string) => (size === FREE_SIZE ? FREE_SIZE : `Size ${size}`);

export default function CartPage() {
  const { items, loaded, count, total, setQty, remove } = useCart();

  if (!loaded) return <section className="cart-page" />;

  if (items.length === 0) {
    return (
      <section className="cart-page">
        <div className="wrap">
          <div className="cart-empty">
            <svg width="80" height="96" viewBox="0 0 400 480" style={{ color: "var(--hair)", marginBottom: 24 }} aria-hidden="true">
              <path fill="none" stroke="currentColor" strokeWidth="2" d="M200 36 C300 36 352 130 340 230 C330 320 280 390 236 440 C216 462 196 462 184 436 C140 350 60 300 64 200 C68 110 120 36 200 36 Z" />
              <path fill="none" stroke="currentColor" strokeWidth="1.5" d="M200 110 C262 110 290 174 282 236 C276 290 246 334 220 372 C210 386 198 386 190 372 C166 326 128 294 130 224 C132 164 158 110 200 110 Z" />
            </svg>
            <h2>Your bag is empty</h2>
            <p>Looks like you haven&apos;t picked anything yet.</p>
            <Link className="stitch dark" href="/#collections">
              <Outline />
              See the collection
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const lines = items.map(
    (it, i) =>
      `${i + 1}. ${it.name} — ${sizeText(it.size)} — Qty ${it.qty} — ${formatPrice(it.price * it.qty)}\n   ${origin}/product/${it.id}`
  );
  const message = `Hi, I'd like to order:\n\n${lines.join("\n")}\n\nTotal: ${formatPrice(total)}`;

  return (
    <section className="cart-page">
      <div className="wrap">
        <h1>Your bag ({count})</h1>
        <div className="cart-layout">
          <div>
            {items.map((it) => (
              <div className="cart-item" key={`${it.id}-${it.size}`}>
                <div className="thumb">
                  <Link href={`/product/${it.id}`}>{it.img && <img src={it.img} alt={it.name} />}</Link>
                </div>
                <div className="details">
                  <Link href={`/product/${it.id}`} className="item-name">
                    {it.name}
                  </Link>
                  <span className="item-meta">
                    {it.colour ? `${it.colour} · ` : ""}{sizeText(it.size)}
                  </span>
                  <span className="item-price">{formatPrice(it.price)}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div className="qty-ctrl">
                      <button type="button" aria-label="Decrease quantity" onClick={() => setQty(it.id, it.size, it.qty - 1)}>
                        −
                      </button>
                      <span>{it.qty}</span>
                      <button type="button" aria-label="Increase quantity" onClick={() => setQty(it.id, it.size, it.qty + 1)}>
                        +
                      </button>
                    </div>
                    <button type="button" className="dashed link-btn" onClick={() => remove(it.id, it.size)}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div className="line">
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            {FREE_SHIPPING_ABOVE > 0 && (
              <p className="shipping-note">
                {total >= FREE_SHIPPING_ABOVE
                  ? "Free shipping across India"
                  : `Free shipping on orders above ${formatPrice(FREE_SHIPPING_ABOVE)}`}
              </p>
            )}
            <div className="line" style={{ borderTop: "1px dashed var(--hair)", paddingTop: 16 }}>
              <span style={{ fontFamily: "var(--display)", fontSize: 20 }}>Total</span>
              <span className="total">{formatPrice(total)}</span>
            </div>
            <a className="stitch dark" href={whatsappLink(message)} target="_blank" rel="noopener">
              <Outline />
              <WhatsAppIcon />
              Checkout via WhatsApp
            </a>
            <p className="shipping-note" style={{ textAlign: "center" }}>
              We confirm availability, delivery and payment on WhatsApp.
            </p>
            <Link href="/#collections" className="dashed" style={{ alignSelf: "center", marginTop: 8 }}>
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
