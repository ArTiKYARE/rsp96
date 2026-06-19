import type { Metadata } from "next";
import { Phone, Mail, MapPin, User } from "lucide-react";

function formatTelHref(phone: string) {
  return "tel:" + phone.replace(/[^\d+]/g, "");
}

import { siteConfig, contacts } from "@/lib/data";
import { ContactForm } from "@/components/sections/contact-form";
import { MapSection } from "@/components/sections/map-section";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Контакты",
  description:
    "Контакты ООО «РемСтройПроект». Телефон, email, адрес в Екатеринбурге, руководство компании.",
};

export default function ContactsPage() {
  return (
    <>
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Контакты
            </h1>
            <p className="text-xl text-muted-foreground">{contacts.subtitle}</p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <div className="space-y-8">
              <div className="grid gap-4">
                <a
                  href={siteConfig.phoneHref}
                  className="flex items-center gap-4 rounded-2xl bg-card border border-border/50 p-6 hover:border-primary/30 transition-colors"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Телефон</p>
                    <p className="text-lg font-semibold">{siteConfig.phone}</p>
                  </div>
                </a>
                <a
                  href={siteConfig.emailHref}
                  className="flex items-center gap-4 rounded-2xl bg-card border border-border/50 p-6 hover:border-primary/30 transition-colors"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-lg font-semibold">{siteConfig.email}</p>
                  </div>
                </a>
                <div className="flex items-center gap-4 rounded-2xl bg-card border border-border/50 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Адрес</p>
                    <p className="text-lg font-semibold">{siteConfig.address}</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6">Руководство и контакты</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {contacts.persons.map((person) => (
                    <Card key={person.name} className="border-border/50">
                      <CardContent className="p-6">
                        <p className="text-sm font-semibold text-foreground mb-1">
                          {person.role}
                        </p>
                        <p className="text-base font-medium">{person.name}</p>
                        {person.note && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {person.note}
                          </p>
                        )}
                        {person.phone && (
                          <a
                            href={formatTelHref(person.phone)}
                            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline mt-3"
                          >
                            <Phone className="h-3.5 w-3.5" />
                            {person.phone}
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Написать нам</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Мы находимся в Екатеринбурге</h2>
            <p className="text-muted-foreground">{siteConfig.address}</p>
          </div>
          <MapSection />
        </div>
      </section>
    </>
  );
}
