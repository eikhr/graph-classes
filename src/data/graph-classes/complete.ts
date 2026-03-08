import type { GraphClass } from "@/types/graph";

export const completeClass: GraphClass = {
  id: "complete",
  name: "Complete graph",
  definition: {
    formal:
      "A complete graph $K_n$ is a graph on $n$ vertices in which every pair of distinct vertices is connected by an edge. $K_n$ has exactly $\\frac{n(n-1)}{2}$ edges.",
    equivalentCharacterizations: [
      "A graph with diameter $1$ (for $n \\geq 2$)",
      "An $(n-1)$-regular graph on $n$ vertices",
      "The complement of the empty graph on $n$ vertices",
    ],
  },
  description:
    "A complete graph is a graph in which every pair of distinct vertices is connected by a unique edge. A complete graph on n vertices, denoted Kn, has n(n−1)/2 edges. Complete graphs are the densest possible simple graphs.",
  superclasses: ["perfect"],
  references: [
    {
      title: "Complete graph - Wikipedia",
      url: "https://en.wikipedia.org/wiki/Complete_graph",
    },
  ],
  examples: [
    {
      graph: {
        nodes: [
          { id: "1", x: 200, y: 40, label: "v1" },
          { id: "2", x: 353, y: 150, label: "v2" },
          { id: "3", x: 295, y: 270, label: "v3" },
          { id: "4", x: 105, y: 270, label: "v4" },
          { id: "5", x: 47, y: 150, label: "v5" },
        ],
        edges: [
          { source: "1", target: "2" },
          { source: "1", target: "3" },
          { source: "1", target: "4" },
          { source: "1", target: "5" },
          { source: "2", target: "3" },
          { source: "2", target: "4" },
          { source: "2", target: "5" },
          { source: "3", target: "4" },
          { source: "3", target: "5" },
          { source: "4", target: "5" },
        ],
      },
      steps: [
        {
          text: "A complete graph has an edge between every pair of vertices. This is K5, the complete graph on 5 vertices.",
        },
        {
          text: "K5 has 5(5-1)/2 = 10 edges — every possible edge is present.",
          highlightEdges: [
            ["1", "2"],
            ["1", "3"],
            ["1", "4"],
            ["1", "5"],
            ["2", "3"],
            ["2", "4"],
            ["2", "5"],
            ["3", "4"],
            ["3", "5"],
            ["4", "5"],
          ],
        },
        {
          text: "Every vertex has degree 4 — it is connected to all other vertices.",
          highlightNodes: ["1", "2", "3", "4", "5"],
        },
      ],
    },
  ],
};
