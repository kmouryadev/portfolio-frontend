export interface CDALink {
  sys: {
    type: "Link";
    linkType: "Asset" | "Entry";
    id: string;
  };
}

export interface CDASys {
  id: string;
  type: "Entry" | "Asset";
  contentType?: { sys: CDALink };
  createdAt: string;
  updatedAt: string;
}

export interface CDAFile {
  url: string;
  contentType: string;
  details?: {
    size: number;
    image?: {
      width: number;
      height: number;
    };
  };
}

export interface CDAAsset {
  sys: CDASys;
  fields: {
    title?: string;
    file?: CDAFile;
  };
}

export interface CDAEntry<F = Record<string, unknown>> {
  sys: CDASys;
  fields: F;
}

export interface CDACollection<F = Record<string, unknown>> {
  total: number;
  skip: number;
  limit: number;
  items: CDAEntry<F>[];
  includes?: {
    Asset?: CDAAsset[];
    Entry?: CDAEntry<Record<string, unknown>>[];
  };
}

export interface SiteStatFields {
  value: string;
  label: string;
  animateTo?: number;
}

export interface SiteConfigFields {
  name: string;
  title: string;
  tagline: string;
  email: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  heroline1?: string;
  heroline2?: string;
  heroline3?: string;
  aboutBio?: string[];
  photoUrl?: CDALink;
  resume?: CDALink;
  stats?: CDALink[];
}

export interface ExperienceFields {
  company: string;
  companyShort?: string;
  role: string;
  period: string;
  stack?: string[];
  bullets?: string[];
  order?: number;
}

export interface ProjectFields {
  title: string;
  slug: string;
  type?: "company" | "personal";
  role?: string;
  tagline?: string;
  description?: string;
  coverImage?: CDALink;
  stack?: string[];
  isCompany?: boolean;
  architectureDiagram?: CDALink;
  architectureDescription?: string;
  features?: string[];
  challenges?: string[];
  learnings?: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  order?: number;
}

export interface SkillFields {
  label: string;
  category: string;
  icon?: CDALink;
  order?: number;
}

export interface SiteStat {
  value: string;
  label: string;
  animateTo: number | null;
}

export interface SiteConfig {
  name: string;
  title: string;
  tagline: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  heroLine1: string;
  heroLine2: string;
  heroLine3: string;
  aboutBio: string[];
  photoUrl: string;
  resumeUrl: string;
  stats: SiteStat[];
}

export interface Experience {
  company: string;
  companyShort: string;
  role: string;
  period: string;
  stack: string[];
  bullets: string[];
  order: number;
}

export interface Project {
  title: string;
  slug: string;
  type: "company" | "personal";
  role: string;
  tagline: string;
  description: string;
  coverImage: string | null;
  stack: string[];
  isCompany: boolean;
  architectureDiagram: string | null;
  architectureDescription: string;
  features: string[];
  challenges: string[];
  learnings: string[];
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  order: number;
}

export interface Skill {
  label: string;
  category: string;
  icon: string | null;
  order: number;
}

export interface SkillGroup {
  category: string;
  skills: Skill[];
}
