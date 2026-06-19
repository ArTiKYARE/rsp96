import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { requireAuth } from "@/lib/auth";
import { getServices, saveServices } from "@/lib/db";
import type { Service, ServiceInput } from "@/lib/models";

export async function GET() {
  const services = await getServices();
  return NextResponse.json(services);
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = (await request.json()) as ServiceInput;

    if (!body.slug || !body.title || !body.shortDescription || !body.description || !body.image) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const services = await getServices();

    if (services.some((s) => s.slug === body.slug)) {
      return NextResponse.json(
        { error: "Service with this slug already exists" },
        { status: 409 }
      );
    }

    const newService: Service = {
      id: uuidv4(),
      slug: body.slug,
      title: body.title,
      shortDescription: body.shortDescription,
      description: body.description,
      image: body.image,
      features: Array.isArray(body.features) ? body.features.filter(Boolean) : [],
    };

    services.push(newService);
    await saveServices(services);

    return NextResponse.json(newService, { status: 201 });
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
