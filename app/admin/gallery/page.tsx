import { GalleryManager } from "@/components/admin/gallery-manager";
import { getGallery } from "@/lib/db";

export default async function AdminGalleryPage() {
  const gallery = await getGallery();
  return <GalleryManager initialGallery={gallery} />;
}
