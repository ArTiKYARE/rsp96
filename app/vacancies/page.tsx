import type { Metadata } from "next";
import { FileText } from "lucide-react";

import { SectionTitle } from "@/components/shared/section-title";
import { ContactForm } from "@/components/sections/contact-form";
import { vacancies } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Вакансии",
  description: "Вакансии ООО «РемСтройПроект». Присоединяйтесь к команде профессионалов в сфере логистики на Севере.",
};

export default function VacanciesPage() {
  return (
    <>
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              {vacancies.title}
            </h1>
            <p className="text-xl text-muted-foreground">{vacancies.subtitle}</p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <Card className="border-border/50">
                <CardContent className="p-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">Открытых вакансий нет</h2>
                  <p className="text-muted-foreground">{vacancies.text}</p>
                </CardContent>
              </Card>

              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Почему РСП?</h2>
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
