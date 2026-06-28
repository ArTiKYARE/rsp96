"use client";

import { motion } from "framer-motion";

import { SectionTitle } from "@/components/shared/section-title";
import { PhosphorIcon } from "@/components/shared/phosphor-icon";
import { Card, CardContent } from "@/components/ui/card";
import { advantages } from "@/lib/data";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export function AdvantagesSection() {
  return (
    <section className="py-20 lg:py-28 bg-brand-light relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-pattern opacity-40" />
      <div className="container">
        <SectionTitle
          title="Наши преимущества"
          subtitle="Почему крупнейшие нефтегазовые компании доверяют нам логистику на Севере"
          centered
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {advantages.map((advantage) => (
            <motion.div key={advantage.title} variants={fadeInUp}>
              <Card className="relative h-full border-border/50 bg-card card-top-accent transition-all duration-300 hover:shadow-elevated hover:-translate-y-0.5 hover:border-primary/20">
                <CardContent className="p-6">
                  <div className="mb-4 icon-box">
                    <PhosphorIcon name={advantage.icon} className="h-6 w-6" weight="duotone" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{advantage.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {advantage.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
