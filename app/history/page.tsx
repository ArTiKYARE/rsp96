import type { Metadata } from "next";

import { portfolio } from "@/lib/data";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PortfolioProject } from "@/components/sections/portfolio-project";
import { HistoryGeographySection } from "@/components/sections/history-geography-section";

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
          <Breadcrumbs className="pb-2" />
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

      <HistoryGeographySection />
    </>
  );
}
