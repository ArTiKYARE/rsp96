import { promises as fs } from "fs";
import path from "path";
import type { AdminConfig, GalleryItem, Service, Vacancy } from "./models";

const DATA_DIR = path.join(process.cwd(), "data");
const SERVICES_FILE = path.join(DATA_DIR, "services.json");
const GALLERY_FILE = path.join(DATA_DIR, "gallery.json");
const VACANCIES_FILE = path.join(DATA_DIR, "vacancies.json");
const ADMIN_FILE = path.join(DATA_DIR, "admin.json");

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // ignore
  }
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  await ensureDataDir();
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content) as T;
  } catch {
    return fallback;
  }
}

async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// Services
export async function getServices(): Promise<Service[]> {
  return readJsonFile<Service[]>(SERVICES_FILE, []);
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const services = await getServices();
  return services.find((s) => s.slug === slug) ?? null;
}

export async function getServiceById(id: string): Promise<Service | null> {
  const services = await getServices();
  return services.find((s) => s.id === id) ?? null;
}

export async function saveServices(services: Service[]): Promise<void> {
  return writeJsonFile(SERVICES_FILE, services);
}

// Gallery
export async function getGallery(): Promise<GalleryItem[]> {
  return readJsonFile<GalleryItem[]>(GALLERY_FILE, []);
}

export async function saveGallery(gallery: GalleryItem[]): Promise<void> {
  return writeJsonFile(GALLERY_FILE, gallery);
}

// Vacancies
export async function getVacancies(): Promise<Vacancy[]> {
  return readJsonFile<Vacancy[]>(VACANCIES_FILE, []);
}

export async function getVacancyById(id: string): Promise<Vacancy | null> {
  const vacancies = await getVacancies();
  return vacancies.find((v) => v.id === id) ?? null;
}

export async function saveVacancies(vacancies: Vacancy[]): Promise<void> {
  return writeJsonFile(VACANCIES_FILE, vacancies);
}

// Admin
export async function getAdminConfig(): Promise<AdminConfig | null> {
  return readJsonFile<AdminConfig | null>(ADMIN_FILE, null);
}

export async function saveAdminConfig(config: AdminConfig): Promise<void> {
  return writeJsonFile(ADMIN_FILE, config);
}
