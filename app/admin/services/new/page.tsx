import { ServiceForm } from "@/components/admin/service-form";

export default function NewServicePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Новая услуга</h1>
        <p className="text-muted-foreground mt-1">
          Заполните шаблон. Услуга появится на странице /services/.
        </p>
      </div>
      <ServiceForm />
    </div>
  );
}
