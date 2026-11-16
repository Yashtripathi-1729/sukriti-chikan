"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabase, Product } from "@/lib/supabase";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      setProduct(data);
    }
    load();
  }, [id]);

  if (!product) {
    return <div className="text-center py-20 text-gray-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white/80 backdrop-blur-sm border-b border-chikan-100 px-4 py-4">
        <Link href="/" className="text-2xl font-serif font-bold text-chikan-800">
          Sukriti Chikan
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <Link href="/" className="text-sm text-chikan-600 hover:underline mb-6 inline-block">
          &larr; Back to collection
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <div className="aspect-[3/4] relative rounded-lg overflow-hidden bg-white">
              {product.images[selectedImage] && (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 mt-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-20 relative rounded overflow-hidden border-2 ${
                      i === selectedImage ? "border-chikan-500" : "border-transparent"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">
              {product.name}
            </h1>
            <p className="text-3xl font-bold text-chikan-700">
              Rs {product.price.toLocaleString("en-IN")}
            </p>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white rounded-lg p-3">
                <span className="text-gray-400 block">Category</span>
                <span className="font-medium capitalize">{product.category}</span>
              </div>
              <div className="bg-white rounded-lg p-3">
                <span className="text-gray-400 block">Fabric</span>
                <span className="font-medium">{product.fabric}</span>
              </div>
              <div className="bg-white rounded-lg p-3 col-span-2">
                <span className="text-gray-400 block">Work Type</span>
                <span className="font-medium">{product.work_type}</span>
              </div>
            </div>

            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-chikan-50 text-chikan-700 px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-4">
              <WhatsAppButton productName={product.name} price={product.price} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
