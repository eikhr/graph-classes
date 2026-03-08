import type { GraphClass } from "@/types/graph";

export const cycleClass: GraphClass = {
  id: "cycle",
  name: "Cycle graph",
  description:
    "A cycle graph is a graph consisting of a single cycle: a sequence of vertices where each vertex is connected to the next, and the last vertex connects back to the first. Every vertex in a cycle graph has exactly degree 2. The smallest cycle graph is C3, the triangle.",
  superclasses: [],
  references: [
    {
      title: "Cycle graph - Wikipedia",
      url: "https://en.wikipedia.org/wiki/Cycle_graph",
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
          { source: "2", target: "3" },
          { source: "3", target: "4" },
          { source: "4", target: "5" },
          { source: "5", target: "1" },
        ],
      },
      steps: [
        {
          text: "A cycle graph is a closed loop of vertices. This is C5, a cycle on 5 vertices arranged in a pentagon.",
        },
        {
          text: "Every vertex has exactly two neighbors — one on each side of the cycle.",
          highlightNodes: ["1", "2", "3", "4", "5"],
        },
        {
          text: "Following the edges, you return to the starting vertex: v1 → v2 → v3 → v4 → v5 → v1.",
          highlightEdges: [
            ["1", "2"],
            ["2", "3"],
            ["3", "4"],
            ["4", "5"],
            ["5", "1"],
          ],
        },
      ],
    },
  ],
};
