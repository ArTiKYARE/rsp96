import Link from "next/link";
import type { Metadata } from "next";

import { getServices } from "@/lib/db";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ServiceCard } from "@/components/service-card";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Услуги",
  description:
    "Логистические услуги РСП: перевозка грузов по зимникам, речным и морским путям, поставка инертных материалов, перевозка людей, ПРР.",
};

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <Breadcrumbs className="pb-2" />
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
          {services.length === 0 ? (
            <p className="text-center text-muted-foreground">Услуг пока нет.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} variant="minimal" />
              ))}
            </div>
          )}
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
