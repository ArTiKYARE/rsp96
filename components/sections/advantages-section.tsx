"use client";

import { motion } from "framer-motion";

import { SectionTitle } from "@/components/shared/section-title";
import { DynamicIcon } from "@/components/shared/dynamic-icon";
import { Card, CardContent } from "@/components/ui/card";
import { advantages } from "@/lib/data";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export function AdvantagesSection() {
  return (
    <section className="py-20 lg:py-28 bg-muted/30">
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
              <Card className="h-full border-border/50 bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/20">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <DynamicIcon name={advantage.icon} className="h-6 w-6" />
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
