"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

import { cn } from "@/lib/utils";

const LABELS: Record<string, string> = {
  "about-us": "О компании",
  services: "Услуги",
  history: "Портфолио",
  gallery: "Галерея",
  vacancies: "Вакансии",
  docs: "Документы",
  contacts: "Контакты",
  geography: "География",
  "privacy-policy": "Политика конфиденциальности",
  consent: "Согласие на обработку данных",
  cookie: "Использование cookie",
  zimnik: "Перевозка по зимнику",
  people: "Перевозка людей",
  inert: "Инертные материалы",
  loading: "Погрузочно-разгрузочные работы",
};

export function Breadcrumbs({ className }: { className?: string }) {
  const pathname = usePathname();
  if (!pathname || pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  return (
    <nav aria-label="Хлебные крошки" className={cn("py-4", className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <li>
          <Link
            href="/"
            className="hover:text-primary flex items-center gap-1 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Главная</span>
          </Link>
        </li>
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const href = "/" + segments.slice(0, index + 1).join("/") + "/";
          const label = LABELS[segment] || decodeURIComponent(segment);

          return (
            <li key={segment + index} className="flex items-center gap-1.5">
              <ChevronRight className="h-4 w-4" />
              {isLast ? (
                <span
                  className="text-foreground font-medium"
                  aria-current="page"
                >
                  {label}
                </span>
              ) : (
                <Link
                  href={href}
                  className="hover:text-primary transition-colors"
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
