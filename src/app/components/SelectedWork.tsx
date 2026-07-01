"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Project } from "@/lib/contentful";
import { fadeUp } from "@/lib/variants";

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
          <Link
            href="/projects"
            className="text-[var(--accent-light)] text-sm font-semibold no-underline border border-[var(--border)] px-5 py-2.5 rounded-lg whitespace-nowrap transition-colors duration-200 hover:border-[var(--accent-light)]"
          >
            View all →
          </Link>
        </motion.div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,460px),1fr))] gap-6">
          {projects.map((project, projectIndex) => (
            <motion.div
              key={project.slug}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: projectIndex * 0.1 }}
            >
              <Link
                href={`/projects/${project.slug}`}
                className="no-underline block h-full"
              >
                <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] overflow-hidden h-full flex flex-col transition-[border-color,transform] duration-200 hover:border-[var(--accent)] hover:-translate-y-0.5">
                  {project.coverImage ? (
                    <div className="h-[200px] relative overflow-hidden shrink-0">
                      <Image
                        src={project.coverImage}
                        alt={project.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  ) : (
                    <div className="h-[160px] bg-[var(--bg-card2)] flex items-center justify-center shrink-0">
                      <span className="font-display text-5xl text-[var(--border)]">
                        {"</>"}
                      </span>
                    </div>
                  )}

                  <div className="p-[clamp(20px,3vw,28px)] flex flex-col gap-3 flex-1">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-display font-bold text-[clamp(16px,2vw,19px)] leading-[1.3] text-[var(--text)]">
                        {project.title}
                      </h3>
                      <span className="text-[11px] text-[var(--text-dim)] border border-[var(--border)] px-2.5 py-[3px] rounded-full whitespace-nowrap shrink-0">
                        {project.type === "company"
                          ? "Company"
                          : "Personal"}
                      </span>
                    </div>

                    <p className="text-[clamp(13px,1.5vw,14px)] text-[var(--text-muted)] leading-[1.65] flex-1">
                      {project.tagline}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {project.stack.slice(0, 5).map((tech) => (
                        <span
                          key={tech}
                          className="font-mono bg-[var(--accent-dim)] text-[var(--accent-light)] px-2.5 py-1 rounded-full text-[11px]"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.stack.length > 5 && (
                        <span className="font-mono bg-[var(--bg-card2)] text-[var(--text-dim)] px-2.5 py-1 rounded-full text-[11px]">
                          +{project.stack.length - 5}
                        </span>
                      )}
                    </div>

                    <p className="text-[var(--accent-light)] text-[13px] font-semibold mt-1">
                      {project.isCompany
                        ? "Read case study →"
                        : "View project →"}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
