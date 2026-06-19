import { redirect } from "next/navigation";
import { SafeScanGetManager } from "@/components/admin/safescanget-manager";
import { requirePermission } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminSafeScanGetPage() {
  try {
    await requirePermission("safescanget");
  } catch {
    redirect("/admin/");
  }

  return <SafeScanGetManager />;
}
