"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, Mail, ArrowRight } from "lucide-react";

import { SectionTitle } from "@/components/shared/section-title";
import { Button, buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/data";

export function CTASection() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-glow" />
      <div className="container relative z-10">
        <div className="rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-8 md:p-12 lg:p-16 text-primary-foreground shadow-2xl">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-primary-foreground/80 text-sm font-medium">{siteConfig.name}</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-2 mb-4">
                Свяжитесь с нами
              </h2>
              <p className="text-primary-foreground/80 text-lg max-w-lg">
                Расскажите о задаче — мы подберём оптимальное логистическое решение для вашего бизнеса.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-4"
            >
              <a
                href={siteConfig.phoneHref}
                className="flex items-center gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur-sm hover:bg-white/20 transition-colors"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-primary-foreground/70">Телефон</p>
                  <p className="text-lg font-semibold">{siteConfig.phone}</p>
                </div>
              </a>
              <a
                href={siteConfig.emailHref}
                className="flex items-center gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur-sm hover:bg-white/20 transition-colors"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-primary-foreground/70">Email</p>
                  <p className="text-lg font-semibold">{siteConfig.email}</p>
                </div>
              </a>
              <Link
                href="/contacts"
                className={buttonVariants({
                  size: "lg",
                  className: "w-full bg-accent hover:bg-accent/90 text-accent-foreground",
                })}
              >
                Оставить заявку
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
