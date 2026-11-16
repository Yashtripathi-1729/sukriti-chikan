"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductFields, {
  EMPTY_FORM,
  ProductForm,
  fromForm,
  toForm,
  validateForm,
} from "@/components/admin/ProductFields";
import PhotoManager, { Photo } from "@/components/admin/PhotoManager";
import { adminJson, fileToBase64, getAdminPass, uploadImages } from "@/lib/admin-client";

export default function AddProduct() {
  const router = useRouter();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [analyzed, setAnalyzed] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getAdminPass()) router.push("/admin/login");
  }, [router]);

  // Run AI on the first photo the owner adds
  function handleAdded(added: Photo[]) {
    if (!analyzed && !analyzing && added[0]?.file) analyzeImage(added[0].file);
  }

  async function analyzeImage(file: File) {
    setAnalyzing(true);
    setError("");
    try {
      const details = await adminJson<Parameters<typeof toForm>[0]>("/api/ai-generate", "POST", {
        image: await fileToBase64(file),
        mimeType: file.type,
      });
      setForm((f) => toForm(details, f.price));
    } catch {
      setError("Could not analyze the photo. Please fill in the details yourself.");
    } finally {
      setAnalyzing(false);
      setAnalyzed(true);
    }
  }

  async function save(publish: boolean) {
    const problem = validateForm(form, photos.length);
    if (problem) return setError(problem);

    setSaving(true);
    setError("");
    try {
      const urls = await uploadImages(photos.map((p) => p.file!));
      await adminJson("/api/products", "POST", {
        ...fromForm(form),
        images: urls,
        is_published: publish,
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
        <h1 className="text-xl font-serif font-bold text-chikan-800">Add Product</h1>
        <button onClick={() => router.push("/admin")} className="text-sm text-gray-500 hover:text-gray-700">
          Cancel
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-xl p-6">
          <h2 className="font-medium text-gray-900 mb-1">Step 1: Add Photos</h2>
          <p className="text-xs text-gray-400 mb-4">AI will fill in the details from the first photo</p>
          <PhotoManager photos={photos} onChange={setPhotos} onAdded={handleAdded} />
        </div>

        {analyzing && (
          <div className="bg-white rounded-xl p-6 text-center">
            <div className="animate-pulse text-chikan-600">Analyzing your product with AI...</div>
          </div>
        )}

        {analyzed && !analyzing && (
          <div className="bg-white rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium text-gray-900">Step 2: Review Details</h2>
              {form.name && (
                <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">
                  AI Generated
                </span>
              )}
            </div>
            <ProductFields form={form} onChange={setForm} />
          </div>
        )}

        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>}

        {analyzed && !analyzing && (
          <div className="space-y-3">
            <button
              onClick={() => save(true)}
              disabled={saving}
              className="w-full bg-chikan-700 hover:bg-chikan-800 disabled:bg-gray-300 text-white font-medium py-4 rounded-xl transition-colors text-lg"
            >
              {saving ? "Saving..." : "Publish Product"}
            </button>
            <button
              onClick={() => save(false)}
              disabled={saving}
              className="w-full text-chikan-700 text-sm py-2 disabled:text-gray-300"
            >
              Save as draft
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
