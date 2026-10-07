"use client";

import { InlineMath } from "react-katex";

import { GlossaryText } from "./glossary-text";

type MathTextProps = {
  children: string;
  glossary?: boolean;
};

/**
 * Renders a string with inline LaTeX math delimited by $...$.
 * Text outside delimiters is rendered as-is, or through GlossaryText
 * when the glossary prop is set.
 */
export function MathText({ children, glossary }: MathTextProps) {
  const parts = children.split(/(\$[^$]+\$)/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("$") && part.endsWith("$")) {
          const math = part.slice(1, -1);
          return (
            <InlineMath
              key={i}
              math={math}
            />
          );
        }
        if (glossary) {
          return <GlossaryText key={i}>{part}</GlossaryText>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
