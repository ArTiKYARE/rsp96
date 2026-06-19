import { GalleryManager } from "@/components/admin/gallery-manager";
import { getGallery } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const gallery = await getGallery();
  return <GalleryManager initialGallery={gallery} />;
}
