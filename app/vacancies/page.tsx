import type { Metadata } from "next";
import { FileText, MapPin, Clock, Banknote } from "lucide-react";

import { SectionTitle } from "@/components/shared/section-title";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ContactForm } from "@/components/sections/contact-form";
import { vacancies as vacanciesContent } from "@/lib/data";
import { getVacancies } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Вакансии",
  description:
    "Вакансии ООО «РемСтройПроект». Присоединяйтесь к команде профессионалов в сфере логистики на Севере.",
};

export const dynamic = "force-dynamic";

export default async function VacanciesPage() {
  const allVacancies = await getVacancies();
  const activeVacancies = allVacancies.filter((v) => v.isActive);

  return (
    <>
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <Breadcrumbs className="pb-2" />
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              {vacanciesContent.title}
            </h1>
            <p className="text-xl text-muted-foreground">
              {vacanciesContent.subtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <div className="space-y-8">
              {activeVacancies.length === 0 ? (
                <Card className="border-border/50">
                  <CardContent className="p-8 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">
                      Открытых вакансий нет
                    </h2>
                    <p className="text-muted-foreground">
                      {vacanciesContent.text}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {activeVacancies.map((vacancy) => (
                    <Card
                      key={vacancy.id}
                      className="border-border/50 overflow-hidden"
                    >
                      <CardContent className="p-6 md:p-8">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <h2 className="text-xl md:text-2xl font-bold">
                            {vacancy.title}
                          </h2>
                          <Badge variant="default">Открыта</Badge>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                          {vacancy.location && (
                            <span className="flex items-center gap-1.5">
                              <MapPin className="h-4 w-4" />
                              {vacancy.location}
                            </span>
                          )}
                          {vacancy.schedule && (
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4" />
                              {vacancy.schedule}
                            </span>
                          )}
                          {vacancy.salary && (
                            <span className="flex items-center gap-1.5">
                              <Banknote className="h-4 w-4" />
                              {vacancy.salary}
                            </span>
                          )}
                        </div>

                        <p className="text-muted-foreground whitespace-pre-line mb-6">
                          {vacancy.description}
                        </p>

                        <div className="grid md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
                          {vacancy.requirements.length > 0 && (
                            <div>
                              <h3 className="font-semibold mb-2">Требования</h3>
                              <ul className="space-y-1.5 text-sm text-muted-foreground">
                                {vacancy.requirements.map((item, i) => (
                                  <li
                                    key={i}
                                    className="flex items-start gap-2"
                                  >
                                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {vacancy.responsibilities.length > 0 && (
                            <div>
                              <h3 className="font-semibold mb-2">Обязанности</h3>
                              <ul className="space-y-1.5 text-sm text-muted-foreground">
                                {vacancy.responsibilities.map((item, i) => (
                                  <li
                                    key={i}
                                    className="flex items-start gap-2"
                                  >
                                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {vacancy.conditions.length > 0 && (
                            <div>
                              <h3 className="font-semibold mb-2">Условия</h3>
                              <ul className="space-y-1.5 text-sm text-muted-foreground">
                                {vacancy.conditions.map((item, i) => (
                                  <li
                                    key={i}
                                    className="flex items-start gap-2"
                                  >
                                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}

              <div>
                <SectionTitle
                  title="Почему РСП?"
                  centered={false}
                  className="mb-4"
                />
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    Стабильная работа в крупнейших нефтегазовых проектах
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    Официальное трудоустройство и конкурентная зарплата
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    Развитие и обучение в сфере северной логистики
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Отправить резюме</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
