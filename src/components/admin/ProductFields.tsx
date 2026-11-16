"use client";

import {
  CATEGORIES,
  DEFAULT_SIZES,
  SIZED_CATEGORIES,
  SIZE_ORDER,
  categoryLabel,
  sortSizes,
} from "@/lib/catalog";

// Form state: tags and price are kept as strings while editing
export type ProductForm = {
  name: string;
  description: string;
  category: string;
  fabric: string;
  work_type: string;
  colour: string;
  sizes: string[];
  tags: string;
  price: string;
};

export const EMPTY_FORM: ProductForm = {
  name: "",
  description: "",
  category: "kurti",
  fabric: "",
  work_type: "",
  colour: "",
  sizes: [],
  tags: "",
  price: "",
};

type Source = {
  name?: string;
  description?: string;
  category?: string;
  fabric?: string;
  work_type?: string;
  colour?: string;
  sizes?: string[];
  tags?: string[];
  price?: number;
};

// AI results have no sizes; clothing then starts with the common S–XL range
export function toForm(src: Source, keepPrice = ""): ProductForm {
  const category = CATEGORIES.includes(src.category || "") ? src.category! : "kurti";
  return {
    name: src.name || "",
    description: src.description || "",
    category,
    fabric: src.fabric || "",
    work_type: src.work_type || "",
    colour: src.colour || "",
    sizes: src.sizes ?? (SIZED_CATEGORIES.includes(category) ? DEFAULT_SIZES : []),
    tags: (src.tags || []).join(", "),
    price: src.price != null ? String(src.price) : keepPrice,
  };
}

export function fromForm(form: ProductForm) {
  return {
    name: form.name.trim(),
    description: form.description.trim(),
    category: form.category,
    fabric: form.fabric.trim(),
    work_type: form.work_type.trim(),
    colour: form.colour.trim(),
    sizes: sortSizes(form.sizes),
    tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    price: Number(form.price),
  };
}

export function validateForm(form: ProductForm, photoCount: number) {
  if (photoCount === 0) return "Add at least one photo";
  if (!form.name.trim()) return "Product name is required";
  if (!form.price || Number(form.price) <= 0) return "Set a price";
  return "";
}

const inputClass =
  "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-chikan-300";

export default function ProductFields({
  form,
  onChange,
}: {
  form: ProductForm;
  onChange: (form: ProductForm) => void;
}) {
  const set = (key: keyof ProductForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => onChange({ ...form, [key]: e.target.value });

  const toggleSize = (size: string) =>
    onChange({
      ...form,
      sizes: form.sizes.includes(size)
        ? form.sizes.filter((s) => s !== size)
        : [...form.sizes, size],
    });

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-gray-400 block mb-1">Name</label>
        <input value={form.name} onChange={set("name")} className={inputClass} />
      </div>

      <div>
        <label className="text-xs text-gray-400 block mb-1">Description</label>
        <textarea value={form.description} onChange={set("description")} rows={3} className={inputClass} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-400 block mb-1">Category</label>
          <select value={form.category} onChange={set("category")} className={`${inputClass} capitalize`}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {categoryLabel(c)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">Fabric</label>
          <input value={form.fabric} onChange={set("fabric")} className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-400 block mb-1">Work Type</label>
          <input value={form.work_type} onChange={set("work_type")} className={inputClass} />
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">Colour</label>
          <input value={form.colour} onChange={set("colour")} className={inputClass} />
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-400 block mb-1">
          Sizes available {form.sizes.length === 0 && "(none selected = Free size)"}
        </label>
        <div className="flex flex-wrap gap-2">
          {SIZE_ORDER.map((size) => {
            const on = form.sizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                aria-pressed={on}
                className={`min-w-[48px] px-3 py-2.5 rounded-lg border text-sm font-medium ${
                  on
                    ? "bg-chikan-700 border-chikan-700 text-white"
                    : "bg-white border-gray-200 text-gray-500"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-400 block mb-1">Tags (comma separated)</label>
        <input value={form.tags} onChange={set("tags")} className={inputClass} />
      </div>

      {/* PRICE — the only thing the owner MUST fill */}
      <div className="bg-chikan-50 rounded-lg p-4">
        <label className="text-sm font-medium text-chikan-800 block mb-2">Price (Rs) *</label>
        <input
          type="number"
          inputMode="numeric"
          min={1}
          value={form.price}
          onChange={set("price")}
          placeholder="Enter price"
          className="w-full border-2 border-chikan-300 rounded-lg px-4 py-3 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-chikan-500"
        />
      </div>
    </div>
  );
}
