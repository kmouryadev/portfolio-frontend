"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Project } from "@/lib/contentful";
import { getInitials } from "@/lib/string.utils";
import { renderEmphasis } from "@/lib/richText";
import { cn } from "@/lib/utils";
import TypeBadge from "./TypeBadge";
import TechChips from "./TechChips";

export default function ProjectCard({
  project,
  index = 0,
}: {
  project: Project;
  index?: number;
}) {
  const prefersReduced = useReducedMotion();
  const hasCaseStudy = project.challenges.length > 0;

  return (
    <motion.div
      initial={prefersReduced ? undefined : { opacity: 0, y: 20 }}
      whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      whileHover={prefersReduced ? undefined : { y: -4 }}
      className="h-full"
    >
      <Link
        href={`/projects/${project.slug}`}
        className="no-underline block h-full"
      >
        <div
          className={cn(
            "bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] overflow-hidden h-full flex flex-col transition-[border-color,box-shadow] duration-200 hover:border-[var(--border-hover)] hover:shadow-[0_6px_28px_rgba(99,102,241,0.18)]",
            hasCaseStudy && "shadow-[0_4px_20px_rgba(99,102,241,0.08)]",
          )}
        >
          {project.thumbnail ? (
            <div className="aspect-[16/10] relative overflow-hidden shrink-0">
              <Image
                src={project.thumbnail}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
            </div>
          ) : (
            <div className="aspect-[16/10] bg-[var(--bg-card2)] flex items-center justify-center shrink-0">
              <span className="font-display text-2xl font-bold text-[var(--accent)]">
                {getInitials(project.title)}
              </span>
            </div>
          )}

          <div className="p-[clamp(16px,2.5vw,24px)] flex flex-col gap-2.5 flex-1">
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-display font-bold text-[clamp(15px,2vw,17px)] leading-[1.3] text-[var(--text)]">
                {project.title}
              </h3>
              <TypeBadge type={project.projectType} />
            </div>

            {hasCaseStudy && (
              <span className="self-start text-[10px] font-semibold text-[var(--accent-light)] uppercase tracking-[0.08em]">
                Case study
              </span>
            )}

            <p className="text-[13px] text-[var(--text-muted)] leading-[1.6] flex-1 line-clamp-3">
              {renderEmphasis(project.summary)}
            </p>

            <TechChips skills={project.skills} fit="line" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
