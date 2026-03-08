import type { GraphClass, IntervalBarAnnotation } from "@/types/graph";

const INTERVAL_COLORS: Record<string, string> = {
  "1": "#3b82f6", // blue
  "2": "#ef4444", // red
  "3": "#22c55e", // green
  "4": "#f59e0b", // amber
  "5": "#8b5cf6", // violet
};

// Unit intervals (all length 2) — no interval contains another
const allIntervals: IntervalBarAnnotation["intervals"] = [
  { id: "1", start: 0, end: 2, label: "v1", color: INTERVAL_COLORS["1"]! },
  { id: "2", start: 1, end: 3, label: "v2", color: INTERVAL_COLORS["2"]! },
  { id: "3", start: 2, end: 4, label: "v3", color: INTERVAL_COLORS["3"]! },
  { id: "4", start: 3, end: 5, label: "v4", color: INTERVAL_COLORS["4"]! },
  { id: "5", start: 4, end: 6, label: "v5", color: INTERVAL_COLORS["5"]! },
];

function intervalAnnotation(highlightIds?: string[]): IntervalBarAnnotation {
  const base: IntervalBarAnnotation = {
    type: "interval-bars",
    intervals: allIntervals,
    axisMin: -0.5,
    axisMax: 6.5,
  };
  if (highlightIds) {
    base.highlightIds = highlightIds;
  }
  return base;
}

export const properIntervalClass: GraphClass = {
  id: "proper-interval",
  name: "Proper interval graph",
  definition: {
    formal:
      "A proper interval graph is an interval graph with an intersection model in which no interval properly contains another.",
    equivalentCharacterizations: [
      "An interval graph with no induced claw ($K_{1,3}$)",
      "A unit interval graph — representable by intervals of equal length on the real line",
    ],
  },
  description:
    "A proper interval graph is an interval graph that can be represented by intervals on the real line where no interval contains another. Equivalently, these are the claw-free interval graphs, or unit interval graphs (representable with equal-length intervals).",
  superclasses: ["interval", "clique"],
  references: [
    {
      title: "Proper interval graph - Wikipedia",
      url: "https://en.wikipedia.org/wiki/Proper_interval_graph",
    },
    {
      title: "ISGCI: Proper interval graph",
      url: "https://www.graphclasses.org/classes/gc_298.html",
    },
  ],
  examples: [
    {
      graph: {
        nodes: [
          { id: "1", x: 30, y: 150, label: "v1" },
          { id: "2", x: 80, y: 100, label: "v2" },
          { id: "3", x: 140, y: 85, label: "v3" },
          { id: "4", x: 200, y: 100, label: "v4" },
          { id: "5", x: 250, y: 150, label: "v5" },
        ],
        edges: [
          { source: "1", target: "2" },
          { source: "2", target: "3" },
          { source: "3", target: "4" },
          { source: "4", target: "5" },
          { source: "1", target: "3" },
          { source: "2", target: "4" },
          { source: "3", target: "5" },
        ],
      },
      steps: [
        {
          text: "Each vertex corresponds to a unit interval (equal length) on the number line. Two vertices are {adjacent} when their intervals overlap.",
          nodeColors: INTERVAL_COLORS,
          annotation: intervalAnnotation(),
        },
        {
          text: "All intervals have the same length — no interval contains another. This is what makes it a proper interval graph.",
          nodeColors: INTERVAL_COLORS,
          annotation: intervalAnnotation(),
        },
        {
          text: "$v_1$ and $v_2$ overlap, and $v_1$ and $v_3$ just barely overlap. But $v_1$ and $v_4$ do not — hence no edge between them.",
          highlightNodes: ["1", "2", "3"],
          highlightEdges: [
            ["1", "2"],
            ["1", "3"],
          ],
          nodeColors: INTERVAL_COLORS,
          annotation: intervalAnnotation(["1", "2", "3"]),
        },
        {
          text: "Contrast with a general interval graph: there, intervals can have different lengths, so one might contain another. Here, uniform length prevents that.",
          nodeColors: INTERVAL_COLORS,
          annotation: intervalAnnotation(),
        },
        {
          text: "No vertex has three mutually non-{adjacent} neighbours, so there is no induced claw ($K_{1,3}$). Proper interval graphs are equivalently the claw-free interval graphs.",
          nodeColors: INTERVAL_COLORS,
          annotation: intervalAnnotation(),
        },
      ],
    },
  ],
};
