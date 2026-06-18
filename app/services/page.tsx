import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import { services } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Услуги",
  description:
    "Логистические услуги РСП: перевозка грузов по зимникам, речным и морским путям, поставка инертных материалов, перевозка людей, ПРР.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Услуги
            </h1>
            <p className="text-xl text-muted-foreground">
              Комплексные логистические решения для работы в экстремальных климатических условиях
              Крайнего Севера и Арктики.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {services.map((service) => (
              <Link key={service.id} href={`/services/${service.slug}/`} className="group block h-full">
                <Card className="h-full overflow-hidden border-border/50 bg-card transition-all duration-300 hover:shadow-xl hover:border-primary/30">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  </div>
                  <CardContent className="p-6">
                    <h2 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {service.title}
                    </h2>
                    <p className="text-muted-foreground mb-4">{service.shortDescription}</p>
                    <span className="inline-flex items-center text-sm font-medium text-primary">
                      Подробнее
                      <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Нужна консультация?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Свяжитесь с нами, чтобы обсудить задачу и получить индивидуальное предложение.
          </p>
          <Link href="/contacts/" className={buttonVariants({ size: "lg" })}>
            Оставить заявку
          </Link>
        </div>
      </section>
    </>
  );
}
