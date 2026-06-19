import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { listDomains, createDomain } from "@/lib/safescanget";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAuth();
    const domains = await listDomains();
    return NextResponse.json(domains);
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
    const body = (await request.json()) as { domain?: string };
    if (!body.domain) {
      return NextResponse.json({ error: "Domain is required" }, { status: 400 });
    }
    const domain = await createDomain(body.domain);
    return NextResponse.json(domain, { status: 201 });
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
