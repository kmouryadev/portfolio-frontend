import { cdaFetch } from "./client";
import { buildAssetMap, resolveAssetUrl } from "./resolvers";
import type { Achievement, AchievementFields } from "./types";

export async function getAchievements(): Promise<Achievement[]> {
  const response = await cdaFetch<AchievementFields>({
    content_type: "achievement",
    order: "fields.order",
  });

  const assetMap = buildAssetMap(response.includes?.Asset);

  return response.items.map((item) => ({
    title: item.fields.title || "",
    company: item.fields.company || "",
    type: item.fields.type || "Award",
    timeline: item.fields.timeline || "",
    description: item.fields.description || "",
    imageUrl: resolveAssetUrl(item.fields.image, assetMap),
    credentialUrl: item.fields.credentialUrl || null,
    order: item.fields.order || 0,
  }));
}
