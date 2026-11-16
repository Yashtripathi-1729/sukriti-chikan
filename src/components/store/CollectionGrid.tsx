"use client";

import { useState } from "react";
import { Product } from "@/lib/supabase";
import { CATEGORIES, categoryLabel } from "@/lib/catalog";
import ProductCard from "./ProductCard";

export default function CollectionGrid({ products }: { products: Product[] }) {
  const [current, setCurrent] = useState("all");

  // Only offer filters for categories that actually have products
  const present = CATEGORIES.filter((c) => products.some((p) => p.category === c));
  const shown = current === "all" ? products : products.filter((p) => p.category === current);

  if (products.length === 0) {
    return (
      <div className="empty">
        <h3>New pieces are on their way</h3>
        <p>Message us on WhatsApp to hear first when they arrive.</p>
      </div>
    );
  }

  return (
    <>
      {present.length > 1 && (
        <div className="filters" role="group" aria-label="Filter by category">
          {["all", ...present].map((c) => (
            <button key={c} type="button" className="chip" aria-pressed={c === current} onClick={() => setCurrent(c)}>
              {c === "all" ? "All" : categoryLabel(c)}
            </button>
          ))}
        </div>
      )}
      <div className="products">
        {shown.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </>
  );
}
