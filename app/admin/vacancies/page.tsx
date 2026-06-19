import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VacancyDeleteButton } from "@/components/admin/vacancy-delete-button";
import { getVacancies } from "@/lib/db";

export default async function AdminVacanciesPage() {
  const vacancies = await getVacancies();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Вакансии</h1>
          <p className="text-muted-foreground mt-1">
            Управление вакансиями на странице /vacancies/
          </p>
        </div>
        <Link href="/admin/vacancies/new/">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Добавить вакансию
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Все вакансии</CardTitle>
          <CardDescription>
            Нажмите на вакансию, чтобы отредактировать. Активные вакансии
            отображаются на странице /vacancies/.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {vacancies.length === 0 ? (
            <p className="text-muted-foreground">Вакансий пока нет.</p>
          ) : (
            <div className="divide-y divide-border">
              {vacancies.map((vacancy) => (
                <div
                  key={vacancy.id}
                  className="flex items-center justify-between py-4 group"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{vacancy.title}</h3>
                      {vacancy.isActive ? (
                        <Badge variant="default">Активна</Badge>
                      ) : (
                        <Badge variant="secondary">Скрыта</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {vacancy.location && vacancy.schedule
                        ? `${vacancy.location} · ${vacancy.schedule}`
                        : vacancy.location || vacancy.schedule || "—"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/vacancies/${vacancy.id}/`}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9 transition-colors hover:bg-muted"
                    >
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Link>
                    <VacancyDeleteButton id={vacancy.id} />
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
