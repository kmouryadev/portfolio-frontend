import { cdaFetch } from "./client";
import { buildAssetMap, resolveAssetUrl, type AssetMap } from "./resolvers";
import type { Skill, SkillGroup, SkillFields } from "./types";

export function toSkill(fields: SkillFields, assetMap: AssetMap): Skill {
  return {
    label: fields.label || "",
    category: fields.category || "",
    icon: resolveAssetUrl(fields.icon, assetMap),
    order: fields.order || 0,
  };
}

export async function getSkillGroups(): Promise<SkillGroup[]> {
  const response = await cdaFetch<SkillFields>({
    content_type: "skill",
    order: "fields.category,fields.order",
  });

  const assetMap = buildAssetMap(response.includes?.Asset);

  const skills: Skill[] = response.items.map((item) =>
    toSkill(item.fields, assetMap),
  );

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
