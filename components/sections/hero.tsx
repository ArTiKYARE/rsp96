"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PhosphorIcon } from "@/components/shared/phosphor-icon";

import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/data";
import { PartnerLogos } from "./partner-logos";
import { HeroLeadForm } from "./hero-lead-form";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/banner.jpg"
          alt="Логистика на Крайнем Севере"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />

      <div className="container relative z-10 py-20 lg:py-28">
        <div className="max-w-3xl lg:max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              ООО «РемСтройПроект»
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            Логистические услуги{" "}
            <span className="text-primary">в районах Крайнего Севера</span> и Арктики
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl text-balance"
          >
            Грузоперевозки по зимникам, речным и морским путям. Поставка инертных материалов,
            перевозка людей и погрузочно-разгрузочные работы в экстремальных климатических условиях.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-8"
          >
            <Link
              href="/contacts"
              className={buttonVariants({
                size: "lg",
                className: "bg-accent hover:bg-accent/90 text-accent-foreground text-base px-8",
              })}
            >
              Оставить заявку
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <a
              href={siteConfig.phoneHref}
              className={buttonVariants({ size: "lg", variant: "outline", className: "text-base px-8" })}
            >
              <PhosphorIcon name="Phone" className="mr-2 h-5 w-5" weight="bold" />
              {siteConfig.phone}
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-3xl"
          >
            <HeroLeadForm />
          </motion.div>

          <PartnerLogos />
        </div>
      </div>


    </section>
  );
}
