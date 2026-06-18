"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/data";
import { PartnerLogos } from "./partner-logos";

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

      <div className="container relative z-10 py-20 lg:py-32">
        <div className="max-w-3xl">
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
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl text-balance"
          >
            Грузоперевозки по зимникам, речным и морским путям. Поставка инертных материалов,
            перевозка людей и погрузочно-разгрузочные работы в экстремальных климатических условиях.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
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
              <Phone className="mr-2 h-5 w-5" />
              {siteConfig.phone}
            </a>
          </motion.div>

          <PartnerLogos />
        </div>
      </div>

      {/* Stats strip */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="absolute bottom-0 left-0 right-0 z-10 border-t border-border/40 bg-background/80 backdrop-blur-xl"
      >
        <div className="container py-6">
          <div className="grid grid-cols-3 gap-4 md:gap-8">
            <div className="text-center md:text-left">
              <p className="text-2xl md:text-4xl font-bold text-primary">6+</p>
              <p className="text-xs md:text-sm text-muted-foreground">лет опыта</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-2xl md:text-4xl font-bold text-primary">86</p>
              <p className="text-xs md:text-sm text-muted-foreground">сотрудников</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-2xl md:text-4xl font-bold text-primary">40</p>
              <p className="text-xs md:text-sm text-muted-foreground">единиц техники</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
