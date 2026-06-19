import { redirect } from "next/navigation";
import { VacancyForm } from "@/components/admin/vacancy-form";
import { requirePermission } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NewVacancyPage() {
  try {
    await requirePermission("vacancies");
  } catch {
    redirect("/admin/");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Новая вакансия</h1>
        <p className="text-muted-foreground mt-1">
          Заполните шаблон. Вакансия появится на странице /vacancies/.
        </p>
      </div>
      <VacancyForm />
    </div>
  );
}
