import { cdaFetch } from "./client";
import {
  buildAssetMap,
  buildEntryMap,
  resolveAssetUrl,
  resolveEntries,
} from "./resolvers";
import type { SiteConfig, SiteConfigFields, SiteStatFields } from "./types";

export async function getSiteConfig(): Promise<SiteConfig> {
  const response = await cdaFetch<SiteConfigFields>({
    content_type: "siteConfig",
    limit: 1,
  });

  const entry = response.items[0];
  if (!entry) {
    throw new Error("[Contentful] No siteConfig entry found in space");
  }

  const assetMap = buildAssetMap(response.includes?.Asset);
  const entryMap = buildEntryMap(response.includes?.Entry);
  const fields = entry.fields;

  const stats = resolveEntries<SiteStatFields>(fields.stats, entryMap).map(
    (stat) => ({
      value: stat.fields.value || "",
      label: stat.fields.label || "",
      animateTo: stat.fields.animateTo || null,
    }),
  );

  const nameParts = (fields.name || "").trim().split(/\s+/);
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ");

  return {
    name: fields.name || "",
    title: fields.title || "",
    tagline: fields.tagline || "",
    email: fields.email || "",
    phone: fields.phone || "",
    linkedin: fields.linkedin || "",
    github: fields.github || "",
    heroLine1: fields.heroline1 || firstName,
    heroLine2: fields.heroline2 || (lastName ? `${lastName}.` : ""),
    heroLine3: fields.heroline3 || fields.title || "",
    aboutBio: fields.aboutBio || [],
    photoUrl: resolveAssetUrl(fields.photoUrl, assetMap) || "",
    resumeUrl: resolveAssetUrl(fields.resume, assetMap) || "",
    stats,
    seoTitle: fields.seoTitle || fields.title || "",
    seoDescription: fields.seoDescription || fields.tagline || "",
    seoKeywords: fields.seoKeywords || [],
  };
}
