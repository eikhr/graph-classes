"use client";

import type { Annotation } from "@/types/graph";
import { IntervalBars } from "./interval-bars";

type AnnotationPanelProps = {
  annotation: Annotation;
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function AnnotationPanel({
  annotation,
  selectedId,
  onSelect,
}: AnnotationPanelProps) {
  switch (annotation.type) {
    case "interval-bars":
      return (
        <IntervalBars
          annotation={annotation}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      );
  }
}
