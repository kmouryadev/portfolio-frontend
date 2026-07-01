import { cdaFetch } from "./client";
import { buildAssetMap, resolveAssetUrl } from "./resolvers";
import type { Skill, SkillGroup, SkillFields } from "./types";

export async function getSkillGroups(): Promise<SkillGroup[]> {
  const response = await cdaFetch<SkillFields>({
    content_type: "skill",
    order: "fields.category,fields.order",
  });

  const assetMap = buildAssetMap(response.includes?.Asset);

  const skills: Skill[] = response.items.map((item) => ({
    label: item.fields.label || "",
    category: item.fields.category || "",
    icon: resolveAssetUrl(item.fields.icon, assetMap),
    order: item.fields.order || 0,
  }));

  const groupMap = new Map<string, Skill[]>();
  for (const skill of skills) {
    const existing = groupMap.get(skill.category);
    if (existing) {
      existing.push(skill);
    } else {
      groupMap.set(skill.category, [skill]);
    }
  }

  return Array.from(groupMap.entries()).map(([category, skillList]) => ({
    category,
    skills: skillList,
  }));
}
