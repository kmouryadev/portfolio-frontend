import type { Document } from "@contentful/rich-text-types";

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
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
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

export type ProjectType = "personal" | "professional";

export interface ProjectFields {
  title: string;
  slug: string;
  summary: string;
  projectType: ProjectType;
  clientAlias?: string;
  skill?: CDALink[];
  challenges?: CDALink[];
  thumbnail?: CDALink;
  projectLink?: CDALink[];
  featured?: boolean;
  order?: number;
  role?: string[];
  features?: string[];
  keyLearnings?: string[];
}

export interface ChallengeFields {
  title: string;
  context: string;
  approach?: Document;
  outcome?: string;
  myTake?: string;
  learning?: string;
  tags?: string[];
}

export interface ProjectLinkFields {
  label: string;
  url: string;
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
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
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

export interface Challenge {
  title: string;
  context: string;
  approach: Document | null;
  outcome: string | null;
  myTake: string | null;
  learning: string | null;
  tags: string[];
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  title: string;
  slug: string;
  summary: string;
  projectType: ProjectType;
  clientAlias: string | null;
  skills: Skill[];
  challenges: Challenge[];
  thumbnail: string | null;
  links: ProjectLink[];
  featured: boolean;
  order: number;
  role: string[];
  features: string[];
  keyLearnings: string[];
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
