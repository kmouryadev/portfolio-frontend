import { cdaFetch } from "./client";
import {
  buildAssetMap,
  buildEntryMap,
  resolveAssetUrl,
  resolveEntries,
} from "./resolvers";
import type { AssetMap, EntryMap } from "./resolvers";
import { toSkill } from "./skills";
import type {
  Project,
  ProjectFields,
  Challenge,
  ChallengeFields,
  SkillFields,
  CDAEntry,
} from "./types";

function toChallenge(fields: ChallengeFields): Challenge {
  return {
    title: fields.title || "",
    context: fields.context || "",
    approach: fields.approach || null,
    outcome: fields.outcome || null,
    myTake: fields.myTake || null,
    learning: fields.learning || null,
    tags: fields.tags || [],
  };
}

function toProject(
  item: CDAEntry<ProjectFields>,
  assetMap: AssetMap,
  entryMap: EntryMap,
): Project {
  const fields = item.fields;

  const skills = resolveEntries<SkillFields>(fields.skill, entryMap).map(
    (entry) => toSkill(entry.fields, assetMap),
  );
  const challenges = resolveEntries<ChallengeFields>(
    fields.challenges,
    entryMap,
  ).map((entry) => toChallenge(entry.fields));

  return {
    title: fields.title || "",
    slug: (fields.slug || "").trim(),
    summary: fields.summary || "",
    projectType: fields.projectType || "personal",
    clientAlias: fields.clientAlias || null,
    skills,
    challenges,
    thumbnail: resolveAssetUrl(fields.thumbnail, assetMap),
    liveUrl: fields.liveUrl || null,
    githubUrl: fields.githubUrl || null,
    featured: fields.featured || false,
    order: fields.order || 0,
    role: fields.role || [],
    features: fields.features || [],
    keyLearnings: fields.keyLearnings || [],
  };
}

export async function getProjects(): Promise<Project[]> {
  const response = await cdaFetch<ProjectFields>({
    content_type: "project",
    order: "fields.order",
  });
  const assetMap = buildAssetMap(response.includes?.Asset);
  const entryMap = buildEntryMap(response.includes?.Entry);
  return response.items.map((item) => toProject(item, assetMap, entryMap));
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return (await getProjects()).filter((project) => project.featured);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug) || null;
}

export async function getProjectSlugs(): Promise<string[]> {
  const projects = await getProjects();
  return projects.map((project) => project.slug).filter(Boolean);
}
