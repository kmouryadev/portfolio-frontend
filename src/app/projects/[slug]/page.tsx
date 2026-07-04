import {
  getProjectBySlug,
  getProjectSlugs,
  getProjects,
} from "@/lib/contentful/projects";
import { getSiteConfig } from "@/lib/contentful/site-config";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "../../components/Navbar";
import ChatWidget from "../../components/ChatWidget";
import CaseStudy from "./CaseStudy";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const slugs = await getProjectSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch (err) {
    console.warn(
      "[generateStaticParams] Contentful unavailable — pages will render on-demand:",
      err,
    );
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.title} — Karun Mourya`,
    description: project.summary,
    openGraph: project.thumbnail
      ? { images: [{ url: project.thumbnail }] }
      : undefined,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [config, project, allProjects] = await Promise.all([
    getSiteConfig(),
    getProjectBySlug(slug),
    getProjects(),
  ]);

  if (!project) notFound();

  const currentIndex = allProjects.findIndex((proj) => proj.slug === slug);
  const prev = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const next =
    currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : null;

  return (
    <>
      <Navbar config={config} />
      <main className="pt-20 min-h-screen">
        <CaseStudy config={config} project={project} prev={prev} next={next} />
      </main>
      <ChatWidget />
    </>
  );
}
