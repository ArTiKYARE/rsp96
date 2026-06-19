import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { requireAuth } from "@/lib/auth";
import { getVacancies, saveVacancies } from "@/lib/db";
import type { Vacancy, VacancyInput } from "@/lib/models";

export async function GET() {
  const vacancies = await getVacancies();
  return NextResponse.json(vacancies);
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = (await request.json()) as VacancyInput;

    if (!body.title || !body.description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const vacancies = await getVacancies();

    const newVacancy: Vacancy = {
      id: uuidv4(),
      title: body.title,
      location: body.location || "",
      schedule: body.schedule || "",
      salary: body.salary || "",
      description: body.description,
      requirements: Array.isArray(body.requirements)
        ? body.requirements.filter(Boolean)
        : [],
      responsibilities: Array.isArray(body.responsibilities)
        ? body.responsibilities.filter(Boolean)
        : [],
      conditions: Array.isArray(body.conditions)
        ? body.conditions.filter(Boolean)
        : [],
      isActive: body.isActive ?? true,
      createdAt: new Date().toISOString(),
    };

    vacancies.push(newVacancy);
    await saveVacancies(vacancies);

    return NextResponse.json(newVacancy, { status: 201 });
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
