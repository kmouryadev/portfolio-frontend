"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Project, SiteConfig } from "@/lib/contentful";
import { fadeUp } from "@/lib/variants";
import Button from "@/app/components/ui-components/Button";
import TypeBadge from "@/app/components/projects/TypeBadge";
import TechChips from "@/app/components/projects/TechChips";
import ChallengeAccordion from "@/app/components/projects/ChallengeAccordion";
import { renderParagraphs } from "@/lib/richText";
import { SUB_LABEL_CLS, BODY_TEXT_CLS } from "@/app/components/projects/labelStyles";

const SECTION_LABEL_CLS =
  "inline-block bg-[var(--accent-dim)] text-[var(--accent-light)] font-bold text-[11px] tracking-[0.1em] uppercase px-3 py-1.5 rounded-full mb-5";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      className="pt-12 border-t border-[var(--border)]"
    >
      <p className={SECTION_LABEL_CLS}>{title}</p>
      {children}
    </motion.div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-none p-0 m-0">
      {items.map((item, itemIndex) => (
        <motion.li
          key={item}
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ delay: itemIndex * 0.06 }}
          className={`flex gap-3 py-[13px] ${itemIndex < items.length - 1 ? "border-b border-[var(--border)]" : ""}`}
        >
          <span className="text-[var(--accent)] shrink-0 mt-0.5">▸</span>
          <p className="text-[var(--text-muted)] text-[clamp(13px,1.5vw,15px)] leading-[1.7]">
            {item}
          </p>
        </motion.li>
      ))}
    </ul>
  );
}

function Header({ project }: { project: Project }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-[var(--text-muted)] no-underline text-sm font-medium mb-12 transition-colors duration-200 hover:text-[var(--accent-light)]"
      >
        ← All projects
      </Link>

      <div className="mb-4">
        <TypeBadge type={project.projectType} />
      </div>

      <h1 className="font-display text-[clamp(26px,5vw,48px)] font-bold tracking-[-1.5px] leading-[1.1] mb-3">
        {project.title}
      </h1>

      {(project.clientAlias || project.role.length > 0) && (
        <div className="flex flex-col gap-4 mt-4">
          {project.clientAlias && (
            <div>
              <p className={SUB_LABEL_CLS}>Client</p>
              <p className={BODY_TEXT_CLS}>{project.clientAlias}</p>
            </div>
          )}
          {project.role.length > 0 && (
            <div>
              <p className={SUB_LABEL_CLS}>My role</p>
              <ul className="list-none p-0 flex flex-col gap-1.5">
                {project.role.map((role) => (
                  <li key={role} className={`flex items-start gap-1.5 ${BODY_TEXT_CLS}`}>
                    <span className="text-[var(--accent)] shrink-0 mt-0.5">▸</span>
                    {role}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

function CaseStudyLayout({ project }: { project: Project }) {
  const hasFooterLinks = project.liveUrl || project.githubUrl;

  return (
    <div className="flex flex-col gap-12">
      <Header project={project} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-[var(--bg-card)] border border-[var(--accent)]/30 rounded-[14px] p-[clamp(20px,3vw,28px)] shadow-[0_8px_32px_rgba(99,102,241,0.12)]"
      >
        <p className={SECTION_LABEL_CLS}>Summary</p>
        <div className="flex flex-col gap-3 mb-4">
          {renderParagraphs(
            project.summary,
            "text-[var(--text-muted)] text-[clamp(14px,1.7vw,16px)] leading-[1.8]",
          )}
        </div>
        <TechChips skills={project.skills} max={8} />
      </motion.div>

      <Section title="Problems I solved">
        <ChallengeAccordion challenges={project.challenges} />
      </Section>

      {project.keyLearnings.length > 0 && (
        <Section title="What the project taught me">
          <ul className="list-none p-0 m-0 flex flex-col gap-3.5">
            {project.keyLearnings.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-[var(--accent)] shrink-0 mt-0.5">▸</span>
                <p className="text-[var(--text-muted)] text-[clamp(13px,1.5vw,15px)] leading-[1.7]">
                  {item}
                </p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {hasFooterLinks && (
        <Section title="Links">
          <div className="flex gap-3.5 flex-wrap">
            {project.liveUrl && (
              <Button
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                size="md"
              >
                Live Demo →
              </Button>
            )}
            {project.githubUrl && (
              <Button
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                size="md"
                variant="secondary"
              >
                GitHub →
              </Button>
            )}
          </div>
        </Section>
      )}
    </div>
  );
}

function SimpleLayout({ project }: { project: Project }) {
  const hasFooterLinks = project.liveUrl || project.githubUrl;

  return (
    <div className="flex flex-col gap-12">
      <Header project={project} />

      {project.thumbnail && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-xl overflow-hidden border border-[var(--border)] relative h-[clamp(220px,40vw,400px)]"
        >
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 860px) 100vw, 860px"
            priority
          />
        </motion.div>
      )}

      <div className="flex flex-col gap-3">
        {renderParagraphs(
          project.summary,
          "text-[var(--text-muted)] text-[clamp(14px,1.5vw,16px)] leading-[1.85]",
        )}
      </div>

      {project.features.length > 0 && (
        <Section title="What it does">
          <BulletList items={project.features} />
        </Section>
      )}

      {project.skills.length > 0 && (
        <div>
          <TechChips skills={project.skills} max={8} />
        </div>
      )}

      {hasFooterLinks && (
        <div className="flex gap-3.5 flex-wrap pt-4 border-t border-[var(--border)]">
          {project.liveUrl && (
            <Button
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              size="md"
            >
              Live Demo →
            </Button>
          )}
          {project.githubUrl && (
            <Button
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              size="md"
              variant="secondary"
            >
              GitHub →
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default function CaseStudy({
  project,
  prev,
  next,
}: {
  config: SiteConfig;
  project: Project;
  prev: Project | null;
  next: Project | null;
}) {
  const isCaseStudy = project.challenges.length > 0;

  return (
    <article className="max-w-[860px] mx-auto px-6 pt-[clamp(40px,6vw,60px)] pb-[clamp(60px,10vw,100px)] relative overflow-hidden">
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[radial-gradient(circle,rgba(99,102,241,0.09)_0%,transparent_70%)] pointer-events-none"
      />
      {isCaseStudy ? (
        <CaseStudyLayout project={project} />
      ) : (
        <SimpleLayout project={project} />
      )}

      {(prev || next) && (
        <div className="flex justify-between pt-12 mt-12 border-t border-[var(--border)] gap-4">
          {prev ? (
            <Link
              href={`/projects/${prev.slug}`}
              className="text-[var(--text-muted)] no-underline text-sm font-medium transition-colors duration-200 hover:text-[var(--accent-light)] max-w-[45%]"
            >
              ← {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/projects/${next.slug}`}
              className="text-[var(--text-muted)] no-underline text-sm font-medium transition-colors duration-200 hover:text-[var(--accent-light)] text-right max-w-[45%]"
            >
              {next.title} →
            </Link>
          ) : (
            <span />
          )}
        </div>
      )}
    </article>
  );
}
