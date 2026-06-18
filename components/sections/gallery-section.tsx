"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Zoom } from "yet-another-react-lightbox/plugins";

import { SectionTitle } from "@/components/shared/section-title";
import { gallery } from "@/lib/data";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export function GallerySection() {
  const [index, setIndex] = useState(-1);

  const slides = gallery.map((item) => ({ src: item.src, alt: item.alt }));

  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="container">
        <SectionTitle
          title="Галерея"
          subtitle="Фото с объектов: техника, грузы и северные маршруты"
          centered
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {gallery.map((item, i) => (
            <motion.button
              key={item.src}
              variants={fadeInUp}
              onClick={() => setIndex(i)}
              className="group relative aspect-square overflow-hidden rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/30" />
            </motion.button>
          ))}
        </motion.div>

        <Lightbox
          open={index >= 0}
          close={() => setIndex(-1)}
          index={index}
          slides={slides}
          plugins={[Zoom]}
          animation={{ fade: 300 }}
        />
      </div>
    </section>
  );
}
