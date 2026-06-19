import { redirect } from "next/navigation";
import { GalleryManager } from "@/components/admin/gallery-manager";
import { getGallery } from "@/lib/db";
import { requirePermission } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  try {
    await requirePermission("gallery");
  } catch {
    redirect("/admin/");
  }

  const gallery = await getGallery();
  return <GalleryManager initialGallery={gallery} />;
}
