"use client";

import { useEffect, useState } from "react";
import { supabase, Product } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      let query = supabase
        .from("products")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (category) {
        query = query.eq("category", category);
      }

      const { data } = await query;
      setProducts(data || []);
      setLoading(false);
    }
    load();
  }, [category]);

  return (
    <>
      <Navbar onCategoryChange={setCategory} />

      {/* Hero */}
      <section className="text-center py-16 px-4 bg-gradient-to-b from-white to-cream">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-chikan-800 mb-4">
          Sukriti Chikan
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          Authentic handcrafted Lucknowi Chikankari. Each piece tells a story of
          centuries-old artistry.
        </p>
      </section>

      {/* Products */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            No products found.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-sm text-gray-400 border-t border-chikan-100">
        Sukriti Chikan &mdash; Handcrafted with love in Lucknow
      </footer>
    </>
  );
}
