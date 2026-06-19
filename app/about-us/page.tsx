import Image from "next/image";
import type { Metadata } from "next";

import { SectionTitle } from "@/components/shared/section-title";
import { AdvantagesSection } from "@/components/sections/advantages-section";
import { GeographySection } from "@/components/sections/geography-section";
import { GallerySection } from "@/components/sections/gallery-section";
import { aboutContent, stats } from "@/lib/data";
import { getGallery } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "О компании",
  description:
    "ООО «РемСтройПроект» — профессиональный логистический оператор на Крайнем Севере. Грузоперевозки, поставки, перевозка людей.",
};

export default async function AboutPage() {
  const gallery = await getGallery();

  return (
    <>
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              О компании
            </h1>
            <p className="text-xl text-muted-foreground">{aboutContent.subtitle}</p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-6">
              {aboutContent.intro.split("\n\n").map((paragraph, i) => (
                <p key={i} className="text-lg text-muted-foreground leading-relaxed text-balance">
                  {paragraph}
                </p>
              ))}
              {aboutContent.content.split("\n\n").map((paragraph, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed text-balance">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              <Image src={aboutContent.image} alt="Техника РСП" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container">
          <SectionTitle title="Факты о РСП" centered />
          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl bg-card border border-border/50 p-8 text-center"
              >
                <p className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Приглашаем к сотрудничеству</h2>
              <p className="text-muted-foreground mb-8">{aboutContent.partners.text}</p>

              <h3 className="text-xl font-semibold mb-4">Что мы предлагаем:</h3>
              <ul className="space-y-3 mb-8">
                {aboutContent.partners.offer.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Требования к подрядчику:</h3>
              <ul className="space-y-3">
                {aboutContent.partners.requirements.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <AdvantagesSection />
      <GeographySection />
      <GallerySection gallery={gallery} />
    </>
  );
}
