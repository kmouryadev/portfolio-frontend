import { cdaFetch } from "./client";
import type { Experience, ExperienceFields } from "./types";

export async function getExperience(): Promise<Experience[]> {
  const response = await cdaFetch<ExperienceFields>({
    content_type: "experience",
    order: "fields.order",
  });

  return response.items.map((item) => ({
    company: item.fields.company || "",
    companyShort: item.fields.companyShort || item.fields.company?.[0] || "?",
    role: item.fields.role || "",
    period: item.fields.period || "",
    stack: item.fields.stack || [],
    bullets: item.fields.bullets || [],
    order: item.fields.order || 0,
  }));
}
