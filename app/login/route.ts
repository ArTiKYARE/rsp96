import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

function response(request: NextRequest): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = "/admin/login/";
  return NextResponse.redirect(url, 308);
}

export async function GET(request: NextRequest) {
  return response(request);
}

export async function POST(request: NextRequest) {
  return response(request);
}

export async function PUT(request: NextRequest) {
  return response(request);
}

export async function DELETE(request: NextRequest) {
  return response(request);
}
