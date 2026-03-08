import type { GraphClass } from "@/types/graph";

export const thresholdClass: GraphClass = {
  id: "threshold",
  name: "Threshold graph",
  definition: {
    formal:
      "A graph constructible from the empty graph by repeatedly adding an isolated vertex or a dominating vertex (one adjacent to all existing vertices). Equivalently, $(2K_2, C_4, P_4)$-free.",
    equivalentCharacterizations: [
      "A graph with no induced $P_4$, $C_4$, or $2K_2$",
      "A graph constructible by repeatedly adding an isolated {vertex} or a dominating {vertex}",
    ],
  },
  description:
    "A threshold graph is a graph that can be built by starting with a single {vertex} and repeatedly adding either an isolated {vertex} or a dominating {vertex} ({adjacent} to all existing vertices). Threshold graphs are simultaneously cographs and proper interval graphs.",
  superclasses: ["cograph", "proper-interval", "clique"],
  references: [
    {
      title: "Threshold graph - Wikipedia",
      url: "https://en.wikipedia.org/wiki/Threshold_graph",
    },
    {
      title: "ISGCI: Threshold graph",
      url: "https://www.graphclasses.org/classes/gc_328.html",
    },
  ],
  examples: [
    {
      graph: {
        nodes: [
          { id: "1", x: 120, y: 220, label: "v1" },
          { id: "2", x: 120, y: 80, label: "v2" },
          { id: "3", x: 240, y: 220, label: "v3" },
          { id: "4", x: 240, y: 80, label: "v4" },
          { id: "5", x: 360, y: 220, label: "v5" },
        ],
        edges: [
          { source: "1", target: "2" },
          { source: "1", target: "4" },
          { source: "2", target: "4" },
          { source: "3", target: "4" },
        ],
      },
      steps: [
        {
          text: "Start with a single vertex $v_1$.",
          highlightNodes: ["1"],
        },
        {
          text: "Add $v_2$ as a dominating vertex, connecting it to all existing vertices ($v_1$).",
          highlightNodes: ["2"],
          highlightEdges: [["1", "2"]],
        },
        {
          text: "Add $v_3$ as an isolated vertex (no new edges).",
          highlightNodes: ["3"],
        },
        {
          text: "Add $v_4$ as a dominating vertex, connecting it to $v_1$, $v_2$, and $v_3$.",
          highlightNodes: ["4"],
          highlightEdges: [
            ["1", "4"],
            ["2", "4"],
            ["3", "4"],
          ],
        },
        {
          text: "Add $v_5$ as an isolated vertex. The resulting graph is a threshold graph built by the sequence: isolated, dominating, isolated, dominating, isolated.",
          highlightNodes: ["5"],
        },
      ],
    },
  ],
};
