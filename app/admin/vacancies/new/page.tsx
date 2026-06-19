import { VacancyForm } from "@/components/admin/vacancy-form";

export default function NewVacancyPage() {
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
