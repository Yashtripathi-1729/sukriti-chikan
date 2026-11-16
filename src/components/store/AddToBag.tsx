"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/supabase";
import { FREE_SIZE, formatPrice, sortSizes, whatsappLink } from "@/lib/catalog";
import { useCart } from "./CartContext";
import { Outline } from "./Stitch";

export default function AddToBag({ product: p }: { product: Product }) {
  const { add } = useCart();
  const sizes = sortSizes(p.sizes);
  const [size, setSize] = useState<string | null>(sizes.length ? null : FREE_SIZE);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 2500);
    return () => clearTimeout(t);
  }, [added]);

  function handleAdd() {
    if (!size) return;
    add({ id: p.id, name: p.name, size, price: p.price, colour: p.colour, img: p.images[0] || "" });
    setAdded(true);
  }

  return (
    <>
      <div>
        <p className="eyebrow" style={{ marginBottom: 10 }}>
          Size
        </p>
        {sizes.length ? (
          <div className="sizes">
            {sizes.map((s) => (
              <button key={s} type="button" className="chip" aria-pressed={s === size} onClick={() => setSize(s)}>
                {s}
              </button>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: 14, color: "var(--ink-2)" }}>{FREE_SIZE}</p>
        )}
        {sizes.length > 0 && (
          <Link href="/#size" className="dashed" style={{ display: "inline-block", marginTop: 14 }}>
            Size guide
          </Link>
        )}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center" }}>
        <button
          type="button"
          className={`stitch dark add-btn ${added ? "added" : ""}`}
          disabled={!size}
          onClick={handleAdd}
        >
          <Outline />
          {added ? "Added" : size ? "Add to bag" : "Choose a size"}
        </button>
        {added ? (
          <Link href="/cart" className="dashed">
            View bag
          </Link>
        ) : (
          <a
            className="dashed"
            target="_blank"
            rel="noopener"
            href={whatsappLink(`Hi, I have a question about "${p.name}" (${formatPrice(p.price)}).`)}
          >
            Ask on WhatsApp
          </a>
        )}
      </div>
    </>
  );
}
