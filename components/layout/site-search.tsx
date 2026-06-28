"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { siteConfig, navigation, services, portfolio } from "@/lib/data";
import { cn } from "@/lib/utils";

interface SearchItem {
  title: string;
  description: string;
  href: string;
  category: string;
}

export function SiteSearch({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const index = useMemo<SearchItem[]>(() => {
    return [
      {
        title: "Главная",
        description: siteConfig.description,
        href: "/",
        category: "Страницы",
      },
      ...navigation.main.map((item) => ({
        title: item.label,
        description: "",
        href: item.href,
        category: "Разделы",
      })),
      ...services.map((service) => ({
        title: service.title,
        description: service.shortDescription,
        href: `/services/${service.slug}/`,
        category: "Услуги",
      })),
      ...portfolio.projects.map((project) => ({
        title: project.title,
        description: project.description.slice(0, 90) + "...",
        href: "/history/",
        category: "Портфолио",
      })),
    ];
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return index.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    );
  }, [query, index]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className={cn("hidden sm:flex", className)}
            aria-label="Поиск по сайту"
          />
        }
      >
        <Search className="h-5 w-5" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Поиск по сайту</DialogTitle>
        </DialogHeader>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Например, перевозка людей или Ванкор"
            className="pl-9 pr-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-muted"
              aria-label="Очистить"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
        <div className="max-h-[60vh] overflow-y-auto -mx-4 px-4">
          {results.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6">
              {query ? "Ничего не найдено. Попробуйте другой запрос." : "Введите запрос, чтобы найти раздел или услугу."}
            </p>
          ) : (
            <ul className="space-y-1 py-2">
              {results.map((item, i) => (
                <li key={i}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg p-3 hover:bg-muted transition-colors"
                  >
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.category}
                      {item.description ? ` · ${item.description}` : ""}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
