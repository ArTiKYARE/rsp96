import type { Metadata } from "next";

import { getGallery } from "@/lib/db";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { GalleryGrid } from "@/components/gallery/gallery-grid";

export const metadata: Metadata = {
  title: "Галерея",
  description:
    "Фотогалерея ООО «РемСтройПроект»: объекты, техника, грузы и северные маршруты.",
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const gallery = await getGallery();

  return (
    <>
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <Breadcrumbs className="pb-2" />
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Галерея
            </h1>
            <p className="text-xl text-muted-foreground">
              Фото с объектов: техника, грузы и северные маршруты.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container">
          <GalleryGrid gallery={gallery} />
        </div>
      </section>
    </>
  );
}
