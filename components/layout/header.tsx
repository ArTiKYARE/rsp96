"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Phone, Mail, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { SiteSearch } from "./site-search";
import { siteConfig, navigation } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-18 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-10 w-10 overflow-hidden rounded-lg">
            <Image
              src="/images/logo.svg"
              alt={siteConfig.name}
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold leading-tight tracking-tight">{siteConfig.shortName}</p>
            <p className="text-[10px] text-muted-foreground leading-tight">РемСтройПроект</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navigation.main.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {item.label}
              {pathname === item.href && (
                <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-primary" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <div className="hidden xl:flex items-center gap-4 mr-2">
            <a
              href={siteConfig.phoneHref}
              className="flex items-center gap-1.5 text-sm font-medium hover:text-primary transition-colors whitespace-nowrap"
            >
              <Phone className="h-3.5 w-3.5" />
              {siteConfig.phone}
            </a>
          </div>

          <SiteSearch />

          <Button
            variant="ghost"
            size="icon"
            className="hidden xl:flex"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Переключить тему"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <Link
            href="/contacts"
            className={buttonVariants({
              className: "hidden sm:flex bg-accent hover:bg-accent/90 text-accent-foreground",
            })}
          >
            Оставить заявку
          </Link>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Открыть меню"
                />
              }
            >
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-80">
              <SheetTitle className="sr-only">Меню навигации</SheetTitle>
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
                    <div className="relative h-10 w-10 overflow-hidden rounded-lg">
                      <Image src="/images/logo.svg" alt={siteConfig.name} fill className="object-contain" priority />
                    </div>
                    <div>
                      <p className="text-sm font-bold leading-tight">{siteConfig.shortName}</p>
                      <p className="text-[10px] text-muted-foreground leading-tight">РемСтройПроект</p>
                    </div>
                  </Link>
                </div>

                <nav className="flex flex-col gap-2">
                  {navigation.main.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "px-4 py-3 text-base font-medium rounded-lg transition-colors",
                        pathname === item.href
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                <div className="mt-auto space-y-4 pb-8">
                  <a
                    href={siteConfig.phoneHref}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted"
                  >
                    <Phone className="h-5 w-5 text-primary" />
                    <span className="font-medium">{siteConfig.phone}</span>
                  </a>
                  <a
                    href={siteConfig.emailHref}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted"
                  >
                    <Mail className="h-5 w-5 text-primary" />
                    <span className="font-medium">{siteConfig.email}</span>
                  </a>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  >
                    {theme === "dark" ? "Светлая тема" : "Тёмная тема"}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
