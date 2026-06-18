"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { SectionTitle } from "@/components/shared/section-title";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { services } from "@/lib/data";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export function ServicesSection() {
  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="container">
        <SectionTitle
          title="Услуги"
          subtitle="Комплексные логистические решения для работы в условиях Крайнего Севера"
          centered
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-6 lg:gap-8"
        >
          {services.map((service) => (
            <motion.div key={service.id} variants={fadeInUp}>
              <Link href={`/services/${service.slug}`} className="group block h-full">
                <Card className="h-full overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:border-primary/30">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {service.shortDescription}
                    </p>
                    <span className="inline-flex items-center text-sm font-medium text-primary">
                      Подробнее
                      <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12 text-center">
          <Link href="/services" className={buttonVariants({ variant: "outline", size: "lg" })}>
            Все услуги
          </Link>
        </div>
      </div>
    </section>
  );
}
