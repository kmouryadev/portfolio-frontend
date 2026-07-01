import { cdaFetch } from "./client";
import { buildAssetMap, resolveAssetUrl } from "./resolvers";
import type { AssetMap } from "./resolvers";
import type { Project, ProjectFields, CDAEntry } from "./types";

function toProject(
  item: CDAEntry<ProjectFields>,
  assetMap: AssetMap,
): Project {
  const fields = item.fields;
  return {
    title: fields.title || "",
    slug: fields.slug || "",
    type: fields.type || "personal",
    role: fields.role || "",
    tagline: fields.tagline || "",
    description: fields.description || "",
    coverImage: resolveAssetUrl(fields.coverImage, assetMap),
    stack: fields.stack || [],
    isCompany: fields.isCompany || false,
    architectureDiagram: resolveAssetUrl(fields.architectureDiagram, assetMap),
    architectureDescription: fields.architectureDescription || "",
    features: fields.features || [],
    challenges: fields.challenges || [],
    learnings: fields.learnings || [],
    liveUrl: fields.liveUrl || "",
    githubUrl: fields.githubUrl || "",
    featured: fields.featured || false,
    order: fields.order || 0,
  };
}

export async function getAllProjects(): Promise<Project[]> {
  const response = await cdaFetch<ProjectFields>({
    content_type: "project",
    order: "fields.order",
  });
  const assetMap = buildAssetMap(response.includes?.Asset);
  return response.items.map((item) => toProject(item, assetMap));
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const response = await cdaFetch<ProjectFields>({
    content_type: "project",
    "fields.featured": true,
    order: "fields.order",
  });
  const assetMap = buildAssetMap(response.includes?.Asset);
  return response.items.map((item) => toProject(item, assetMap));
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const response = await cdaFetch<ProjectFields>({
    content_type: "project",
    "fields.slug": slug,
    limit: 1,
  });
  if (!response.items.length) return null;
  const assetMap = buildAssetMap(response.includes?.Asset);
  return toProject(response.items[0], assetMap);
}

export async function getProjectSlugs(): Promise<string[]> {
  const response = await cdaFetch<ProjectFields>({
    content_type: "project",
    select: "fields.slug",
  });
  return response.items.map((item) => item.fields.slug || "").filter(Boolean);
}
