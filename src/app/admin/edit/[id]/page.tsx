"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductFields, { ProductForm, fromForm, toForm, validateForm } from "@/components/admin/ProductFields";
import PhotoManager, { Photo } from "@/components/admin/PhotoManager";
import { adminFetch, adminJson, getAdminPass, uploadImages } from "@/lib/admin-client";
import { Product } from "@/lib/supabase";

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState<ProductForm | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getAdminPass()) {
      router.push("/admin/login");
      return;
    }
    adminFetch(`/api/products?id=${id}`)
      .then((res) => res.json())
      .then((p: Product) => {
        setForm(toForm(p));
        setPhotos(p.images.map((url) => ({ url })));
        setPublished(p.is_published);
      })
      .catch((err) => setError(err.message));
  }, [id, router]);

  async function save() {
    if (!form) return;
    const problem = validateForm(form, photos.length);
    if (problem) return setError(problem);

    setSaving(true);
    setError("");
    try {
      // Upload new photos, then keep the owner's order
      const newFiles = photos.filter((p) => p.file).map((p) => p.file!);
      const uploaded = await uploadImages(newFiles);
      let next = 0;
      const images = photos.map((p) => (p.file ? uploaded[next++] : p.url));

      await adminJson("/api/products", "PATCH", {
        id,
        ...fromForm(form),
        images,
        is_published: published,
      });
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white border-b border-chikan-100 px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-serif font-bold text-chikan-800">Edit Product</h1>
        <button onClick={() => router.push("/admin")} className="text-sm text-gray-500 hover:text-gray-700">
          Cancel
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {!form ? (
          error ? (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>
          ) : (
            <p className="text-center py-20 text-gray-400">Loading...</p>
          )
        ) : (
          <>
            <div className="bg-white rounded-xl p-6">
              <h2 className="font-medium text-gray-900 mb-4">Photos</h2>
              <PhotoManager photos={photos} onChange={setPhotos} />
            </div>

            <div className="bg-white rounded-xl p-6">
              <h2 className="font-medium text-gray-900 mb-4">Details</h2>
              <ProductFields form={form} onChange={setForm} />
            </div>

            <label className="bg-white rounded-xl p-6 flex items-center justify-between cursor-pointer">
              <span>
                <span className="font-medium text-gray-900 block">Show in store</span>
                <span className="text-xs text-gray-400">Turn off to keep it as a draft</span>
              </span>
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-5 h-5 accent-chikan-700"
              />
            </label>

            {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>}

            <button
              onClick={save}
              disabled={saving}
              className="w-full bg-chikan-700 hover:bg-chikan-800 disabled:bg-gray-300 text-white font-medium py-4 rounded-xl transition-colors text-lg"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </>
        )}
      </main>
    </div>
  );
}
