"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/supabase";
import { adminFetch, adminJson, getAdminPass, logout } from "@/lib/admin-client";

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  const loadProducts = useCallback(async () => {
    try {
      const res = await adminFetch("/api/products");
      setProducts(await res.json());
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!getAdminPass()) {
      router.push("/admin/login");
      return;
    }
    loadProducts();
  }, [router, loadProducts]);

  async function run(id: string, action: () => Promise<unknown>) {
    setBusyId(id);
    try {
      await action();
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusyId(null);
    }
  }

  function togglePublish(p: Product) {
    run(p.id, () => adminJson("/api/products", "PATCH", { id: p.id, is_published: !p.is_published }));
  }

  function deleteProduct(p: Product) {
    if (!confirm(`Delete "${p.name}"? This also deletes its photos.`)) return;
    run(p.id, () => adminJson("/api/products", "DELETE", { id: p.id }));
  }

  const live = products.filter((p) => p.is_published).length;

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white border-b border-chikan-100 px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-serif font-bold text-chikan-800">Admin Panel</h1>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            View Store
          </Link>
          <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-700">
            Logout
          </button>
          <Link
            href="/admin/add"
            className="bg-chikan-700 hover:bg-chikan-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + Add
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>
        )}

        {!loading && products.length > 0 && (
          <p className="text-sm text-gray-500 mb-6">
            {products.length} product{products.length !== 1 ? "s" : ""} &middot; {live} live &middot;{" "}
            {products.length - live} draft
          </p>
        )}

        {loading ? (
          <p className="text-center py-20 text-gray-400">Loading...</p>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">No products yet</p>
            <Link href="/admin/add" className="bg-chikan-700 text-white px-6 py-3 rounded-lg">
              Add your first product
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((p) => (
              <div
                key={p.id}
                className={`bg-white rounded-lg p-4 flex items-center gap-4 ${
                  busyId === p.id ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <Link
                  href={`/admin/edit/${p.id}`}
                  className="flex items-center gap-4 flex-1 min-w-0"
                >
                  <div className="w-16 h-20 relative rounded overflow-hidden bg-gray-100 flex-shrink-0">
                    {p.images[0] && (
                      <Image src={p.images[0]} alt="" fill className="object-cover" sizes="64px" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-sm truncate">{p.name}</h3>
                    <p className="text-xs text-gray-500 capitalize">
                      {p.category} &middot; {p.fabric}
                    </p>
                    <p className="text-sm font-semibold text-chikan-700 mt-1">
                      Rs {p.price.toLocaleString("en-IN")}
                    </p>
                  </div>
                </Link>
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => togglePublish(p)}
                    title={p.is_published ? "Tap to hide from store" : "Tap to show in store"}
                    className={`text-xs px-3 py-2 rounded-full font-medium ${
                      p.is_published ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {p.is_published ? "Live" : "Draft"}
                  </button>
                  <Link
                    href={`/admin/edit/${p.id}`}
                    className="text-xs text-chikan-600 hover:text-chikan-800 px-2 py-2"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteProduct(p)}
                    className="text-xs text-red-400 hover:text-red-600 px-2 py-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
