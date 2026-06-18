import type { Metadata } from "next";
import { legal } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: legal.consent.title,
  description: "Согласие на обработку персональных данных посетителей сайта ООО «РемСтройПроект».",
};

export default function ConsentPage() {
  return (
    <>
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              {legal.consent.title}
            </h1>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container max-w-4xl">
          <Card className="border-border/50">
            <CardContent className="p-8 md:p-12">
              {legal.consent.content.split("\n\n").map((paragraph, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
