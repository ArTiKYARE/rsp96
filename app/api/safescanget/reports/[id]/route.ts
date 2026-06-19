import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getReport } from "@/lib/safescanget";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const report = await getReport(id);
    return NextResponse.json(report);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    // Forward SafeScanGet "report not available" as 400 so the client can detect running scans.
    const status = message.includes("Report not available") || message.includes("running state") ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
