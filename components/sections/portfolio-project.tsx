"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { portfolio } from "@/lib/data";

type Project = (typeof portfolio.projects)[number];

export function PortfolioProject({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`grid lg:grid-cols-2 gap-8 lg:gap-20 items-center ${
        index > 0 ? "mt-20 lg:mt-36" : ""
      }`}
    >
      {/* Image column */}
      <div className={`relative ${isEven ? "lg:order-1" : "lg:order-2"}`}>
        <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl group">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        </div>

        {/* Year badge */}
        <div
          className={`absolute -bottom-5 ${
            isEven ? "left-6 lg:left-auto lg:-right-6" : "left-6 lg:-left-6"
          } bg-card border border-border/60 rounded-2xl px-6 py-4 shadow-xl`}
        >
          <span className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
            Год
          </span>
          <span className="text-xl font-bold">{project.year}</span>
        </div>
      </div>

      {/* Content column */}
      <div className={`${isEven ? "lg:order-2" : "lg:order-1"}`}>
        <div className="flex flex-wrap gap-2 mb-5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full border border-primary/30 bg-primary/15 px-3.5 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-[1.1]">
          {project.title}
        </h2>

        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
          {project.description}
        </p>

        {project.metric && (
          <div className="inline-flex items-baseline gap-3 rounded-2xl bg-muted/70 border border-border/50 px-8 py-6">
            <span className="text-5xl md:text-6xl font-bold text-primary-foreground tracking-tight">
              {project.metric.value}
            </span>
            <span className="text-lg font-medium text-primary-foreground/80">
              {project.metric.unit}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
