import { Hero } from "@/components/sections/hero";
import { AboutSection } from "@/components/sections/about-section";
import { ServicesSection } from "@/components/sections/services-section";
import { CTASection } from "@/components/sections/cta-section";
import { AdvantagesSection } from "@/components/sections/advantages-section";
import { GeographySection } from "@/components/sections/geography-section";
import { GallerySection } from "@/components/sections/gallery-section";
import { siteConfig } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Главная",
  description: siteConfig.description,
};

export default function Home() {
  return (
    <>
      <Hero />
      <AboutSection />
      <ServicesSection />
      <CTASection />
      <AdvantagesSection />
      <GeographySection />
      <GallerySection />
    </>
  );
}
