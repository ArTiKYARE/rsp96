"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2, Upload, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { GalleryItem } from "@/lib/models";

interface GalleryManagerProps {
  initialGallery: GalleryItem[];
}

export function GalleryManager({ initialGallery }: GalleryManagerProps) {
  const router = useRouter();
  const [items, setItems] = useState<GalleryItem[]>(initialGallery);
  const [uploading, setUploading] = useState(false);
  const [alt, setAlt] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload/", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed");

      const createRes = await fetch("/api/gallery/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          src: uploadData.url,
          alt: alt || file.name,
        }),
      });
      const createData = await createRes.json();
      if (!createRes.ok) throw new Error(createData.error || "Save failed");

      setItems((prev) => [...prev, createData]);
      setAlt("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить фото из галереи?")) return;

    setDeleting(id);
    setError("");

    try {
      const res = await fetch(`/api/gallery/${id}/`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");

      setItems((prev) => prev.filter((item) => item.id !== id));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка удаления");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Галерея</h1>
        <p className="text-muted-foreground mt-1">
          Управление фотографиями на главной странице.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Загрузить фото</CardTitle>
          <CardDescription>
            Поддерживаются JPG, PNG, WebP, GIF до 10 МБ.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-lg bg-destructive/10 text-destructive px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="alt">Подпись (alt)</Label>
              <Input
                id="alt"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="Описание фотографии"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file">Файл</Label>
              <div className="relative">
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploading}
                  className="w-full relative"
                >
                  {uploading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="mr-2 h-4 w-4" />
                  )}
                  {uploading ? "Загрузка..." : "Выбрать фото"}
                  <input
                    id="file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Все фото</CardTitle>
          <CardDescription>
            {items.length === 0
              ? "В галерее пока нет фотографий."
              : `Всего фото: ${items.length}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <ImageIcon className="h-12 w-12 mb-4 opacity-50" />
              <p>Загрузите первое фото</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group relative aspect-square rounded-xl overflow-hidden border border-border bg-muted"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                  <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-xs text-white truncate">{item.alt}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deleting === item.id}
                    className="absolute top-2 right-2 p-2 rounded-full bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                  >
                    {deleting === item.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
