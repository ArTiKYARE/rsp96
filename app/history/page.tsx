import Image from "next/image";
import type { Metadata } from "next";

import { SectionTitle } from "@/components/shared/section-title";
import { portfolio } from "@/lib/data";

export const metadata: Metadata = {
  title: "Портфолио",
  description:
    "Реализованные проекты ООО «РемСтройПроект»: грузоперевозки в районы Крайнего Севера, Ванкор, Восток Ойл, Бухта Север.",
};

export default function HistoryPage() {
  return (
    <>
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Портфолио
            </h1>
            <p className="text-xl text-muted-foreground">{portfolio.subtitle}</p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={portfolio.images[0].src}
                alt={portfolio.images[0].alt}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">География проектов</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {portfolio.description}
              </p>
            </div>
          </div>

          <SectionTitle title="Фото с объектов" centered />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {portfolio.images.map((image) => (
              <div
                key={image.src}
                className="relative aspect-square rounded-2xl overflow-hidden group"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
