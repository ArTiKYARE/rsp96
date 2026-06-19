import { redirect } from "next/navigation";
import { requireSuperAdmin } from "@/lib/auth";
import { UsersManager } from "@/components/admin/users-manager";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  try {
    await requireSuperAdmin();
  } catch {
    redirect("/admin/");
  }

  return <UsersManager />;
}
