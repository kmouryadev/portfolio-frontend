"use client";
import { motion } from "framer-motion";
import type { SiteConfig } from "@/lib/contentful";
import { fadeUp } from "@/lib/variants";

export default function Contact({ config }: { config: SiteConfig }) {
  const socialLinks = [
    config.linkedin && { label: "LinkedIn", href: config.linkedin },
    config.github && { label: "GitHub", href: config.github },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <section
      id="contact"
      className="py-[clamp(60px,10vw,100px)] px-6 border-t border-[var(--border)]"
    >
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="max-w-[680px] mx-auto text-center"
      >
        <p className="text-[var(--accent)] font-semibold text-[13px] tracking-[0.1em] uppercase mb-3">
          Contact
        </p>
        <h2 className="font-display text-[clamp(32px,6vw,60px)] font-bold tracking-[-1.5px] mb-5">
          Let&apos;s work together
        </h2>
        <p className="text-[var(--text-muted)] text-[clamp(14px,2vw,17px)] leading-[1.75] mb-10">
          I always love to connect with others to share knowledge. If
          you&apos;re building something interesting and need a full stack
          engineer who ships, reach out.
        </p>

        <a
          href={`mailto:${config.email}`}
          className="inline-block bg-[var(--accent)] text-white px-[clamp(24px,4vw,36px)] py-[clamp(12px,2vw,16px)] rounded-lg font-bold font-display text-[clamp(14px,2vw,16px)] no-underline tracking-[-0.3px] transition-opacity duration-200 hover:opacity-[0.85] break-all"
        >
          {config.email}
        </a>

        {(socialLinks.length > 0 || config.phone) && (
          <div className="flex justify-center gap-[clamp(16px,4vw,32px)] mt-10 flex-wrap">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="text-[var(--text-muted)] text-sm font-medium no-underline transition-colors duration-200 hover:text-[var(--accent-light)]"
              >
                {link.label}
              </a>
            ))}
            {config.phone && (
              <a
                href={`tel:${config.phone.replace(/\s/g, "")}`}
                className="group relative text-[var(--text-muted)] text-sm font-medium no-underline transition-colors duration-200 hover:text-[var(--accent-light)]"
              >
                <span className="group-hover:hidden">Contact number</span>
                <span className="hidden group-hover:inline">
                  {config.phone}
                </span>
              </a>
            )}
          </div>
        )}
      </motion.div>
    </section>
  );
}
