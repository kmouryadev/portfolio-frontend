"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import type { SiteConfig } from "@/lib/contentful";
import { fadeUp } from "@/lib/variants";
import { getInitials } from "@/lib/string.utils";
import Button from "./ui-components/Button";

export default function About({ config }: { config: SiteConfig }) {
  const initials = getInitials(config.name);

  return (
    <section
      id="about"
      className="py-[clamp(60px,10vw,100px)] px-6 border-t border-[var(--border)]"
    >
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-[clamp(40px,6vw,80px)] items-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="flex justify-center"
        >
          <div className="relative w-[clamp(200px,30vw,280px)] h-[clamp(200px,30vw,280px)] rounded-full overflow-hidden border-2 border-[var(--border)] shadow-[0_0_40px_rgba(99,102,241,0.25)] shrink-0">
            <div className="absolute inset-0 bg-[var(--bg-card2)] flex items-center justify-center">
              <span className="font-display text-[clamp(36px,8vw,72px)] font-bold text-[var(--accent)]">
                {initials}
              </span>
            </div>
            {config.photoUrl && (
              <Image
                src={config.photoUrl}
                alt={config.name}
                fill
                className="object-cover"
              />
            )}
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <p className="text-[var(--accent)] font-semibold text-[13px] tracking-[0.1em] uppercase mb-3">
            About
          </p>
          <h2 className="font-display text-[clamp(28px,4vw,44px)] font-bold tracking-[-1px] mb-6">
            A little about me
          </h2>

          <div className="flex flex-col gap-4">
            {config.aboutBio.map((paragraph) => (
              <p
                key={paragraph}
                className="text-[var(--text-muted)] text-[clamp(14px,1.5vw,16px)] leading-[1.8]"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="flex gap-3 mt-7 flex-wrap">
            <Button href={`mailto:${config.email}`}>Get in touch</Button>
            {config.resumeUrl && (
              <Button
                href={config.resumeUrl}
                target="_blank"
                rel="noreferrer"
                variant="secondary"
              >
                Download CV
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
