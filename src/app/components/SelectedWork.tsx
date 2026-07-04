"use client";
import { motion } from "framer-motion";
import type { Project } from "@/lib/contentful";
import { fadeUp } from "@/lib/variants";
import ProjectCard from "./projects/ProjectCard";
import Button from "./ui-components/Button";

export default function SelectedWork({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;

  return (
    <section
      id="projects"
      className="py-[clamp(60px,10vw,100px)] px-6 border-t border-[var(--border)]"
    >
      <div className="max-w-[1100px] mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="flex justify-between items-end mb-[clamp(32px,5vw,56px)] flex-wrap gap-4"
        >
          <div>
            <p className="text-[var(--accent)] font-semibold text-[13px] tracking-[0.1em] uppercase mb-3">
              Selected Work
            </p>
            <h2 className="font-display text-[clamp(28px,5vw,48px)] font-bold tracking-[-1px]">
              Things I&apos;ve built
            </h2>
          </div>
          <Button href="/projects" variant="secondary" size="md" className="w-auto">
            View all →
          </Button>
        </motion.div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
