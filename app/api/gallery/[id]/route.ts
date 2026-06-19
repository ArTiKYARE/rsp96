import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import { requireAuth } from "@/lib/auth";
import { getGallery, saveGallery } from "@/lib/db";

interface Params {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    await requireAuth();
    const { id } = await params;

    const gallery = await getGallery();
    const item = gallery.find((g) => g.id === id);

    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const filtered = gallery.filter((g) => g.id !== id);
    await saveGallery(filtered);

    // Try to delete the file if it's an uploaded file
    if (item.src.startsWith("/images/uploads/")) {
      try {
        const filePath = path.join(process.cwd(), "public", item.src);
        await unlink(filePath);
      } catch {
        // ignore file deletion errors
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
