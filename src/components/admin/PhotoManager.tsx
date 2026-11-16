"use client";

import { useState } from "react";
import { compressImage } from "@/lib/admin-client";

// A photo is either already uploaded (url) or picked locally and not yet uploaded (file)
export type Photo = { url: string; file?: File };

export default function PhotoManager({
  photos,
  onChange,
  onAdded,
}: {
  photos: Photo[];
  onChange: (photos: Photo[]) => void;
  onAdded?: (added: Photo[]) => void;
}) {
  const [processing, setProcessing] = useState(false);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || []);
    e.target.value = ""; // allow picking the same file again
    if (selected.length === 0) return;

    setProcessing(true);
    const files = await Promise.all(selected.map((f) => compressImage(f)));
    setProcessing(false);

    const added = files.map((file) => ({ url: URL.createObjectURL(file), file }));
    onChange([...photos, ...added]);
    onAdded?.(added);
  }

  function remove(i: number) {
    const photo = photos[i];
    if (photo.file) URL.revokeObjectURL(photo.url);
    onChange(photos.filter((_, j) => j !== i));
  }

  function makeCover(i: number) {
    onChange([photos[i], ...photos.filter((_, j) => j !== i)]);
  }

  return (
    <div>
      {photos.length > 0 && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {photos.map((p, i) => (
            <div key={p.url} className="w-24 flex-shrink-0">
              <div className="w-24 h-32 relative rounded-lg overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => remove(i)}
                  aria-label="Remove photo"
                  className="absolute top-0 right-0 w-10 h-10 flex items-start justify-end p-1.5"
                >
                  <span className="w-7 h-7 rounded-full bg-black/60 text-white text-base leading-7 text-center">&times;</span>
                </button>
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 text-[10px] bg-chikan-700 text-white px-1.5 py-0.5 rounded">
                    Cover
                  </span>
                )}
              </div>
              {i > 0 && (
                <button
                  type="button"
                  onClick={() => makeCover(i)}
                  className="text-xs text-chikan-600 py-2.5 w-full"
                >
                  Make cover
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <label className="block border-2 border-dashed border-chikan-200 rounded-xl p-6 text-center cursor-pointer hover:border-chikan-400 transition-colors">
        <input type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
        <div className="text-chikan-400">
          <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
          </svg>
          <p className="text-sm">
            {processing ? "Preparing photos..." : photos.length ? "Add more photos" : "Tap to add photos"}
          </p>
        </div>
      </label>
    </div>
  );
}
