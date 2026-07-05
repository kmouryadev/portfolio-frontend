"use client";
import { useLayoutEffect, useRef, useState } from "react";
import type { Skill } from "@/lib/contentful";

const CHIP_CLS =
  "font-mono bg-[var(--accent-dim)] text-[var(--accent-light)] px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap shrink-0";
const OVERFLOW_CLS =
  "font-mono bg-[var(--bg-card2)] text-[var(--text-dim)] px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap shrink-0";
const GAP_PX = 5;

function WrappingChips({ skills, max }: { skills: Skill[]; max?: number }) {
  const limit = max ?? skills.length;
  const overflow = skills.length - limit;

  return (
    <div className="flex flex-wrap gap-[5px]">
      {skills.slice(0, limit).map((skill) => (
        <span key={skill.label} className={CHIP_CLS}>
          {skill.label}
        </span>
      ))}
      {overflow > 0 && <span className={OVERFLOW_CLS}>+{overflow}</span>}
    </div>
  );
}

function FittedChips({ skills }: { skills: Skill[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(skills.length);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return;

    const recalculate = () => {
      const containerWidth = container.offsetWidth;
      const chipEls = Array.from(measure.children) as HTMLElement[];
      const overflowWidth = chipEls[chipEls.length - 1].offsetWidth;

      let usedWidth = 0;
      let count = 0;

      for (let index = 0; index < skills.length; index++) {
        const chipWidth = chipEls[index].offsetWidth;
        const remaining = skills.length - (index + 1);
        const reserve = remaining > 0 ? overflowWidth + GAP_PX : 0;
        const nextWidth = usedWidth + (index > 0 ? GAP_PX : 0) + chipWidth;

        if (index > 0 && nextWidth + reserve > containerWidth) break;
        usedWidth = nextWidth;
        count = index + 1;
      }

      setVisibleCount(count);
    };

    recalculate();
    const observer = new ResizeObserver(recalculate);
    observer.observe(container);
    return () => observer.disconnect();
  }, [skills]);

  const overflow = skills.length - visibleCount;

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      <div
        ref={measureRef}
        aria-hidden
        className="flex gap-[5px] absolute top-0 left-0 invisible pointer-events-none"
      >
        {skills.map((skill) => (
          <span key={skill.label} className={CHIP_CLS}>
            {skill.label}
          </span>
        ))}
        <span className={OVERFLOW_CLS}>+{skills.length}</span>
      </div>

      <div className="flex flex-nowrap gap-[5px] overflow-hidden">
        {skills.slice(0, visibleCount).map((skill) => (
          <span key={skill.label} className={CHIP_CLS}>
            {skill.label}
          </span>
        ))}
        {overflow > 0 && <span className={OVERFLOW_CLS}>+{overflow}</span>}
      </div>
    </div>
  );
}

export default function TechChips({
  skills,
  max,
  fit = "wrap",
}: {
  skills: Skill[];
  max?: number;
  fit?: "wrap" | "line";
}) {
  if (!skills.length) return null;
  return fit === "line" ? (
    <FittedChips skills={skills} />
  ) : (
    <WrappingChips skills={skills} max={max} />
  );
}
