import Link from "next/link";
import { Plus, Pencil, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ServiceDeleteButton } from "@/components/admin/service-delete-button";
import { getServices } from "@/lib/db";

export default async function AdminServicesPage() {
  const services = await getServices();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Услуги</h1>
          <p className="text-muted-foreground mt-1">
            Управление услугами на странице /services/
          </p>
        </div>
        <Link href="/admin/services/new/">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Добавить услугу
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Все услуги</CardTitle>
          <CardDescription>
            Нажмите на услугу, чтобы отредактировать. Новые услуги автоматически
            появляются на странице /services/.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {services.length === 0 ? (
            <p className="text-muted-foreground">Услуг пока нет.</p>
          ) : (
            <div className="divide-y divide-border">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between py-4 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{service.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        /services/{service.slug}/
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/services/${service.slug}/`}
                      target="_blank"
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9 transition-colors hover:bg-muted"
                    >
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </Link>
                    <Link
                      href={`/admin/services/${service.id}/`}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9 transition-colors hover:bg-muted"
                    >
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Link>
                    <ServiceDeleteButton id={service.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
