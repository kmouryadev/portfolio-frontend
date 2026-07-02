"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/lib/contentful";
import { cn } from "@/lib/utils";

type Filter = "all" | "company" | "personal";

export default function ProjectsClient({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(
    () => ({
      company: projects.filter((project) => project.type === "company").length,
      personal: projects.filter((project) => project.type === "personal")
        .length,
    }),
    [projects],
  );

  const filtered = useMemo(
    () =>
      filter === "all"
        ? projects
        : projects.filter((project) => project.type === filter),
    [projects, filter],
  );

  return (
    <section className="px-6 pt-[clamp(40px,6vw,60px)] pb-[clamp(60px,10vw,100px)]">
      <div className="max-w-[1100px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[var(--accent)] font-semibold text-[13px] tracking-[0.1em] uppercase mb-3">
            Portfolio
          </p>
          <h1 className="font-display text-[clamp(32px,6vw,64px)] font-bold tracking-[-2px] mb-10">
            All Projects
          </h1>
        </motion.div>

        <div className="flex gap-2 mb-12 flex-wrap">
          {(["all", "company", "personal"] as Filter[]).map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={cn(
                "px-5 py-2 rounded-full border text-sm font-medium cursor-pointer capitalize transition-all duration-200",
                filter === option
                  ? "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent-light)]"
                  : "border-[var(--border)] bg-transparent text-[var(--text-muted)]",
              )}
            >
              {option} {option !== "all" && `(${counts[option]})`}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, projectIndex) => (
              <motion.div
                key={project.slug}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: projectIndex * 0.06, duration: 0.35 }}
              >
                <Link
                  href={`/projects/${project.slug}`}
                  className="no-underline block h-full"
                >
                  <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] overflow-hidden h-full flex flex-col transition-[border-color,transform] duration-200 hover:border-[var(--accent)] hover:-translate-y-0.5">
                    {project.coverImage ? (
                      <div className="h-[180px] relative overflow-hidden shrink-0">
                        <Image
                          src={project.coverImage}
                          alt={project.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 33vw"
                        />
                      </div>
                    ) : (
                      <div className="h-[140px] bg-[var(--bg-card2)] flex items-center justify-center shrink-0">
                        <span className="font-display text-[40px] text-[var(--border)]">
                          {"</>"}
                        </span>
                      </div>
                    )}

                    <div className="p-[clamp(16px,2.5vw,24px)] flex flex-col gap-2.5 flex-1">
                      <div className="flex justify-between items-start gap-2">
                        <h2 className="font-display font-bold text-[clamp(15px,2vw,17px)] leading-[1.3] text-[var(--text)]">
                          {project.title}
                        </h2>
                        <span className="text-[10px] text-[var(--text-dim)] border border-[var(--border)] px-2 py-[2px] rounded-full whitespace-nowrap shrink-0">
                          {project.type === "company" ? "🏢" : "👤"}
                        </span>
                      </div>

                      <p className="text-[13px] text-[var(--text-muted)] leading-[1.6] flex-1">
                        {project.tagline}
                      </p>

                      <div className="flex flex-wrap gap-[5px]">
                        {project.stack.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="font-mono bg-[var(--accent-dim)] text-[var(--accent-light)] px-2 py-[3px] rounded-full text-[10px]"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.stack.length > 4 && (
                          <span className="font-mono bg-[var(--bg-card2)] text-[var(--text-dim)] px-2 py-[3px] rounded-full text-[10px]">
                            +{project.stack.length - 4}
                          </span>
                        )}
                      </div>

                      <p
                        className={`text-[13px] font-semibold mt-1 ${project.isCompany ? "text-[var(--accent-light)]" : "text-[var(--green)]"}`}
                      >
                        {project.isCompany
                          ? "Read case study →"
                          : "View project →"}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length && (
          <p className="text-[var(--text-dim)] text-center py-[60px] text-[15px]">
            No {filter} projects yet.
          </p>
        )}
      </div>
    </section>
  );
}
