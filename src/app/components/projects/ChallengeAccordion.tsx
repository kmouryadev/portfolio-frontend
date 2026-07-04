"use client";
import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  documentToReactComponents,
  type Options,
} from "@contentful/rich-text-react-renderer";
import { BLOCKS, MARKS } from "@contentful/rich-text-types";
import type { Challenge } from "@/lib/contentful";
import Button from "@/app/components/ui-components/Button";
import { renderParagraphs } from "@/lib/richText";
import { SUB_LABEL_CLS, BODY_TEXT_CLS, TAG_CHIP_CLS } from "./labelStyles";

const richTextOptions: Options = {
  renderMark: {
    [MARKS.BOLD]: (text) => (
      <strong className="font-semibold text-[var(--text)]">{text}</strong>
    ),
    [MARKS.ITALIC]: (text) => <em>{text}</em>,
    [MARKS.CODE]: (text) => (
      <code className="font-mono bg-[var(--bg-card2)] px-1.5 py-0.5 rounded text-[0.9em]">
        {text}
      </code>
    ),
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (_node, children) => (
      <p className="text-[var(--text-muted)] text-[clamp(13px,1.5vw,15px)] leading-[1.85] mb-3 last:mb-0">
        {children}
      </p>
    ),
    [BLOCKS.HEADING_3]: (_node, children) => (
      <h4 className="font-display font-bold text-[var(--text)] text-base mt-4 mb-2">
        {children}
      </h4>
    ),
    [BLOCKS.UL_LIST]: (_node, children) => (
      <ul className="list-none flex flex-col gap-1.5 mb-3">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (_node, children) => (
      <ol className="list-decimal pl-5 flex flex-col gap-1.5 mb-3">
        {children}
      </ol>
    ),
    [BLOCKS.LIST_ITEM]: (_node, children) => (
      <li className="flex gap-2 text-[var(--text-muted)] text-[clamp(13px,1.5vw,15px)] leading-[1.7]">
        <span className="text-[var(--accent)] shrink-0">▸</span>
        <span>{children}</span>
      </li>
    ),
    [BLOCKS.QUOTE]: (_node, children) => (
      <blockquote className="bg-[var(--bg-card2)] border-l-[3px] border-[var(--accent)] rounded-r-md pl-4 pr-4 py-3 italic text-[var(--text-muted)] my-3">
        {children}
      </blockquote>
    ),
  },
};

function firstSentence(text: string): string {
  const match = text.match(/^.*?[.!?](?:\s|$)/);
  return (match ? match[0] : text).trim();
}

function ChallengeItem({
  challenge,
  isOpen,
  onToggle,
  panelId,
}: {
  challenge: Challenge;
  isOpen: boolean;
  onToggle: () => void;
  panelId: string;
}) {
  const prefersReduced = useReducedMotion();

  return (
    <div className="border border-[var(--border)] rounded-[14px] overflow-hidden bg-[var(--bg-card)]">
      <Button
        variant="custom"
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="w-full flex items-center gap-3 text-left px-5 py-4 cursor-pointer bg-transparent border-none"
      >
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-[var(--text)] text-[15px] mb-1">
            {challenge.title}
          </p>
          {!isOpen && (
            <p className="text-[var(--text-muted)] text-[13px] leading-[1.5] truncate">
              {firstSentence(challenge.context)}
            </p>
          )}
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: prefersReduced ? 0 : 0.2 }}
          className="text-[var(--text-muted)] shrink-0"
          aria-hidden
        >
          ▾
        </motion.span>
      </Button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            key="content"
            initial={prefersReduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={prefersReduced ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: prefersReduced ? 0 : 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-[var(--border)]">
              <div className="flex flex-col gap-3 mt-4">
                {renderParagraphs(challenge.context, BODY_TEXT_CLS)}
              </div>

              {challenge.approach && (
                <div className="mt-6">
                  {documentToReactComponents(challenge.approach, richTextOptions)}
                </div>
              )}

              {challenge.outcome && (
                <div className="mt-6">
                  <p className={SUB_LABEL_CLS}>Outcome</p>
                  <div className="flex flex-col gap-3">
                    {renderParagraphs(challenge.outcome, BODY_TEXT_CLS)}
                  </div>
                </div>
              )}

              {challenge.myTake && (
                <div className="mt-6">
                  <p className={SUB_LABEL_CLS}>My take</p>
                  <div className="flex flex-col gap-3">
                    {renderParagraphs(challenge.myTake, BODY_TEXT_CLS)}
                  </div>
                </div>
              )}

              {challenge.learning && (
                <div className="mt-6">
                  <p className={SUB_LABEL_CLS}>What this changed for me</p>
                  <div className="flex flex-col gap-2">
                    {renderParagraphs(challenge.learning, BODY_TEXT_CLS)}
                  </div>
                </div>
              )}

              {challenge.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-5">
                  {challenge.tags.map((tag) => (
                    <span key={tag} className={TAG_CHIP_CLS}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ChallengeAccordion({
  challenges,
}: {
  challenges: Challenge[];
}) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      {challenges.map((challenge, index) => (
        <ChallengeItem
          key={challenge.title}
          challenge={challenge}
          isOpen={openIndex === index}
          onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
          panelId={`challenge-panel-${index}`}
        />
      ))}
    </div>
  );
}
