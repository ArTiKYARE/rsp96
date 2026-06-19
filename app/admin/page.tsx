import { redirect } from "next/navigation";
import { getSession, hasPermission } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminIndexPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login/");
  }

  const defaultRoutes: { permission: Parameters<typeof hasPermission>[1]; href: string }[] = [
    { permission: "services", href: "/admin/services/" },
    { permission: "vacancies", href: "/admin/vacancies/" },
    { permission: "gallery", href: "/admin/gallery/" },
    { permission: "safescanget", href: "/admin/safescanget/" },
    { permission: "users", href: "/admin/users/" },
  ];

  for (const route of defaultRoutes) {
    if (hasPermission(session, route.permission)) {
      redirect(route.href);
    }
  }

  redirect("/admin/login/");
}
