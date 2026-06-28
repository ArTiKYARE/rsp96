import type { Metadata } from "next";

import { geography } from "@/lib/data";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { RussiaMap } from "@/components/sections/russia-map";
import { PhosphorIcon } from "@/components/shared/phosphor-icon";

export const metadata: Metadata = {
  title: "География",
  description:
    "География работы ООО «РемСтройПроект»: ХМАО, ЯНАО, Красноярский край, Мурманская область, Республика Саха (Якутия).",
};

export default function GeographyPage() {
  return (
    <>
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <Breadcrumbs className="pb-2" />
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              География работы
            </h1>
            <p className="text-xl text-muted-foreground">{geography.subtitle}</p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Регионы присутствия</h2>
            <p className="text-muted-foreground">
              Работаем по самым сложным маршрутам России — от Урала до Арктики.
            </p>
          </div>
          <RussiaMap />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
            {geography.regions.map((region) => (
              <div
                key={region.name}
                className="flex items-start gap-3 rounded-xl bg-card border border-border/50 p-4 card-top-accent"
              >
                <div className="shrink-0 icon-box">
                  <PhosphorIcon name="MapPin" className="h-4 w-4" weight="duotone" />
                </div>
                <div>
                  <p className="font-semibold">{region.name}</p>
                  <p className="text-sm text-muted-foreground">{region.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
