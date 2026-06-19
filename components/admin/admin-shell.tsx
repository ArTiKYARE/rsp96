"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Images, LogOut, PanelLeft, Users } from "lucide-react";

const nav = [
  { href: "/admin/services/", label: "Услуги", icon: Briefcase },
  { href: "/admin/vacancies/", label: "Вакансии", icon: Users },
  { href: "/admin/gallery/", label: "Галерея", icon: Images },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login/" || pathname === "/admin/login";

  const handleLogout = async () => {
    await fetch("/api/auth/logout/", { method: "POST" });
    window.location.href = "/admin/login/";
  };

  if (isLogin) {
    return <>{children}</>;
  }

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
          {nav.map((item) => {
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
        </nav>

        <div className="p-4 border-t border-border">
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
          <button onClick={handleLogout}>
            <LogOut className="h-5 w-5 text-muted-foreground" />
          </button>
        </header>

        <main className="flex-1 p-6 lg:p-10 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
