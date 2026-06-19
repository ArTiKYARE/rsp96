import { notFound } from "next/navigation";
import { ServiceForm } from "@/components/admin/service-form";
import { getServiceById } from "@/lib/db";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: Props) {
  const { id } = await params;
  const service = await getServiceById(id);

  if (!service) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Редактирование услуги</h1>
        <p className="text-muted-foreground mt-1">
          Измените поля шаблона и сохраните.
        </p>
      </div>
      <ServiceForm service={service} />
    </div>
  );
}
