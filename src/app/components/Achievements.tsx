"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Achievement } from "@/lib/contentful";
import { fadeUp } from "@/lib/variants";

export default function Achievements({
  achievements,
}: {
  achievements: Achievement[];
}) {
  if (!achievements.length) return null;

  return (
    <section
      id="achievements"
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
            Achievements
          </p>
          <h2 className="font-display text-[clamp(28px,5vw,48px)] font-bold tracking-[-1px] mb-[clamp(32px,5vw,56px)]">
            Awards &amp; certifications
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => (
            <motion.div
              key={`${achievement.title}-${achievement.company}`}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (index % 3) * 0.08 }}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden flex flex-col"
            >
              {achievement.imageUrl && (
                <div className="relative w-full aspect-[4/5] bg-[var(--bg)]">
                  <Image
                    src={achievement.imageUrl}
                    alt={achievement.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}

              <div className="p-[clamp(16px,3vw,24px)] flex flex-col gap-2 flex-1">
                <span className="font-mono self-start bg-[var(--accent-dim)] text-[var(--accent-light)] px-2.5 py-[3px] rounded-full text-[11px]">
                  {achievement.type}
                </span>

                <p className="font-display font-bold text-[16px] leading-[1.3] mt-1">
                  {achievement.title}
                </p>

                <p className="text-sm font-semibold text-[var(--accent-light)]">
                  {achievement.company}
                </p>

                <p className="text-[13px] text-[var(--text-dim)]">
                  {achievement.timeline}
                </p>

                {achievement.description && (
                  <p className="text-[var(--text-muted)] text-[13px] leading-[1.7] mt-1">
                    {achievement.description}
                  </p>
                )}

                {achievement.credentialUrl && (
                  <a
                    href={achievement.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] font-semibold text-[var(--accent)] mt-auto pt-3 hover:underline"
                  >
                    View credential →
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
