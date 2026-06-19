import { NextRequest, NextResponse } from "next/server";
import { createSession, ensureAdminConfig, verifyCredentials } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await ensureAdminConfig();

    const { username, password } = await request.json();

    if (!username || typeof username !== "string" || !password || typeof password !== "string") {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    const user = await verifyCredentials(username.trim(), password);
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    await createSession(user);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
