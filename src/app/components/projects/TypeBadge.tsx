import type { ProjectType } from "@/lib/contentful";
import { cn } from "@/lib/utils";

export default function TypeBadge({
  type,
  className,
}: {
  type: ProjectType;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap text-[var(--accent-light)] border-[var(--accent)] bg-[var(--accent-dim)]",
        className,
      )}
    >
      {type === "professional" ? "Client work · NDA" : "Personal build"}
    </span>
  );
}
