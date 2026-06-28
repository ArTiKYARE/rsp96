"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus, Trash, Upload } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Service } from "@/lib/models";

const serviceSchema = z.object({
  slug: z
    .string()
    .min(1, "Обязательное поле")
    .regex(/^[a-z0-9-]+$/, "Только латинские буквы, цифры и дефис"),
  title: z.string().min(1, "Обязательное поле"),
  shortDescription: z.string().min(1, "Обязательное поле"),
  description: z.string().min(1, "Обязательное поле"),
  image: z.string().min(1, "Загрузите изображение"),
  features: z.array(
    z.object({
      value: z.string().min(1, "Пункт не может быть пустым"),
    })
  ),
  faq: z.array(
    z.object({
      question: z.string().min(1, "Вопрос не может быть пустым"),
      answer: z.string().min(1, "Ответ не может быть пустым"),
    })
  ).optional(),
  showOnHome: z.boolean().optional(),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  service?: Service;
}

export function ServiceForm({ service }: ServiceFormProps) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: service
      ? {
          slug: service.slug,
          title: service.title,
          shortDescription: service.shortDescription,
          description: service.description,
          image: service.image,
          features: service.features.map((f) => ({ value: f })),
          faq: service.faq?.map((item) => ({ question: item.question, answer: item.answer })) ?? [],
          showOnHome: service.showOnHome ?? false,
        }
      : {
          features: [{ value: "" }],
          faq: [],
          showOnHome: false,
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
  });

  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({
    control,
    name: "faq",
  });

  const imageValue = watch("image");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload/", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setValue("image", data.url, { shouldValidate: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: ServiceFormData) => {
    setSubmitting(true);
    setError("");

    const payload = {
      ...data,
      features: data.features.map((f) => f.value),
      faq: data.faq?.map((item) => ({ question: item.question, answer: item.answer })) ?? [],
    };

    try {
      const url = service
        ? `/api/services/${service.id}/`
        : "/api/services/";
      const method = service ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Ошибка сохранения");
      }

      router.push("/admin/services/");
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

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="slug">URL-идентификатор (slug)</Label>
          <Input
            id="slug"
            placeholder="naprimer-zimnik"
            {...register("slug")}
          />
          {errors.slug && (
            <p className="text-sm text-destructive">{errors.slug.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Название услуги</Label>
          <Input
            id="title"
            placeholder="Перевозка груза по «зимнику»"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="shortDescription">Краткое описание (для списка)</Label>
        <Textarea
          id="shortDescription"
          placeholder="Надёжная доставка грузов по зимним дорогам..."
          rows={3}
          {...register("shortDescription")}
        />
        {errors.shortDescription && (
          <p className="text-sm text-destructive">
            {errors.shortDescription.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Полное описание</Label>
        <Textarea
          id="description"
          placeholder="Подробное описание услуги. Абзацы разделяйте пустой строкой."
          rows={12}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Изображение</Label>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            className="relative"
          >
            {uploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Загрузить изображение
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={uploading}
            />
          </Button>
          {imageValue && (
            <span className="text-sm text-muted-foreground truncate max-w-[200px]">
              {imageValue}
            </span>
          )}
        </div>
        {errors.image && (
          <p className="text-sm text-destructive">{errors.image.message}</p>
        )}
        {imageValue && (
          <div className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden border border-border mt-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageValue}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      <div className="space-y-3">
        <Label>Что входит в услугу</Label>
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <Input
              placeholder={`Пункт ${index + 1}`}
              {...register(`features.${index}.value` as const)}
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

      <div className="flex items-start gap-3 rounded-lg border border-border/50 p-4">
        <Controller
          name="showOnHome"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="showOnHome"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <div className="space-y-1">
          <Label htmlFor="showOnHome">Показывать на главной странице</Label>
          <p className="text-xs text-muted-foreground">
            На главной отображается не более 4 выбранных услуг.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Часто задаваемые вопросы (FAQ)</Label>
        {faqFields.map((field, index) => (
          <div key={field.id} className="space-y-2 rounded-lg border border-border/50 p-4">
            <div className="flex items-start gap-2">
              <Input
                placeholder="Вопрос"
                {...register(`faq.${index}.question` as const)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeFaq(index)}
              >
                <Trash className="h-4 w-4 text-destructive" />
              </Button>
            </div>
            {errors.faq?.[index]?.question && (
              <p className="text-sm text-destructive">
                {errors.faq[index]?.question?.message}
              </p>
            )}
            <Textarea
              placeholder="Ответ"
              rows={3}
              {...register(`faq.${index}.answer` as const)}
            />
            {errors.faq?.[index]?.answer && (
              <p className="text-sm text-destructive">
                {errors.faq[index]?.answer?.message}
              </p>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => appendFaq({ question: "", answer: "" })}
        >
          <Plus className="mr-2 h-4 w-4" />
          Добавить вопрос
        </Button>
      </div>

      <div className="pt-4 flex gap-4">
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {service ? "Сохранить изменения" : "Создать услугу"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/services/")}
        >
          Отмена
        </Button>
      </div>
    </form>
  );
}
