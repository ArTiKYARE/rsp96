import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

const UPLOADS_DIR = path.join(/*turbopackIgnore: true*/ process.cwd(), "data", "uploads");
const LEGACY_UPLOADS_DIR = path.join(/*turbopackIgnore: true*/ process.cwd(), "public", "images", "uploads");

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  if (!filename || filename.includes("..") || filename.includes("/")) {
    return new NextResponse("Invalid filename", { status: 400 });
  }

  const locations = [path.join(UPLOADS_DIR, filename), path.join(LEGACY_UPLOADS_DIR, filename)];

  for (const filePath of locations) {
    try {
      const buffer = await readFile(filePath);
      const ext = path.extname(filename).toLowerCase();
      const contentType =
        {
          ".jpg": "image/jpeg",
          ".jpeg": "image/jpeg",
          ".png": "image/png",
          ".webp": "image/webp",
          ".gif": "image/gif",
        }[ext] || "application/octet-stream";

      return new NextResponse(buffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch {
      // try next location
    }
  }

  return new NextResponse("Not found", { status: 404 });
}
