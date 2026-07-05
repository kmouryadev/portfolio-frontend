"use client";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project, ProjectType } from "@/lib/contentful";
import { cn } from "@/lib/utils";
import ProjectCard from "../components/projects/ProjectCard";
import Button from "../components/ui-components/Button";

type Filter = "all" | ProjectType;

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(
    () => ({
      personal: projects.filter((project) => project.projectType === "personal")
        .length,
      professional: projects.filter(
        (project) => project.projectType === "professional",
      ).length,
    }),
    [projects],
  );

  const filtered = useMemo(
    () =>
      filter === "all"
        ? projects
        : projects.filter((project) => project.projectType === filter),
    [projects, filter],
  );

  return (
    <>
      <div className="flex gap-2 mb-10 flex-wrap">
        {(["all", "professional", "personal"] as Filter[]).map((option) => (
          <Button
            key={option}
            variant="custom"
            onClick={() => setFilter(option)}
            className={cn(
              "px-5 py-2 rounded-full border text-sm font-medium cursor-pointer capitalize transition-colors duration-200",
              filter === option
                ? "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent-light)]"
                : "border-[var(--border)] bg-transparent text-[var(--text-muted)]",
            )}
          >
            {option} {option !== "all" && `(${counts[option]})`}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 min-[1100px]:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((project, index) => (
            <motion.div
              key={project.slug}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <ProjectCard project={project} index={index} showAllSkills />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {!filtered.length && (
        <p className="text-[var(--text-dim)] text-center py-[60px] text-[15px]">
          No {filter} projects yet.
        </p>
      )}
    </>
  );
}
