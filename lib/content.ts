/**
 * Static site content loaded from JSON files (replaces the former database).
 * Edit components/services.json, components/employees.json and components/gallery.json to change content.
 */
import servicesData from '@/components/services.json';
import employeesData from '@/components/employees.json';
import galleryJson from '@/components/gallery.json';

// Explicit shape so an empty "images": [] isn't inferred as never[]
const galleryData: {
  groups: Array<{
    id: string;
    name: string;
    description?: string | null;
    images: Array<{ src: string; title?: string | null; description?: string | null }>;
  }>;
} = galleryJson;

export interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  from: boolean;
  duration: number | null;
  category: string | null;
  position: number;
}

export interface ServiceGroup {
  id: string;
  name: string;
  description: string | null;
  position: number;
  services: Service[];
}

export interface Employee {
  id: string;
  name: string;
  image: string | null;
  /** Names of the service groups this employee offers, e.g. "Manikúra" */
  specialties: string[];
}

export interface GalleryImage {
  id: string;
  src: string;
  title: string | null;
  description: string | null;
}

export interface GalleryGroup {
  id: string;
  name: string;
  description: string | null;
  images: GalleryImage[];
}

/** Turns "Modeláž Gelových nehtů" into "modelaz-gelovych-nehtu" */
function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const serviceGroups: ServiceGroup[] = servicesData.serviceGroups.map((group, groupIndex) => {
  const groupId = slugify(group.title);
  return {
    id: groupId,
    name: group.title.trim(),
    description: group.description?.trim() || null,
    position: groupIndex,
    services: group.services.map((service, serviceIndex) => ({
      id: `${groupId}-${serviceIndex}`,
      name: service.title.trim(),
      description: service.description?.trim() || null,
      price: service.price,
      from: false,
      duration: service.durationMinutes ?? null,
      category: null,
      position: serviceIndex,
    })),
  };
});

// Service title -> group name, used to derive employee specialties
const groupNameByServiceTitle = new Map(
  serviceGroups.flatMap((group) => group.services.map((service) => [service.name, group.name] as const))
);

const employees: Employee[] = employeesData.employees.map((employee) => {
  const offeredGroups = new Set(
    employee.services
      .map((service) => groupNameByServiceTitle.get(service.title.trim()))
      .filter((name): name is string => !!name)
  );
  return {
    id: slugify(employee.name),
    name: employee.name.trim(),
    image: employee.image || null,
    // Keep the order of the services page
    specialties: serviceGroups.map((group) => group.name).filter((name) => offeredGroups.has(name)),
  };
});

const galleryGroups: GalleryGroup[] = galleryData.groups.map((group) => ({
  id: group.id,
  name: group.name,
  description: group.description || null,
  images: group.images.map((image, index) => ({
    id: `${group.id}-${index}`,
    src: image.src,
    title: image.title || null,
    description: image.description || null,
  })),
}));

export function getServiceGroups(): ServiceGroup[] {
  return serviceGroups;
}

export function getEmployees(): Employee[] {
  return employees;
}

export function getGalleryGroups(): GalleryGroup[] {
  return galleryGroups;
}

export function getGalleryGroup(id: string): GalleryGroup | undefined {
  return galleryGroups.find((group) => group.id === id);
}
