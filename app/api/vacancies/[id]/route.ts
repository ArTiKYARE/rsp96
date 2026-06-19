import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getVacancies, saveVacancies } from "@/lib/db";
import type { Vacancy, VacancyInput } from "@/lib/models";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const vacancies = await getVacancies();
  const vacancy = vacancies.find((v) => v.id === id);

  if (!vacancy) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(vacancy);
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = (await request.json()) as Partial<VacancyInput>;

    const vacancies = await getVacancies();
    const index = vacancies.findIndex((v) => v.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const existing = vacancies[index];

    const updated: Vacancy = {
      ...existing,
      title: body.title ?? existing.title,
      location: body.location ?? existing.location,
      schedule: body.schedule ?? existing.schedule,
      salary: body.salary ?? existing.salary,
      description: body.description ?? existing.description,
      requirements: Array.isArray(body.requirements)
        ? body.requirements.filter(Boolean)
        : existing.requirements,
      responsibilities: Array.isArray(body.responsibilities)
        ? body.responsibilities.filter(Boolean)
        : existing.responsibilities,
      conditions: Array.isArray(body.conditions)
        ? body.conditions.filter(Boolean)
        : existing.conditions,
      isActive: body.isActive ?? existing.isActive,
    };

    vacancies[index] = updated;
    await saveVacancies(vacancies);

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

    const vacancies = await getVacancies();
    const filtered = vacancies.filter((v) => v.id !== id);

    if (filtered.length === vacancies.length) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await saveVacancies(filtered);
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
