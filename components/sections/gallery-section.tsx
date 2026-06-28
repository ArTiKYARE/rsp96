"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { PhosphorIcon } from "@/components/shared/phosphor-icon";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Zoom } from "yet-another-react-lightbox/plugins";

import { SectionTitle } from "@/components/shared/section-title";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import type { GalleryItem } from "@/lib/models";

interface GallerySectionProps {
  gallery: GalleryItem[];
}

const SCROLL_STEP_S = 3;
const TRACK_DURATION_S = 45;

export function GallerySection({ gallery }: GallerySectionProps) {
  const [index, setIndex] = useState(-1);
  const [isPaused, setIsPaused] = useState(false);
  const row1DelayRef = useRef(0);
  const row2DelayRef = useRef(0);
  const [row1Delay, setRow1Delay] = useState(0);
  const [row2Delay, setRow2Delay] = useState(0);

  const slides = useMemo(() => gallery.map((item) => ({ src: item.src, alt: item.alt })), [gallery]);

  const { row1, row2 } = useMemo(() => {
    const r1: { item: GalleryItem; originalIndex: number }[] = [];
    const r2: { item: GalleryItem; originalIndex: number }[] = [];
    gallery.forEach((item, i) => {
      if (i % 2 === 0) r1.push({ item, originalIndex: i });
      else r2.push({ item, originalIndex: i });
    });
    return { row1: r1, row2: r2 };
  }, [gallery]);

  const adjustDelay = useCallback(
    (rowRef: React.MutableRefObject<number>, setDelay: (v: number) => void, direction: 1 | -1) => {
      rowRef.current = rowRef.current + direction * SCROLL_STEP_S;
      rowRef.current = rowRef.current % TRACK_DURATION_S;
      setDelay(rowRef.current);
    },
    []
  );

  const scrollLeft = useCallback(() => {
    adjustDelay(row1DelayRef, setRow1Delay, 1);
    adjustDelay(row2DelayRef, setRow2Delay, 1);
  }, [adjustDelay]);

  const scrollRight = useCallback(() => {
    adjustDelay(row1DelayRef, setRow1Delay, -1);
    adjustDelay(row2DelayRef, setRow2Delay, -1);
  }, [adjustDelay]);

  if (gallery.length === 0) {
    return (
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container">
          <SectionTitle
            title="Галерея"
            subtitle="Фото с объектов: техника, грузы и северные маршруты"
            centered
          />
          <p className="text-center text-muted-foreground">Фото пока нет.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 lg:py-28 bg-brand-light relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-pattern opacity-30" />
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <SectionTitle
              title="Галерея"
              subtitle="Фото с объектов: техника, грузы и северные маршруты"
              centered
            />
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="relative group/gallery mt-10 w-screen left-1/2 -translate-x-1/2"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <GalleryRow
              items={row1}
              delay={row1Delay}
              isPaused={isPaused}
              onSelect={setIndex}
            />
            <GalleryRow
              items={row2}
              delay={row2Delay}
              isPaused={isPaused}
              onSelect={setIndex}
              className="mt-4"
            />

            <button
              type="button"
              onClick={scrollLeft}
              aria-label="Прокрутить влево"
              className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-background/90 text-foreground shadow-lg backdrop-blur-sm opacity-0 transition-opacity duration-300 group-hover/gallery:opacity-100 hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-0"
            >
              <PhosphorIcon name="CaretLeft" className="h-5 w-5 md:h-6 md:w-6" weight="bold" />
            </button>
            <button
              type="button"
              onClick={scrollRight}
              aria-label="Прокрутить вправо"
              className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-background/90 text-foreground shadow-lg backdrop-blur-sm opacity-0 transition-opacity duration-300 group-hover/gallery:opacity-100 hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-0"
            >
              <PhosphorIcon name="CaretRight" className="h-5 w-5 md:h-6 md:w-6" weight="bold" />
            </button>
          </motion.div>
        </motion.div>
      </div>

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={slides}
        plugins={[Zoom]}
        animation={{ fade: 300 }}
      />
    </section>
  );
}

interface GalleryRowProps {
  items: { item: GalleryItem; originalIndex: number }[];
  delay: number;
  isPaused: boolean;
  onSelect: (index: number) => void;
  className?: string;
}

function GalleryRow({ items, delay, isPaused, onSelect, className }: GalleryRowProps) {
  if (items.length === 0) return null;

  const duplicated = [...items, ...items, ...items, ...items];

  return (
    <div className={`relative w-full overflow-hidden ${className ?? ""}`}>
      <div
        className="flex gap-4 gallery-track will-change-transform"
        style={{
          width: "fit-content",
          animationName: "gallery-scroll-left",
          animationDuration: `${TRACK_DURATION_S}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationDirection: "normal",
          animationPlayState: isPaused ? "paused" : "running",
          animationDelay: `${delay}s`,
        }}
      >
        {duplicated.map(({ item, originalIndex }, i) => (
          <button
            key={`${item.id}-${i}`}
            type="button"
            onClick={() => onSelect(originalIndex)}
            className="group/item relative h-44 w-64 md:h-52 md:w-80 flex-shrink-0 overflow-hidden rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 hover:scale-105 hover:z-10 hover:shadow-2xl"
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(max-width: 768px) 256px, 320px"
              loading="lazy"
              className="object-cover transition-all duration-500 group-hover/gallery:opacity-60 group-hover/item:opacity-100 group-hover/item:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/0 opacity-0 transition-opacity duration-300 group-hover/item:opacity-100" />
            <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full transition-transform duration-300 group-hover/item:translate-y-0">
              <p className="text-sm font-bold text-white line-clamp-1">{item.title || item.alt}</p>
              {(item.location || item.description) && (
                <p className="text-xs text-white/80 line-clamp-2 mt-0.5">
                  {item.location}{item.location && item.description ? " · " : ""}{item.description}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
