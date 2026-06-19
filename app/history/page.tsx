import type { Metadata } from "next";

import { portfolio } from "@/lib/data";
import { PortfolioProject } from "@/components/sections/portfolio-project";

export const metadata: Metadata = {
  title: "Портфолио",
  description:
    "Реализованные проекты ООО «РемСтройПроект»: грузоперевозки в районы Крайнего Севера, Ванкор, Восток Ойл, Бухта Север.",
};

export default function HistoryPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-20 md:py-28 lg:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

        <div className="container relative z-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              Наши проекты
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-6">
              Портфолио
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              {portfolio.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="relative py-16 lg:py-28 dark bg-background text-foreground overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5" />
        <div className="container relative z-10">
          <div className="max-w-6xl mx-auto">
            {portfolio.projects.map((project, index) => (
              <PortfolioProject
                key={project.id}
                project={project}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              География наших работ
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {portfolio.description}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
