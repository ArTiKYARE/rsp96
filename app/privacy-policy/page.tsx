import type { Metadata } from "next";
import { legal } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: legal.privacyPolicy.title,
  description: "Политика конфиденциальности ООО «РемСтройПроект» в отношении обработки персональных данных.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              {legal.privacyPolicy.title}
            </h1>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container max-w-4xl">
          <Card className="border-border/50">
            <CardContent className="p-8 md:p-12">
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {legal.privacyPolicy.content.split("\n\n").map((paragraph, i) => (
                  <p key={i} className="text-muted-foreground leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
