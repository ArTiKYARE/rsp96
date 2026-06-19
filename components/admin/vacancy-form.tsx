"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { Vacancy } from "@/lib/models";

const vacancySchema = z.object({
  title: z.string().min(1, "Обязательное поле"),
  location: z.string().optional(),
  schedule: z.string().optional(),
  salary: z.string().optional(),
  description: z.string().min(1, "Обязательное поле"),
  requirements: z.array(z.object({ value: z.string() })),
  responsibilities: z.array(z.object({ value: z.string() })),
  conditions: z.array(z.object({ value: z.string() })),
  isActive: z.boolean(),
});

type VacancyFormData = z.infer<typeof vacancySchema>;

type ListName = "requirements" | "responsibilities" | "conditions";

interface VacancyFormProps {
  vacancy?: Vacancy;
}

function stringArrayToFields(arr: string[] | undefined) {
  return (arr && arr.length > 0 ? arr : [""]).map((value) => ({ value }));
}

function StringListField({
  label,
  placeholder,
  name,
  control,
}: {
  label: string;
  placeholder: string;
  name: ListName;
  control: Control<VacancyFormData>;
}) {
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-2">
          <Input
            placeholder={`${placeholder} ${index + 1}`}
            {...control.register(`${name}.${index}.value` as const)}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => remove(index)}
            disabled={fields.length === 1}
          >
            <Trash className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ value: "" })}
      >
        <Plus className="mr-2 h-4 w-4" />
        Добавить пункт
      </Button>
    </div>
  );
}

export function VacancyForm({ vacancy }: VacancyFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<VacancyFormData>({
    resolver: zodResolver(vacancySchema),
    defaultValues: vacancy
      ? {
          title: vacancy.title,
          location: vacancy.location || "",
          schedule: vacancy.schedule || "",
          salary: vacancy.salary || "",
          description: vacancy.description,
          requirements: stringArrayToFields(vacancy.requirements),
          responsibilities: stringArrayToFields(vacancy.responsibilities),
          conditions: stringArrayToFields(vacancy.conditions),
          isActive: vacancy.isActive,
        }
      : {
          requirements: [{ value: "" }],
          responsibilities: [{ value: "" }],
          conditions: [{ value: "" }],
          isActive: true,
        },
  });

  const buildPayload = (data: VacancyFormData) => ({
    ...data,
    requirements: data.requirements.map((r) => r.value).filter(Boolean),
    responsibilities: data.responsibilities.map((r) => r.value).filter(Boolean),
    conditions: data.conditions.map((r) => r.value).filter(Boolean),
  });

  const onSubmit = async (data: VacancyFormData) => {
    setSubmitting(true);
    setError("");

    try {
      const url = vacancy
        ? `/api/vacancies/${vacancy.id}/`
        : "/api/vacancies/";
      const method = vacancy ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(data)),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Ошибка сохранения");
      }

      router.push("/admin/vacancies/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка сохранения");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
      {error && (
        <div className="rounded-lg bg-destructive/10 text-destructive px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Название вакансии</Label>
        <Input
          id="title"
          placeholder="Водитель-северник"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="location">Место работы</Label>
          <Input
            id="location"
            placeholder="Екатеринбург"
            {...register("location")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="schedule">График работы</Label>
          <Input
            id="schedule"
            placeholder="Вахта 60/30"
            {...register("schedule")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="salary">Зарплата</Label>
          <Input
            id="salary"
            placeholder="от 120 000 ₽"
            {...register("salary")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Описание вакансии</Label>
        <Textarea
          id="description"
          placeholder="Краткое описание вакансии..."
          rows={6}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <StringListField
        control={control}
        name="requirements"
        label="Требования"
        placeholder="Требование"
      />

      <StringListField
        control={control}
        name="responsibilities"
        label="Обязанности"
        placeholder="Обязанность"
      />

      <StringListField
        control={control}
        name="conditions"
        label="Условия"
        placeholder="Условие"
      />

      <div className="flex items-center gap-2">
        <Checkbox id="isActive" {...register("isActive")} />
        <Label htmlFor="isActive" className="font-normal cursor-pointer">
          Вакансия активна и отображается на сайте
        </Label>
      </div>

      <div className="pt-4 flex gap-4">
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {vacancy ? "Сохранить изменения" : "Создать вакансию"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/vacancies/")}
        >
          Отмена
        </Button>
      </div>
    </form>
  );
}
