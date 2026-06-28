import type { Metadata } from "next";

import { Hero } from "@/components/sections/hero";
import { AboutSection } from "@/components/sections/about-section";
import { ServicesSection } from "@/components/sections/services-section";
import { CTASection } from "@/components/sections/cta-section";
import { AdvantagesSection } from "@/components/sections/advantages-section";
import { GeographySection } from "@/components/sections/geography-section";
import { GallerySection } from "@/components/sections/gallery-section";
import { getGallery, getServices } from "@/lib/db";
import { siteConfig } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Главная",
  description: siteConfig.description,
};

export default async function Home() {
  const gallery = await getGallery();
  const services = await getServices();

  return (
    <>
      <Hero />
      <AboutSection />
      <ServicesSection services={services} />
      <CTASection />
      <AdvantagesSection />
      <GeographySection />
      <GallerySection gallery={gallery} />
    </>
  );
}
