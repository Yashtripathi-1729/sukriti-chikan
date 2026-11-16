"use client";

import Link from "next/link";
import { useState } from "react";

const categories = [
  { label: "All", value: "" },
  { label: "Kurtis", value: "kurti" },
  { label: "Suits", value: "suit" },
  { label: "Sarees", value: "saree" },
  { label: "Dupattas", value: "dupatta" },
  { label: "Fabric", value: "fabric" },
  { label: "Men", value: "men" },
];

export default function Navbar({
  onCategoryChange,
}: {
  onCategoryChange?: (cat: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-chikan-100">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-serif font-bold text-chikan-800">
          Sukriti Chikan
        </Link>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>

        <nav className="hidden md:flex gap-6">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => onCategoryChange?.(cat.value)}
              className="text-sm text-gray-600 hover:text-chikan-700 transition-colors"
            >
              {cat.label}
            </button>
          ))}
        </nav>
      </div>

      {menuOpen && (
        <nav className="md:hidden px-4 pb-4 flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                onCategoryChange?.(cat.value);
                setMenuOpen(false);
              }}
              className="text-sm text-gray-600 hover:text-chikan-700 px-3 py-1 rounded-full bg-chikan-50"
            >
              {cat.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
