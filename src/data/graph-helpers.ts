import type { GraphNode } from "@/types/graph";

/**
 * Generate nodes arranged as a regular polygon.
 * Vertex 0 is at the top (12 o'clock position).
 */
export function regularPolygon(
  n: number,
  opts: {
    cx: number;
    cy: number;
    r: number;
    ids?: string[];
    labels?: string[];
  },
): GraphNode[] {
  const { cx, cy, r, ids, labels } = opts;
  return Array.from({ length: n }, (_, i) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
    return {
      id: ids?.[i] ?? String(i + 1),
      x: Math.round(cx + r * Math.cos(angle)),
      y: Math.round(cy + r * Math.sin(angle)),
      ...(labels?.[i] != null ? { label: labels[i] } : {}),
    };
  });
}
