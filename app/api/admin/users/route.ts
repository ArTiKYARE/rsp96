import { NextRequest, NextResponse } from "next/server";
import { createAdminUser, getAdminUsers, requireSuperAdmin } from "@/lib/auth";
import type { AdminPermission } from "@/lib/models";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireSuperAdmin();
    const users = await getAdminUsers();
    const safeUsers = users.map(({ passwordHash, ...u }) => u);
    return NextResponse.json(safeUsers);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireSuperAdmin();
    const body = (await request.json()) as {
      username?: string;
      role: "admin" | "manager";
      permissions: AdminPermission[];
    };

    if (!body.role || !Array.isArray(body.permissions)) {
      return NextResponse.json({ error: "role and permissions are required" }, { status: 400 });
    }

    const result = await createAdminUser({
      username: body.username,
      role: body.role,
      permissions: body.permissions,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
