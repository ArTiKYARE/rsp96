import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { requireAuth } from "@/lib/auth";
import { getGallery, saveGallery } from "@/lib/db";
import type { GalleryInput, GalleryItem } from "@/lib/models";

export async function GET() {
  const gallery = await getGallery();
  return NextResponse.json(gallery);
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = (await request.json()) as GalleryInput;

    if (!body.src || !body.alt) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const gallery = await getGallery();
    const newItem: GalleryItem = {
      id: uuidv4(),
      src: body.src,
      alt: body.alt,
    };

    gallery.push(newItem);
    await saveGallery(gallery);

    return NextResponse.json(newItem, { status: 201 });
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
