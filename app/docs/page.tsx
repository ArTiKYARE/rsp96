import Image from "next/image";
import type { Metadata } from "next";

import { docs } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Документы",
  description: "Реквизиты и учредительные документы ООО «РемСтройПроект». ОГРН, ИНН, КПП, юридический адрес.",
};

export default function DocsPage() {
  return (
    <>
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
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
              <h2 className="text-2xl font-bold mb-6">Реквизиты</h2>
              <Card className="border-border/50">
                <CardContent className="p-0">
                  {docs.requisites.map((item, index) => (
                    <div
                      key={item.label}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 ${
                        index !== docs.requisites.length - 1 ? "border-b border-border/50" : ""
                      }`}
                    >
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span className="font-medium">{item.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Учредительные документы</h2>
              <div className="grid grid-cols-2 gap-4">
                {docs.documents.map((doc) => (
                  <div
                    key={doc.src}
                    className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-border/50 group"
                  >
                    <Image
                      src={doc.src}
                      alt={doc.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <p className="text-sm font-medium text-white">{doc.title}</p>
                    </div>
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
