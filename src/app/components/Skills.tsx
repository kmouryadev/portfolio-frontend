"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import type { SkillGroup } from "@/lib/contentful";
import { fadeUp } from "@/lib/variants";

export default function Skills({ skillGroups }: { skillGroups: SkillGroup[] }) {
  if (!skillGroups.length) return null;

  return (
    <section
      id="skills"
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
            Skills
          </p>
          <h2 className="font-display text-[clamp(28px,5vw,48px)] font-bold tracking-[-1px] mb-[clamp(32px,5vw,56px)]">
            What I work with
          </h2>
        </motion.div>

        <div className="flex flex-col gap-12">
          {skillGroups.map((group, groupIndex) => (
            <motion.div
              key={group.category}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: groupIndex * 0.08 }}
            >
              <p className="text-[var(--text-dim)] text-xs font-semibold uppercase tracking-[0.08em] mb-5">
                {group.category}
              </p>

              <div className="flex flex-wrap gap-[clamp(12px,2vw,20px)]">
                {group.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.label}
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: skillIndex * 0.05, duration: 0.3 }}
                    whileHover={{ scale: 1.08, y: -2 }}
                    title={skill.label}
                    className="flex flex-col items-center gap-2 cursor-default"
                  >
                    <div className="w-[52px] h-[52px] rounded-xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center p-2.5 transition-colors duration-200 hover:border-[var(--accent-light)]">
                      {skill.icon ? (
                        <Image
                          src={skill.icon}
                          alt={skill.label}
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      ) : (
                        <span className="font-display text-base font-bold text-[var(--accent)]">
                          {skill.label.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] text-[var(--text-muted)] font-medium text-center max-w-[60px] leading-[1.3]">
                      {skill.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
