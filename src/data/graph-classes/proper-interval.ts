import type { GraphClass } from "@/types/graph";

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
          { id: "1", x: 60, y: 180, label: "v1" },
          { id: "2", x: 150, y: 100, label: "v2" },
          { id: "3", x: 240, y: 80, label: "v3" },
          { id: "4", x: 330, y: 100, label: "v4" },
          { id: "5", x: 420, y: 180, label: "v5" },
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
          text: "This graph has 5 vertices arranged along a gentle arc, representing overlapping unit intervals on the real line.",
        },
        {
          text: "Each vertex is {adjacent} to its immediate and next-nearest neighbours: $v_1$–$v_2$–$v_3$–$v_4$–$v_5$ form a path.",
          highlightEdges: [
            ["1", "2"],
            ["2", "3"],
            ["3", "4"],
            ["4", "5"],
          ],
        },
        {
          text: "Additional edges $(v_1, v_3)$, $(v_2, v_4)$, and $(v_3, v_5)$ reflect the overlapping unit intervals.",
          highlightEdges: [
            ["1", "3"],
            ["2", "4"],
            ["3", "5"],
          ],
        },
        {
          text: "No vertex has three non-adjacent neighbours, so there is no induced claw ($K_{1,3}$). Combined with being an interval graph, this makes it a proper interval graph.",
        },
      ],
    },
  ],
};
