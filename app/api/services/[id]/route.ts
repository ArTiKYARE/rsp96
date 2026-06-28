import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getServices, saveServices } from "@/lib/db";
import type { Service, ServiceInput } from "@/lib/models";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const services = await getServices();
  const service = services.find((s) => s.id === id || s.slug === id);

  if (!service) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(service);
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = (await request.json()) as Partial<ServiceInput>;

    const services = await getServices();
    const index = services.findIndex((s) => s.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const existing = services[index];

    if (body.slug && body.slug !== existing.slug) {
      if (services.some((s) => s.slug === body.slug)) {
        return NextResponse.json(
          { error: "Service with this slug already exists" },
          { status: 409 }
        );
      }
    }

    const updated: Service = {
      ...existing,
      slug: body.slug ?? existing.slug,
      title: body.title ?? existing.title,
      shortDescription: body.shortDescription ?? existing.shortDescription,
      description: body.description ?? existing.description,
      image: body.image ?? existing.image,
      features: Array.isArray(body.features)
        ? body.features.filter(Boolean)
        : existing.features,
      faq: Array.isArray(body.faq)
        ? body.faq.filter((item) => item && item.question && item.answer)
        : existing.faq,
      showOnHome: body.showOnHome === true ? true : body.showOnHome === false ? false : existing.showOnHome,
    };

    services[index] = updated;
    await saveServices(services);

    return NextResponse.json(updated);
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

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    await requireAuth();
    const { id } = await params;

    const services = await getServices();
    const filtered = services.filter((s) => s.id !== id);

    if (filtered.length === services.length) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await saveServices(filtered);
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
