import type { GraphClass, IntervalBarAnnotation } from "@/types/graph";

const INTERVAL_COLORS: Record<string, string> = {
  a: "#3b82f6", // blue
  b: "#ef4444", // red
  d: "#22c55e", // green
  c: "#f59e0b", // amber
  e: "#8b5cf6", // violet
};

const allIntervals: IntervalBarAnnotation["intervals"] = [
  { id: "a", start: 1, end: 3, label: "a", color: INTERVAL_COLORS["a"]! },
  { id: "b", start: 2, end: 5, label: "b", color: INTERVAL_COLORS["b"]! },
  { id: "d", start: 2.5, end: 4, label: "d", color: INTERVAL_COLORS["d"]! },
  { id: "c", start: 4, end: 7, label: "c", color: INTERVAL_COLORS["c"]! },
  { id: "e", start: 6, end: 8, label: "e", color: INTERVAL_COLORS["e"]! },
];

function intervalAnnotation(highlightIds?: string[]): IntervalBarAnnotation {
  const base: IntervalBarAnnotation = {
    type: "interval-bars",
    intervals: allIntervals,
    axisMin: 0,
    axisMax: 9,
  };
  if (highlightIds) {
    base.highlightIds = highlightIds;
  }
  return base;
}

export const intervalClass: GraphClass = {
  id: "interval",
  name: "Interval graph",
  definition: {
    formal:
      "A graph $G$ is an interval graph if it is the intersection graph of a family of intervals on the real line. That is, each vertex corresponds to an interval, and two vertices are adjacent if and only if their intervals overlap.",
    equivalentCharacterizations: [
      "A chordal graph with no asteroidal triple",
      "The intersection graph of subpaths of a {path}",
    ],
    forbiddenSubgraphs:
      "No asteroidal triple and no induced cycle $C_n$ for $n \\geq 4$",
  },
  description:
    "An interval graph is the intersection graph of a set of intervals on the real line. Two vertices are {adjacent} whenever their corresponding intervals overlap. Interval graphs arise naturally in scheduling problems and temporal reasoning. They are always chordal and perfect.",
  superclasses: ["chordal"],
  references: [
    {
      title: "Interval graph - Wikipedia",
      url: "https://en.wikipedia.org/wiki/Interval_graph",
    },
  ],
  examples: [
    {
      graph: {
        nodes: [
          { id: "a", x: 50, y: 70, label: "a" },
          { id: "b", x: 140, y: 30, label: "b" },
          { id: "c", x: 230, y: 70, label: "c" },
          { id: "d", x: 140, y: 150, label: "d" },
          { id: "e", x: 250, y: 150, label: "e" },
        ],
        edges: [
          { source: "a", target: "b" },
          { source: "a", target: "d" },
          { source: "b", target: "c" },
          { source: "b", target: "d" },
          { source: "c", target: "d" },
          { source: "c", target: "e" },
        ],
      },
      steps: [
        {
          text: "Each vertex represents an interval on a number line. Two vertices are connected when their intervals overlap.",
          nodeColors: INTERVAL_COLORS,
          annotation: intervalAnnotation(),
        },
        {
          text: "Intervals a, b, and d all overlap each other — they form a triangle (clique) in the graph.",
          highlightNodes: ["a", "b", "d"],
          highlightEdges: [
            ["a", "b"],
            ["a", "d"],
            ["b", "d"],
          ],
          nodeColors: INTERVAL_COLORS,
          annotation: intervalAnnotation(["a", "b", "d"]),
        },
        {
          text: "Interval c overlaps with b and d. Interval e overlaps only with c. Non-overlapping pairs have no edge.",
          highlightNodes: ["c", "e"],
          highlightEdges: [
            ["b", "c"],
            ["c", "d"],
            ["c", "e"],
          ],
          nodeColors: INTERVAL_COLORS,
          annotation: intervalAnnotation(["c", "e"]),
        },
        {
          text: "Every cycle of length 4+ has a chord — interval graphs are always chordal. The cycle a-b-c-d has chord b-d.",
          highlightEdges: [
            ["a", "b"],
            ["b", "c"],
            ["c", "d"],
            ["a", "d"],
          ],
          highlightEdges2: [["b", "d"]],
          nodeColors: INTERVAL_COLORS,
          annotation: intervalAnnotation(),
        },
      ],
    },
  ],
};
