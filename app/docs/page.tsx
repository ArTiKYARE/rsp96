import type { Metadata } from "next";

import { docs } from "@/lib/data";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { DocumentPreview } from "@/components/docs/document-preview";
import { CopyRequisitesButton } from "@/components/docs/copy-requisites-button";

export const metadata: Metadata = {
  title: "Документы",
  description: "Реквизиты и учредительные документы ООО «РемСтройПроект». ОГРН, ИНН, КПП, юридический адрес.",
};

export const dynamic = "force-dynamic";

export default function DocsPage() {
  return (
    <>
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <Breadcrumbs className="pb-2" />
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Документы
            </h1>
            <p className="text-xl text-muted-foreground">{docs.subtitle}</p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Реквизиты</h2>
                <CopyRequisitesButton requisites={docs.requisites} />
              </div>
              <Card className="relative border-border/50 card-top-accent transition-shadow hover:shadow-elevated">
                <CardHeader className="pb-0">
                  <CardTitle className="text-lg">ООО «РЕМСТРОЙПРОЕКТ»</CardTitle>
                </CardHeader>
                <CardContent className="p-0 pt-2">
                  {docs.requisites.map((item, index) => (
                    <div key={item.label}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-4">
                        <span className="text-sm text-muted-foreground">{item.label}</span>
                        <span className="font-medium sm:text-right">{item.value}</span>
                      </div>
                      {index !== docs.requisites.length - 1 && (
                        <Separator className="mx-4 w-[calc(100%-2rem)]" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Учредительные документы</h2>
              <div className="grid grid-cols-2 gap-4">
                {docs.documents.map((doc, index) => (
                  <div key={doc.src} className="relative">
                    {index === 0 && (
                      <Badge
                        variant="secondary"
                        className="absolute top-3 left-3 z-10 bg-black/50 text-white border-transparent backdrop-blur-sm"
                      >
                        Карточка
                      </Badge>
                    )}
                    <DocumentPreview src={doc.src} title={doc.title} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
