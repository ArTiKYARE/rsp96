export type AdminRole = "superadmin" | "admin" | "manager";

export type AdminPermission =
  | "services"
  | "vacancies"
  | "gallery"
  | "safescanget"
  | "users";

export interface AdminUser {
  id: string;
  username: string;
  passwordHash: string;
  role: AdminRole;
  permissions: AdminPermission[];
  createdAt: string;
}

export interface AdminConfig {
  users: AdminUser[];
}

export interface ServiceFaqItem {
  question: string;
  answer: string;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  image: string;
  features: string[];
  faq?: ServiceFaqItem[];
  showOnHome?: boolean;
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  title?: string;
  location?: string;
  description?: string;
}

export interface ServiceInput {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  image: string;
  features: string[];
  faq?: ServiceFaqItem[];
  showOnHome?: boolean;
}

export interface GalleryInput {
  src: string;
  alt: string;
  title?: string;
  location?: string;
  description?: string;
}

export interface Vacancy {
  id: string;
  title: string;
  location?: string;
  schedule?: string;
  salary?: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  conditions: string[];
  isActive: boolean;
  createdAt: string;
}

export interface VacancyInput {
  title: string;
  location?: string;
  schedule?: string;
  salary?: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  conditions: string[];
  isActive: boolean;
}
