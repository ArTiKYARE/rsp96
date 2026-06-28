"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Zoom } from "yet-another-react-lightbox/plugins";

import type { GalleryItem } from "@/lib/models";

interface GalleryGridProps {
  gallery: GalleryItem[];
}

export function GalleryGrid({ gallery }: GalleryGridProps) {
  const [index, setIndex] = useState(-1);

  const slides = useMemo(
    () => gallery.map((item) => ({ src: item.src, alt: item.alt })),
    [gallery]
  );

  if (gallery.length === 0) {
    return (
      <p className="text-center text-muted-foreground">Фотографий пока нет.</p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {gallery.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setIndex(i)}
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, 25vw"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
            <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-8">
              <p className="text-sm font-bold text-white line-clamp-1">
                {item.title || item.alt}
              </p>
              {(item.location || item.description) && (
                <p className="text-xs text-white/80 line-clamp-2 mt-0.5">
                  {item.location}{item.location && item.description ? " · " : ""}{item.description}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={slides}
        plugins={[Zoom]}
        animation={{ fade: 300 }}
      />
    </>
  );
}
