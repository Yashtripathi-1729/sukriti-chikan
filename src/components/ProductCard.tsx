"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/supabase";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="aspect-[3/4] relative overflow-hidden rounded-lg bg-white shadow-sm group-hover:shadow-md transition-shadow">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            No Image
          </div>
        )}
      </div>
      <div className="mt-3 px-1">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">{product.work_type}</p>
        <p className="text-base font-semibold text-chikan-700 mt-1">
          Rs {product.price.toLocaleString("en-IN")}
        </p>
      </div>
    </Link>
  );
}
