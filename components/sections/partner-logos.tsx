"use client";

import { motion } from "framer-motion";

function RosneftLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 170 48" className={className} aria-label="Роснефть">
      <g fill="currentColor">
        <rect x="4" y="28" width="6" height="14" />
        <rect x="14" y="21" width="6" height="21" />
        <rect x="24" y="14" width="6" height="28" />
        <rect x="34" y="8" width="6" height="34" />
        <rect x="44" y="14" width="6" height="28" />
        <rect x="54" y="21" width="6" height="21" />
        <rect x="64" y="28" width="6" height="14" />
      </g>
      <g fill="#facc15">
        <rect x="24" y="36" width="6" height="6" />
        <rect x="34" y="36" width="6" height="6" />
        <rect x="44" y="36" width="6" height="6" />
      </g>
      <text x="82" y="32" fontSize="13" fontWeight="700" fontFamily="sans-serif" fill="currentColor">
        РОСНЕФТЬ
      </text>
    </svg>
  );
}

function SinaraLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 130 40" className={className} aria-label="Синара">
      <path
        d="M4 6 Q 20 6, 20 20 Q 20 34, 36 34 L 36 27 Q 26 27, 26 20 Q 26 13, 14 13 L 4 13 Z"
        fill="currentColor"
      />
      <text x="46" y="28" fontSize="17" fontWeight="500" fontFamily="sans-serif" fill="currentColor">
        синара
      </text>
    </svg>
  );
}

function GazpromNeftLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 230 48" className={className} aria-label="Газпром нефть">
      <g fill="currentColor">
        <path d="M24 46 C 4 46, 0 26, 0 26 C 0 10, 10 2, 24 2 C 36 2, 43 10, 43 20 L 30 20 C 30 15, 27 13, 24 13 C 17 13, 14 19, 14 26 C 14 33, 17 39, 24 39 L 24 29 L 43 29 L 43 46 Z" />
        <path d="M24 7 C 31 14, 33 22, 33 28 C 33 35, 29 40, 24 42 C 19 40, 15 35, 15 28 C 15 22, 17 14, 24 7" opacity="0.75" />
      </g>
      <text x="52" y="21" fontSize="14" fontWeight="700" fontFamily="sans-serif" fill="currentColor">
        ГАЗПРОМ
      </text>
      <text x="52" y="38" fontSize="12" fontWeight="700" fontFamily="sans-serif" fill="currentColor">
        НЕФТЬ
      </text>
      <line x1="128" y1="8" x2="128" y2="40" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <text x="138" y="21" fontSize="11" fontWeight="700" fontFamily="sans-serif" fill="currentColor">
        ГАЗПРОМНЕФТЬ
      </text>
      <text x="138" y="36" fontSize="11" fontWeight="500" fontFamily="sans-serif" fill="currentColor">
        СНАБЖЕНИЕ
      </text>
    </svg>
  );
}

function AuroraLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 52" className={className} aria-label="Аврора">
      <path
        d="M45 2 L 70 24 L 45 46 L 20 24 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path
        d="M45 10 L 62 24 L 45 38 L 28 24 Z"
        fill="currentColor"
        opacity="0.25"
      />
      <text x="45" y="53" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="sans-serif" fill="currentColor">
        АВРОРА
      </text>
    </svg>
  );
}

function SevernayaLogistikaLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 110 52" className={className} aria-label="Северная логистика">
      <text x="55" y="21" fontSize="13" fontWeight="700" textAnchor="middle" fontFamily="sans-serif" fill="currentColor">
        СЕВЕРНАЯ
      </text>
      <text x="55" y="41" fontSize="13" fontWeight="700" textAnchor="middle" fontFamily="sans-serif" fill="currentColor">
        ЛОГИСТИКА
      </text>
    </svg>
  );
}

export function PartnerLogos() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mt-10 pt-8 border-t border-border/40"
    >
      <p className="text-sm text-muted-foreground mb-5">Нам доверяют</p>
      <div className="flex flex-wrap items-center gap-x-8 gap-y-5 text-foreground/70">
        <RosneftLogo className="h-8 md:h-10 w-auto" />
        <SinaraLogo className="h-7 md:h-9 w-auto" />
        <GazpromNeftLogo className="h-8 md:h-10 w-auto" />
        <AuroraLogo className="h-8 md:h-10 w-auto" />
        <SevernayaLogistikaLogo className="h-8 md:h-10 w-auto" />
      </div>
    </motion.div>
  );
}
