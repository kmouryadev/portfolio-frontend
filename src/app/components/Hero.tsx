"use client";
import { useEffect, useState, useRef, useMemo, memo } from "react";
import Image from "next/image";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  useReducedMotion,
  animate,
} from "framer-motion";
import type { SiteConfig, SiteStat, SkillGroup, Skill } from "@/lib/contentful";
import Button from "./ui-components/Button";

const HEADING_CLS =
  "font-display text-[clamp(40px,7vw,88px)] font-bold leading-none tracking-[-3px]";

const LINE_COLORS = [
  "text-[var(--accent)]",
  "text-[var(--text)]",
  "text-[var(--text-muted)]",
] as const;

const TYPE_SPEED = 75;
const LINE_PAUSE = 400;

const TypedHeadings = memo(function TypedHeadings({
  lines,
}: {
  lines: string[];
}) {
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState("");
  const prefersReduced = useReducedMotion();
  const done = step >= lines.length;

  useEffect(() => {
    if (done) return;
    if (prefersReduced) {
      setStep(lines.length);
      return;
    }
    const text = lines[step];
    if (!text) {
      setStep((s) => s + 1);
      return;
    }
    setTyped("");
    let charIndex = 0;
    let pause: ReturnType<typeof setTimeout>;
    const timer = setInterval(() => {
      setTyped(text.slice(0, ++charIndex));
      if (charIndex >= text.length) {
        clearInterval(timer);
        pause = setTimeout(() => setStep((s) => s + 1), LINE_PAUSE);
      }
    }, TYPE_SPEED);
    return () => {
      clearInterval(timer);
      clearTimeout(pause);
    };
  }, [step, done, lines, prefersReduced]);

  const cursor = <span className="cursor-blink text-[var(--accent)]">|</span>;

  return (
    <h1 aria-label={lines.filter(Boolean).join(" ")}>
      {lines.map(
        (line, index) =>
          line && (
            <span
              key={index}
              aria-hidden
              className={`block ${HEADING_CLS} ${LINE_COLORS[index]}`}
            >
              <span className={step >= index ? "visible" : "invisible"}>
                {step > index ? line : step === index ? typed : line}
              </span>
              {step === index && cursor}
            </span>
          ),
      )}
    </h1>
  );
});

const StatCounter = memo(function StatCounter({
  stat,
  inView,
}: {
  stat: SiteStat;
  inView: boolean;
}) {
  const count = useMotionValue(0);
  const prefersReduced = useReducedMotion();
  const isStatic = !stat.animateTo;

  const display = useTransform(count, (value) => {
    if (!stat.animateTo) return stat.value;
    return stat.value.replace(/[\d.]+/, () =>
      stat.animateTo! < 100
        ? parseFloat(value.toFixed(1)).toString()
        : Math.round(value).toLocaleString(),
    );
  });

  useEffect(() => {
    if (isStatic || !inView || !stat.animateTo) return;
    if (prefersReduced) {
      count.set(stat.animateTo);
      return;
    }
    const ctrl = animate(count, stat.animateTo, {
      duration: 1.4,
      ease: "easeOut",
    });
    return ctrl.stop;
  }, [count, inView, isStatic, prefersReduced, stat.animateTo]);

  return (
    <div className="min-w-[76px]">
      {isStatic ? (
        <p className="font-display text-[clamp(18px,2.5vw,26px)] font-bold text-[var(--accent)] tracking-[-1px]">
          {inView ? stat.value : "—"}
        </p>
      ) : (
        <motion.p className="font-display text-[clamp(18px,2.5vw,26px)] font-bold text-[var(--accent)] tracking-[-1px]">
          {display}
        </motion.p>
      )}
      <p className="text-[11px] text-[var(--text-dim)] mt-[3px] leading-[1.4]">
        {stat.label}
      </p>
    </div>
  );
});

const COL_OFFSETS = [0, 28, 12] as const;

const FloatingIcons = memo(function FloatingIcons({
  skillGroups,
}: {
  skillGroups: SkillGroup[];
}) {
  const prefersReduced = useReducedMotion();
  const skills: Skill[] = skillGroups
    .flatMap((group) => group.skills)
    .slice(0, 12);
  if (!skills.length) return null;

  return (
    <div className="grid grid-cols-3 gap-3 py-2 relative">
      {skills.map((skill, index) => {
        const entrance = {
          duration: 0.45,
          delay: 0.3 + index * 0.07,
          ease: "easeOut",
        } as const;

        return (
          <div
            key={`${skill.label}-${index}`}
            style={{ marginTop: COL_OFFSETS[index % 3] }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.82 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: prefersReduced ? 0 : [0, -10, 0],
              }}
              transition={{
                opacity: entrance,
                scale: entrance,
                y: {
                  duration: 2.6 + (index % 5) * 0.28,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.18,
                  repeatType: "mirror",
                },
              }}
              style={{ willChange: "transform" }}
            >
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] px-2 py-3.5 flex flex-col items-center gap-[7px] shadow-[0_4px_24px_rgba(0,0,0,0.35)] cursor-default select-none transition-[border-color,box-shadow] duration-200 hover:border-[var(--border-hover)] hover:shadow-[0_6px_28px_rgba(99,102,241,0.18)]">
                {skill.icon ? (
                  <Image
                    src={skill.icon}
                    alt={skill.label}
                    width={34}
                    height={34}
                    className="object-contain"
                  />
                ) : (
                  <div className="w-[34px] h-[34px] bg-[var(--bg-card2)] rounded-lg flex items-center justify-center">
                    <span className="text-xs font-bold text-[var(--accent)]">
                      {skill.label.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="text-[10.5px] text-[var(--text-dim)] font-medium text-center leading-[1.3] whitespace-nowrap overflow-hidden text-ellipsis max-w-[72px]">
                  {skill.label}
                </span>
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
});

export default function Hero({
  config,
  skillGroups,
}: {
  config: SiteConfig;
  skillGroups: SkillGroup[];
}) {
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true });

  const heroLines = useMemo(
    () => [config.heroLine1, config.heroLine2, config.heroLine3],
    [config.heroLine1, config.heroLine2, config.heroLine3],
  );

  return (
    <section
      id="hero"
      className="min-[860px]:min-h-screen flex items-center px-6 pb-16 min-[860px]:pb-0 relative overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute top-1/4 left-[40%] -translate-x-1/2 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(99,102,241,0.1)_0%,transparent_70%)] pointer-events-none"
      />

      <div className="max-w-[1100px] mx-auto w-full pt-20 grid grid-cols-1 min-[860px]:grid-cols-[1fr_420px] gap-[clamp(40px,6vw,72px)] items-center">
        <div>
          <TypedHeadings lines={heroLines} />

          <div>
            {config.tagline && (
              <p className="mt-7 text-[clamp(14px,1.5vw,17px)] text-[var(--text-muted)] max-w-[500px] leading-[1.75]">
                {config.tagline}
              </p>
            )}

            {config.stats.length > 0 && (
              <div
                ref={statsRef}
                className="flex gap-[clamp(16px,3vw,40px)] mt-8 flex-wrap"
              >
                {config.stats.map((stat) => (
                  <StatCounter
                    key={stat.label}
                    stat={stat}
                    inView={statsInView}
                  />
                ))}
              </div>
            )}

            <div className="flex gap-3 mt-8 flex-wrap">
              <Button href="/projects" size="md">
                View my work →
              </Button>
              <Button
                href={`mailto:${config.email}`}
                size="md"
                variant="secondary"
              >
                Get in touch
              </Button>
            </div>

            <div className="flex gap-5 mt-7 flex-wrap">
              {[
                { label: "LinkedIn", href: config.linkedin },
                { label: "GitHub", href: config.github },
                { label: "Email", href: `mailto:${config.email}` },
              ]
                .filter((link) => link.href)
                .map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="text-[var(--text-muted)] text-[13px] font-medium no-underline border-b border-[var(--border)] pb-0.5 transition-[color,border-color] duration-200 hover:text-[var(--accent-light)] hover:border-[var(--accent-light)]"
                  >
                    {link.label}
                  </a>
                ))}
            </div>
          </div>
        </div>

        <div className="hidden min-[860px]:block">
          <FloatingIcons skillGroups={skillGroups} />
        </div>
      </div>
    </section>
  );
}