import { notFound } from "next/navigation";
import { VacancyForm } from "@/components/admin/vacancy-form";
import { getVacancyById } from "@/lib/db";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditVacancyPage({ params }: Props) {
  const { id } = await params;
  const vacancy = await getVacancyById(id);

  if (!vacancy) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Редактирование вакансии</h1>
        <p className="text-muted-foreground mt-1">
          Измените поля шаблона и сохраните.
        </p>
      </div>
      <VacancyForm vacancy={vacancy} />
    </div>
  );
}
