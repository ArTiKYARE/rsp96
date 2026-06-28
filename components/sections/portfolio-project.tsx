"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Scale, Calendar } from "lucide-react";
import { portfolio } from "@/lib/data";

import { cn } from "@/lib/utils";

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
      className={cn(
        "grid lg:grid-cols-2 gap-8 lg:gap-20 items-center",
        index > 0 ? "mt-20 lg:mt-36" : ""
      )}
    >
      {/* Image column */}
      <div className={cn("relative", isEven ? "lg:order-1" : "lg:order-2")}>
        <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl group">
          <Image
            src={project.image}
            alt={project.title}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        </div>

        {/* Year badge */}
        <div
          className={cn(
            "absolute -bottom-5 bg-card border border-border/60 rounded-2xl px-6 py-4 shadow-xl",
            isEven ? "left-6 lg:left-auto lg:-right-6" : "left-6 lg:-left-6"
          )}
        >
          <span className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
            Год
          </span>
          <span className="text-xl font-bold">{project.year}</span>
        </div>
      </div>

      {/* Content column */}
      <div className={cn(isEven ? "lg:order-2" : "lg:order-1")}>
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

        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          {project.description}
        </p>

        <div className="grid sm:grid-cols-2 gap-3 mb-8">
          {project.route && (
            <div className="flex items-start gap-3 rounded-xl bg-muted/50 border border-border/50 p-4">
              <div className="shrink-0 mt-0.5 text-primary">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Маршрут</p>
                <p className="text-sm font-medium">{project.route}</p>
              </div>
            </div>
          )}
          {project.volume && (
            <div className="flex items-start gap-3 rounded-xl bg-muted/50 border border-border/50 p-4">
              <div className="shrink-0 mt-0.5 text-primary">
                <Scale className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Объём</p>
                <p className="text-sm font-medium">{project.volume}</p>
              </div>
            </div>
          )}
          {project.timeline && (
            <div className="flex items-start gap-3 rounded-xl bg-muted/50 border border-border/50 p-4">
              <div className="shrink-0 mt-0.5 text-primary">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Сроки</p>
                <p className="text-sm font-medium">{project.timeline}</p>
              </div>
            </div>
          )}
          {project.metric && (
            <div className="flex items-center gap-3 rounded-xl bg-primary/10 border border-primary/20 p-4">
              <span className="text-3xl font-bold text-primary tracking-tight">
                {project.metric.value}
              </span>
              <span className="text-sm font-medium text-primary/80">
                {project.metric.unit}
              </span>
            </div>
          )}
        </div>

        {project.gallery && project.gallery.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {project.gallery.map((photo, i) => (
              <div
                key={i}
                className="relative aspect-[4/3] rounded-xl overflow-hidden group/photo"
              >
                <Image
                  src={photo.src}
                  alt={photo.caption}
                  fill
                  loading="lazy"
                  className="object-cover transition-transform duration-500 group-hover/photo:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/photo:opacity-100 transition-opacity duration-300" />
                <p className="absolute inset-x-0 bottom-0 p-2 text-xs text-white translate-y-full group-hover/photo:translate-y-0 transition-transform duration-300">
                  {photo.caption}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
