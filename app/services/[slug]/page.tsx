import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { PhosphorIcon } from "@/components/shared/phosphor-icon";

import { getServiceBySlug } from "@/lib/db";
import { siteConfig } from "@/lib/data";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CostCalculationForm } from "@/components/sections/cost-calculation-form";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.shortDescription,
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <>
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <Breadcrumbs className="pb-2" />
          <Link
            href="/services/"
            className={buttonVariants({ variant: "ghost", size: "sm", className: "mb-6" })}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Все услуги
          </Link>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              {service.title}
            </h1>
            <p className="text-xl text-muted-foreground">{service.shortDescription}</p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl lg:sticky lg:top-28">
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover"
                loading="lazy"
              />
            </div>
            <div className="space-y-8">
              <div className="space-y-4">
                {service.description.split("\n\n").map((paragraph, i) => (
                  <p key={i} className="text-muted-foreground leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              <Card className="relative border-primary/20 bg-primary/5 card-top-accent">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Что входит в услугу</h2>
                  <ul className="space-y-3">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <PhosphorIcon name="Check" className="h-5 w-5 text-primary shrink-0 mt-0.5" weight="bold" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {service.faq && service.faq.length > 0 && (
                <Card className="relative border-border/50 bg-card card-top-accent">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <PhosphorIcon name="Question" className="h-5 w-5 text-primary" weight="duotone" />
                      <h2 className="text-xl font-bold">Часто задаваемые вопросы</h2>
                    </div>
                    <Accordion className="w-full">
                      {service.faq.map((item, index) => (
                        <AccordionItem key={index} value={`faq-${index}`}>
                          <AccordionTrigger>{item.question}</AccordionTrigger>
                          <AccordionContent>
                            <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contacts/" className={buttonVariants({ size: "lg", className: "bg-accent hover:bg-accent/90 text-accent-foreground" })}>
                  Заказать услугу
                </Link>
                <a href={siteConfig.phoneHref} className={buttonVariants({ size: "lg", variant: "outline" })}>
                  {siteConfig.phone}
                </a>
              </div>

              <CostCalculationForm serviceTitle={service.title} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
