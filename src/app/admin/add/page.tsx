"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type AIDetails = {
  name: string;
  description: string;
  category: string;
  fabric: string;
  work_type: string;
  tags: string[];
};

export default function AddProduct() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [aiDetails, setAiDetails] = useState<AIDetails | null>(null);
  const [price, setPrice] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionStorage.getItem("admin_pass")) {
      router.push("/admin/login");
    }
  }, [router]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;

    setFiles(selected);
    setPreviews(selected.map((f) => URL.createObjectURL(f)));
    setAiDetails(null);
    setError("");

    // Auto-analyze first image
    analyzeImage(selected[0]);
  }

  async function analyzeImage(file: File) {
    setAnalyzing(true);
    setError("");
    try {
      const base64 = await fileToBase64(file);
      const res = await fetch("/api/ai-generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": sessionStorage.getItem("admin_pass") || "",
        },
        body: JSON.stringify({ image: base64, mimeType: file.type }),
      });

      if (!res.ok) throw new Error("AI analysis failed");
      const data = await res.json();
      setAiDetails(data);
    } catch {
      setError("Could not analyze image. You can fill details manually.");
      setAiDetails({
        name: "",
        description: "",
        category: "kurti",
        fabric: "",
        work_type: "",
        tags: [],
      });
    } finally {
      setAnalyzing(false);
    }
  }

  async function handlePublish() {
    if (!aiDetails || !price || files.length === 0) {
      setError("Add photos and set a price");
      return;
    }

    setSaving(true);
    setError("");

    try {
      // 1. Upload images
      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "x-admin-password": sessionStorage.getItem("admin_pass") || "",
        },
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");
      const { urls } = await uploadRes.json();

      // 2. Create product
      const productRes = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": sessionStorage.getItem("admin_pass") || "",
        },
        body: JSON.stringify({
          ...aiDetails,
          price: Number(price),
          images: urls,
          is_published: true,
        }),
      });

      if (!productRes.ok) throw new Error("Failed to save product");
      router.push("/admin");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white border-b border-chikan-100 px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-serif font-bold text-chikan-800">
          Add Product
        </h1>
        <button
          onClick={() => router.push("/admin")}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Step 1: Upload Photos */}
        <div className="bg-white rounded-xl p-6">
          <h2 className="font-medium text-gray-900 mb-4">
            Step 1: Add Photos
          </h2>
          <label className="block border-2 border-dashed border-chikan-200 rounded-xl p-8 text-center cursor-pointer hover:border-chikan-400 transition-colors">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="text-chikan-400">
              <svg className="w-10 h-10 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
              <p className="text-sm">Tap to add photos</p>
              <p className="text-xs text-gray-400 mt-1">
                AI will automatically fill all details
              </p>
            </div>
          </label>

          {previews.length > 0 && (
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {previews.map((src, i) => (
                <div key={i} className="w-24 h-32 relative rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={src} alt="" fill className="object-cover" sizes="96px" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Step 2: AI-generated details */}
        {analyzing && (
          <div className="bg-white rounded-xl p-6 text-center">
            <div className="animate-pulse text-chikan-600">
              Analyzing your product with AI...
            </div>
          </div>
        )}

        {aiDetails && (
          <div className="bg-white rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-gray-900">
                Step 2: Review Details
              </h2>
              <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">
                AI Generated
              </span>
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Name</label>
              <input
                value={aiDetails.name}
                onChange={(e) => setAiDetails({ ...aiDetails, name: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-chikan-300"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Description</label>
              <textarea
                value={aiDetails.description}
                onChange={(e) => setAiDetails({ ...aiDetails, description: e.target.value })}
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-chikan-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Category</label>
                <select
                  value={aiDetails.category}
                  onChange={(e) => setAiDetails({ ...aiDetails, category: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-chikan-300"
                >
                  <option value="kurti">Kurti</option>
                  <option value="suit">Suit</option>
                  <option value="saree">Saree</option>
                  <option value="dupatta">Dupatta</option>
                  <option value="fabric">Fabric</option>
                  <option value="men">Men</option>
                  <option value="kids">Kids</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Fabric</label>
                <input
                  value={aiDetails.fabric}
                  onChange={(e) => setAiDetails({ ...aiDetails, fabric: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-chikan-300"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Work Type</label>
              <input
                value={aiDetails.work_type}
                onChange={(e) => setAiDetails({ ...aiDetails, work_type: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-chikan-300"
              />
            </div>

            {/* PRICE — the only thing the owner MUST fill */}
            <div className="bg-chikan-50 rounded-lg p-4">
              <label className="text-sm font-medium text-chikan-800 block mb-2">
                Price (Rs) *
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
                className="w-full border-2 border-chikan-300 rounded-lg px-4 py-3 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-chikan-500"
              />
            </div>
          </div>
        )}

        {/* Step 3: Publish */}
        {aiDetails && (
          <button
            onClick={handlePublish}
            disabled={saving || !price}
            className="w-full bg-chikan-700 hover:bg-chikan-800 disabled:bg-gray-300 text-white font-medium py-4 rounded-xl transition-colors text-lg"
          >
            {saving ? "Publishing..." : "Publish Product"}
          </button>
        )}
      </main>
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]); // strip data:image/...;base64,
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
