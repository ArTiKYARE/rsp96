"use client";

import { motion } from "framer-motion";

const partners = [
  {
    name: "Роснефть",
    src: "/images/partners/rosneft.png",
    className: "h-9 md:h-10",
  },
  {
    name: "Синара",
    src: "/images/partners/sinara.png",
    className: "h-10 md:h-11",
  },
  {
    name: "Газпром нефть / Газпромнефть снабжение",
    src: "/images/partners/gazprom-neft.png",
    className: "h-10 md:h-12",
  },
  {
    name: "Аврора",
    src: "/images/partners/avrora.png",
    className: "h-14 md:h-16",
  },
  {
    name: "Северная логистика",
    src: "/images/partners/severnaya-logistika.png",
    className: "h-7 md:h-8",
  },
];

export function PartnerLogos() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mt-10 pt-8 border-t border-border/40"
    >
      <p className="text-sm text-muted-foreground mb-5">Нам доверяют</p>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-6 md:gap-x-10">
        {partners.map((partner) => (
          <img
            key={partner.name}
            src={partner.src}
            alt={partner.name}
            className={`${partner.className} w-auto object-contain grayscale opacity-60 transition-all duration-300 hover:grayscale-0 hover:opacity-100`}
          />
        ))}
      </div>
    </motion.div>
  );
}
