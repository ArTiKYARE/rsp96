export interface Service {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  image: string;
  features: string[];
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
}

export interface AdminConfig {
  passwordHash: string;
}

export interface ServiceInput {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  image: string;
  features: string[];
}

export interface GalleryInput {
  src: string;
  alt: string;
}
