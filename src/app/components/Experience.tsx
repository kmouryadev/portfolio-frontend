"use client";
import { motion } from "framer-motion";
import type { Experience } from "@/lib/contentful";
import { fadeUp } from "@/lib/variants";

export default function Experience({
  experience,
}: {
  experience: Experience[];
}) {
  if (!experience.length) return null;

  return (
    <section
      id="experience"
      className="py-[clamp(60px,10vw,100px)] px-6 border-t border-[var(--border)]"
    >
      <div className="max-w-[1100px] mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <p className="text-[var(--accent)] font-semibold text-[13px] tracking-[0.1em] uppercase mb-3">
            Experience
          </p>
          <h2 className="font-display text-[clamp(28px,5vw,48px)] font-bold tracking-[-1px] mb-[clamp(32px,5vw,56px)]">
            Where I&apos;ve worked
          </h2>
        </motion.div>

        {experience.map((exp) => (
          <div
            key={exp.company}
            className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-[clamp(24px,4vw,48px)] items-start mb-16"
          >
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="md:sticky md:top-[88px]"
            >
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-[clamp(16px,3vw,28px)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent)] flex items-center justify-center font-bold text-white font-display text-base shrink-0">
                    {exp.companyShort}
                  </div>
                  <p className="font-display font-bold text-[15px] leading-[1.3]">
                    {exp.company}
                  </p>
                </div>
                <p className="text-sm font-semibold text-[var(--accent-light)] mb-1">
                  {exp.role}
                </p>
                <p className="text-[13px] text-[var(--text-dim)] mb-5">
                  {exp.period}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {exp.stack.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono bg-[var(--accent-dim)] text-[var(--accent-light)] px-2.5 py-[3px] rounded-full text-[11px]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            <ul className="list-none p-0 m-0">
              {exp.bullets.map((bullet, bulletIndex) => (
                <motion.li
                  key={bullet}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: bulletIndex * 0.04 }}
                  className={`flex gap-3.5 py-4 ${bulletIndex < exp.bullets.length - 1 ? "border-b border-[var(--border)]" : ""}`}
                >
                  <span className="text-[var(--accent)] shrink-0 mt-[3px]">
                    ▸
                  </span>
                  <p className="text-[var(--text-muted)] text-[clamp(13px,1.5vw,15px)] leading-[1.7]">
                    {bullet}
                  </p>
                </motion.li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
