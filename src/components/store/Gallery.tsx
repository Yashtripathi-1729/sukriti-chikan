"use client";

import { useState } from "react";

/* eslint-disable @next/next/no-img-element */
export default function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="image-wrap">{images[active] && <img src={images[active]} alt={alt} />}</div>
      {images.length > 1 && (
        <div className="thumbs">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={`Photo ${i + 1}`}
              aria-pressed={i === active}
              onClick={() => setActive(i)}
            >
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
