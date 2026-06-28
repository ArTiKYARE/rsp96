"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { SectionTitle } from "@/components/shared/section-title";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { aboutContent, stats } from "@/lib/data";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export function AboutSection() {
  return (
    <section className="py-20 lg:py-28 overflow-hidden">
      <div className="container">
        <SectionTitle title="О компании" subtitle={aboutContent.subtitle} />

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-6"
          >
            <motion.p variants={fadeInUp} className="text-lg text-muted-foreground leading-relaxed">
              {aboutContent.intro}
            </motion.p>
            <motion.p variants={fadeInUp} className="text-muted-foreground leading-relaxed">
              {aboutContent.content}
            </motion.p>

            <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-4 pt-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="relative rounded-2xl bg-card p-4 text-center lg:text-left card-top-accent shadow-sm hover:shadow-elevated transition-shadow"
                >
                  <p className="text-2xl md:text-3xl font-bold text-primary">
                    <AnimatedCounter value={stat.value} />
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={aboutContent.image}
                alt="Техника РСП"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden lg:block w-48 h-48 rounded-2xl bg-primary/10 -z-10" />
            <div className="absolute -top-6 -right-6 hidden lg:block w-32 h-32 rounded-full bg-accent/10 -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
