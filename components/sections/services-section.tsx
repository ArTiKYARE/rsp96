"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { SectionTitle } from "@/components/shared/section-title";
import { buttonVariants } from "@/components/ui/button";
import { ServiceCard } from "@/components/service-card";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import type { Service } from "@/lib/models";

interface ServicesSectionProps {
  services: Service[];
}

export function ServicesSection({ services }: ServicesSectionProps) {
  const homeServices = services
    .filter((service) => service.showOnHome)
    .slice(0, 4);

  return (
    <section className="py-20 lg:py-28 bg-brand-light relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-pattern opacity-30" />
      <div className="container">
        <SectionTitle
          title="Услуги"
          subtitle="Комплексные логистические решения для работы в условиях Крайнего Севера"
          centered
        />

        {homeServices.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Услуги для главной страницы не выбраны.
          </p>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-6 lg:gap-8"
          >
            {homeServices.map((service) => (
              <motion.div key={service.id} variants={fadeInUp}>
                <ServiceCard service={service} variant="minimal" />
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="mt-12 text-center">
          <Link href="/services" className={buttonVariants({ variant: "outline", size: "lg" })}>
            Все услуги
          </Link>
        </div>
      </div>
    </section>
  );
}
