"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { PhosphorIcon } from "@/components/shared/phosphor-icon";

import { SectionTitle } from "@/components/shared/section-title";
import { geography, portfolio } from "@/lib/data";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export function HistoryGeographySection() {
  return (
    <section className="py-20 lg:py-28 bg-muted/30 overflow-hidden">
      <div className="container">
        <SectionTitle
          title="География наших работ"
          subtitle={portfolio.subtitle}
          centered
        />

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl"
          >
            <Image
              src={geography.image}
              alt="География работы РСП"
              fill
              loading="lazy"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                Работаем по всей России
              </span>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-6"
          >
            <motion.p
              variants={fadeInUp}
              className="text-lg text-muted-foreground leading-relaxed"
            >
              {portfolio.description}
            </motion.p>

            <motion.div variants={fadeInUp} className="grid sm:grid-cols-2 gap-4">
              {geography.regions.map((region) => (
                <div
                  key={region.name}
                  className="relative flex items-start gap-3 rounded-xl bg-background p-4 shadow-sm border border-border/50 card-top-accent transition-all hover:border-primary/30 hover:shadow-md"
                >
                  <div className="shrink-0 icon-box">
                    <PhosphorIcon name="MapPin" className="h-4 w-4" weight="duotone" />
                  </div>
                  <div>
                    <p className="font-semibold">{region.name}</p>
                    <p className="text-sm text-muted-foreground">{region.description}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
