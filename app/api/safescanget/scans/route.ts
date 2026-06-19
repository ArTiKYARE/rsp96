import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { listScans, startScan } from "@/lib/safescanget";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAuth();
    const scans = await listScans();
    return NextResponse.json(scans);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = (await request.json()) as { domainId?: string };
    if (!body.domainId) {
      return NextResponse.json({ error: "domainId is required" }, { status: 400 });
    }
    const scan = await startScan(body.domainId);
    return NextResponse.json(scan, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
