"use client";

import { InlineMath } from "react-katex";

type MathTextProps = {
  children: string;
};

/**
 * Renders a string with inline LaTeX math delimited by $...$.
 * Text outside delimiters is rendered as-is.
 */
export function MathText({ children }: MathTextProps) {
  const parts = children.split(/(\$[^$]+\$)/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("$") && part.endsWith("$")) {
          const math = part.slice(1, -1);
          return <InlineMath key={i} math={math} />;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
