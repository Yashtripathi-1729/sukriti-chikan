"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/supabase";

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const pass = sessionStorage.getItem("admin_pass");
    if (!pass) {
      router.push("/admin/login");
      return;
    }
    loadProducts(pass);
  }, [router]);

  async function loadProducts(pass?: string) {
    const password = pass || sessionStorage.getItem("admin_pass");
    const res = await fetch("/api/products", {
      headers: { "x-admin-password": password || "" },
    });
    if (res.status === 401) {
      sessionStorage.removeItem("admin_pass");
      router.push("/admin/login");
      return;
    }
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }

  async function togglePublish(id: string, current: boolean) {
    const password = sessionStorage.getItem("admin_pass") || "";
    await fetch("/api/products", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password,
      },
      body: JSON.stringify({ id, is_published: !current }),
    });
    loadProducts();
  }

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product?")) return;
    const password = sessionStorage.getItem("admin_pass") || "";
    await fetch("/api/products", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password,
      },
      body: JSON.stringify({ id }),
    });
    loadProducts();
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white border-b border-chikan-100 px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-serif font-bold text-chikan-800">
          Admin Panel
        </h1>
        <div className="flex gap-3">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            View Store
          </Link>
          <Link
            href="/admin/add"
            className="bg-chikan-700 hover:bg-chikan-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + Add Product
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-sm text-gray-500 mb-6">
          {products.length} product{products.length !== 1 ? "s" : ""}
        </p>

        {loading ? (
          <p className="text-center py-20 text-gray-400">Loading...</p>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">No products yet</p>
            <Link
              href="/admin/add"
              className="bg-chikan-700 text-white px-6 py-3 rounded-lg"
            >
              Add your first product
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-lg p-4 flex items-center gap-4"
              >
                <div className="w-16 h-20 relative rounded overflow-hidden bg-gray-100 flex-shrink-0">
                  {p.images[0] && (
                    <Image src={p.images[0]} alt="" fill className="object-cover" sizes="64px" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">{p.name}</h3>
                  <p className="text-xs text-gray-500 capitalize">{p.category} &middot; {p.fabric}</p>
                  <p className="text-sm font-semibold text-chikan-700 mt-1">
                    Rs {p.price.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => togglePublish(p.id, p.is_published)}
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      p.is_published
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {p.is_published ? "Live" : "Draft"}
                  </button>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="text-xs text-red-400 hover:text-red-600 p-1"
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
