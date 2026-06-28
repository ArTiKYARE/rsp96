import { promises as fs } from "fs";
import path from "path";
import { createHash } from "crypto";
import type { AdminConfig, AdminUser, GalleryItem, Service, Vacancy } from "./models";

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

export async function getHomeServices(limit = 4): Promise<Service[]> {
  const services = await getServices();
  return services
    .filter((s) => s.showOnHome)
    .slice(0, limit);
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
  const data = await readJsonFile<AdminConfig | Record<string, unknown> | null>(ADMIN_FILE, null);

  // Migrate legacy format { passwordHash: "..." } to new format
  if (data && "passwordHash" in data && typeof data.passwordHash === "string") {
    const migrated: AdminConfig = {
      users: [
        {
          id: crypto.randomUUID(),
          username: "admin",
          passwordHash: data.passwordHash,
          role: "superadmin",
          permissions: ["services", "vacancies", "gallery", "safescanget", "users"],
          createdAt: new Date().toISOString(),
        },
      ],
    };
    await saveAdminConfig(migrated);
    return migrated;
  }

  return data as AdminConfig | null;
}

export async function saveAdminConfig(config: AdminConfig): Promise<void> {
  return writeJsonFile(ADMIN_FILE, config);
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const config = await getAdminConfig();
  return config?.users ?? [];
}

export async function saveAdminUsers(users: AdminUser[]): Promise<void> {
  const config = await getAdminConfig();
  await saveAdminConfig({ users });
}

export async function createDefaultSuperAdmin(password = "admin123"): Promise<AdminUser> {
  const user: AdminUser = {
    id: crypto.randomUUID(),
    username: "admin",
    passwordHash: createHash("sha256").update(password).digest("hex"),
    role: "superadmin",
    permissions: ["services", "vacancies", "gallery", "safescanget", "users"],
    createdAt: new Date().toISOString(),
  };
  await saveAdminConfig({ users: [user] });
  return user;
}
