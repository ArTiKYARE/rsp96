"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  Home,
  Images,
  LogOut,
  PanelLeft,
  Shield,
  Users,
  UserCog,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { AdminSession } from "@/lib/auth";
import type { AdminPermission } from "@/lib/models";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  permission: AdminPermission;
}

const nav: NavItem[] = [
  { href: "/admin/services/", label: "Услуги", icon: Briefcase, permission: "services" },
  { href: "/admin/vacancies/", label: "Вакансии", icon: Users, permission: "vacancies" },
  { href: "/admin/gallery/", label: "Галерея", icon: Images, permission: "gallery" },
  { href: "/admin/safescanget/", label: "Проверка на уязвимости", icon: Shield, permission: "safescanget" },
  { href: "/admin/users/", label: "Пользователи", icon: UserCog, permission: "users" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login/" || pathname === "/admin/login";
  const [user, setUser] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLogin) return;
    fetch("/api/auth/me/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated) {
          setUser(data);
        }
      })
      .finally(() => setLoading(false));
  }, [isLogin]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout/", { method: "POST" });
    window.location.href = "/admin/login/";
  };

  if (isLogin) {
    return <>{children}</>;
  }

  const visibleNav = nav.filter((item) => {
    if (!user) return false;
    if (user.role === "superadmin") return true;
    return user.permissions.includes(item.permission);
  });

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col">
        <div className="p-6 border-b border-border">
          <Link href="/admin/" className="flex items-center gap-2 font-bold text-xl">
            <PanelLeft className="h-6 w-6 text-primary" />
            Админка РСП
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {visibleNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}

          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Home className="h-5 w-5" />
            На сайт
          </Link>
        </nav>

        <div className="p-4 border-t border-border space-y-3">
          {user && (
            <div className="px-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">{user.username}</p>
              <p className="text-xs capitalize">{user.role}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Выйти
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex-1 flex flex-col">
        <header className="md:hidden bg-card border-b border-border p-4 flex items-center justify-between">
          <Link href="/admin/" className="font-bold text-lg">
            Админка РСП
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-muted-foreground">
              <Home className="h-5 w-5" />
            </Link>
            <button onClick={handleLogout}>
              <LogOut className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-10 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
