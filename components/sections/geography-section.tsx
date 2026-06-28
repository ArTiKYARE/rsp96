"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { PhosphorIcon } from "@/components/shared/phosphor-icon";

import { SectionTitle } from "@/components/shared/section-title";
import { geography } from "@/lib/data";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export function GeographySection() {
  return (
    <section className="py-20 lg:py-28 overflow-hidden">
      <div className="container">
        <SectionTitle title={geography.title} subtitle={geography.subtitle} centered />

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
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-4"
          >
            <motion.h3 variants={fadeInUp} className="text-2xl font-bold mb-6">
              Регионы присутствия
            </motion.h3>
            {geography.regions.map((region) => (
              <motion.div
                key={region.name}
                variants={fadeInUp}
                className="flex items-start gap-4 rounded-2xl bg-muted/50 p-4"
              >
                <div className="shrink-0 icon-box">
                  <PhosphorIcon name="MapPin" className="h-5 w-5" weight="duotone" />
                </div>
                <div>
                  <p className="font-semibold">{region.name}</p>
                  <p className="text-sm text-muted-foreground">{region.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
