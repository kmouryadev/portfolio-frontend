import type { ReactNode } from "react";

const EMPHASIS_REGEX = /(\*\*.+?\*\*|__.+?__|\*.+?\*|_.+?_)/g;

export function renderEmphasis(text: string): ReactNode {
  return text.split(EMPHASIS_REGEX).map((chunk, index) => {
    if (/^(\*\*|__).+\1$/.test(chunk)) {
      return (
        <strong key={index} className="font-semibold text-[var(--text)]">
          {chunk.slice(2, -2)}
        </strong>
      );
    }
    if (/^(\*|_).+\1$/.test(chunk)) {
      return <em key={index}>{chunk.slice(1, -1)}</em>;
    }
    return chunk;
  });
}

const LIST_ITEM_REGEX = /^\s*(?:[-*•]|\d+[.)])\s+/;

function renderBlock(block: string, className?: string, key?: number): ReactNode {
  const lines = block
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const isList = lines.length > 1 && lines.every((line) => LIST_ITEM_REGEX.test(line));

  if (isList) {
    return (
      <ul key={key} className="list-none flex flex-col gap-2">
        {lines.map((line, index) => (
          <li key={index} className="flex gap-2">
            <span className="text-[var(--accent)] shrink-0 mt-0.5">▸</span>
            <span className={className}>
              {renderEmphasis(line.replace(LIST_ITEM_REGEX, ""))}
            </span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p key={key} className={className}>
      {renderEmphasis(lines.join(" "))}
    </p>
  );
}

export function renderParagraphs(text: string, className?: string): ReactNode {
  return text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, index) => renderBlock(block, className, index));
}
