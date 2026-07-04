import Link from "next/link";
import { getProjects } from "@/lib/contentful/projects";
import { getSiteConfig } from "@/lib/contentful/site-config";
import Navbar from "../components/Navbar";
import ChatWidget from "../components/ChatWidget";
import ProjectCard from "../components/projects/ProjectCard";

export const revalidate = 60;

export default async function ProjectsPage() {
  const [config, projects] = await Promise.all([
    getSiteConfig(),
    getProjects(),
  ]);

  return (
    <>
      <Navbar config={config} />
      <main className="pt-20 min-h-screen">
        <section className="px-6 pt-[clamp(40px,6vw,60px)] pb-[clamp(60px,10vw,100px)]">
          <div className="max-w-[1100px] mx-auto">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[var(--text-muted)] no-underline text-sm font-medium mb-6 transition-colors duration-200 hover:text-[var(--accent-light)]"
            >
              ← Home
            </Link>
            <h1 className="font-display text-[clamp(32px,6vw,64px)] font-bold tracking-[-2px] mb-10">
              All Projects
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 min-[1100px]:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  index={index}
                />
              ))}
            </div>

            {!projects.length && (
              <p className="text-[var(--text-dim)] text-center py-[60px] text-[15px]">
                No projects yet.
              </p>
            )}
          </div>
        </section>
      </main>
      <ChatWidget />
    </>
  );
}
