"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { GlossaryEntry } from "@/data/glossary";
import { GraphIcon } from "./graph-icon";
import styles from "./glossary-term.module.css";

type GlossaryTermProps = {
  entry: GlossaryEntry;
  children: React.ReactNode;
};

export function GlossaryTerm({ entry, children }: GlossaryTermProps) {
  const [open, setOpen] = useState(false);
  const [above, setAbove] = useState(true);
  const ref = useRef<HTMLSpanElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        close();
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [open, close]);

  function handleToggle(e: React.MouseEvent) {
    e.stopPropagation();
    if (!open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      // Flip below if not enough space above (estimate ~200px for popover)
      setAbove(rect.top > 200);
    }
    setOpen((v) => !v);
  }

  return (
    <span className={styles["wrapper"]} ref={ref}>
      <button
        className={styles["trigger"]}
        onClick={handleToggle}
        type="button"
      >
        {children}
      </button>
      {open && (
        <span
          className={`${styles["popover"]} ${above ? styles["above"] : styles["below"]}`}
          role="tooltip"
        >
          <span className={styles["header"]}>
            <span className={styles["title"]}>{entry.term}</span>
            <button
              className={styles["close"]}
              onClick={close}
              type="button"
              aria-label="Close"
            >
              ×
            </button>
          </span>
          {entry.illustration && (
            <span className={styles["illustration"]}>
              <GraphIcon
                graph={entry.illustration}
                width={100}
                height={60}
              />
            </span>
          )}
          <span className={styles["definition"]}>{entry.definition}</span>
        </span>
      )}
    </span>
  );
}
