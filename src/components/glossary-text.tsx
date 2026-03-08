"use client";

import { useMemo } from "react";
import { glossaryPatterns, lookupGlossary } from "@/data/glossary";
import { GlossaryTerm } from "./glossary-term";

type GlossaryTextProps = {
  children: string;
};

type Fragment =
  | { type: "text"; value: string }
  | { type: "term"; value: string }
  | { type: "explicit"; value: string };

function tokenize(text: string): Fragment[] {
  const fragments: Fragment[] = [];

  // Build regex: explicit {term} markup OR auto-linked glossary terms
  const escaped = glossaryPatterns.map((p) =>
    p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  );
  const parts = [`\\{([^}]+)\\}`];
  if (escaped.length > 0) {
    parts.push(`\\b(${escaped.join("|")})\\b`);
  }
  const regex = new RegExp(parts.join("|"), "gi");

  let match: RegExpExecArray | null;
  let lastIndex = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      fragments.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }
    if (match[1] !== undefined) {
      // Explicit {term} markup
      fragments.push({ type: "explicit", value: match[1] });
    } else {
      // Auto-linked term
      fragments.push({ type: "term", value: match[0]! });
    }
    lastIndex = match.index + match[0]!.length;
  }

  if (lastIndex < text.length) {
    fragments.push({ type: "text", value: text.slice(lastIndex) });
  }

  return fragments;
}

export function GlossaryText({ children }: GlossaryTextProps) {
  const fragments = useMemo(() => tokenize(children), [children]);

  // Track which terms we've already linked (only link first occurrence)
  const seen = new Set<string>();

  return (
    <>
      {fragments.map((frag, i) => {
        if (frag.type === "text") {
          return <span key={i}>{frag.value}</span>;
        }

        const entry = lookupGlossary(frag.value);
        if (!entry) {
          // Explicit markup for unknown term — preserve original braces
          const display = frag.type === "explicit" ? `{${frag.value}}` : frag.value;
          return <span key={i}>{display}</span>;
        }

        if (frag.type === "term" && seen.has(entry.term)) {
          return <span key={i}>{frag.value}</span>;
        }

        seen.add(entry.term);
        return (
          <GlossaryTerm key={i} entry={entry}>
            {frag.value}
          </GlossaryTerm>
        );
      })}
    </>
  );
}
