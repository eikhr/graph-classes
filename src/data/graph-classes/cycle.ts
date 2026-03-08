import type { GraphClass } from "@/types/graph";

export const cycleClass: GraphClass = {
  id: "cycle",
  name: "Cycle graph",
  definition: {
    formal:
      "A cycle graph $C_n$ is a graph on $n \\geq 3$ vertices $v_1, v_2, \\ldots, v_n$ with edges $\\{v_i, v_{i+1}\\}$ for $i = 1, \\ldots, n-1$ and the edge $\\{v_n, v_1\\}$.",
    equivalentCharacterizations: [
      "A {connected} $2$-{regular} graph",
      "A {connected} graph in which every vertex has exactly {degree} $2$",
    ],
  },
  description:
    "A cycle graph is a graph consisting of a single cycle: a sequence of vertices where each vertex is connected to the next, and the last vertex connects back to the first. Every vertex in a cycle graph has exactly {degree} 2. The smallest cycle graph is C3, the triangle.",
  superclasses: ["outerplanar"],
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
          { id: "1", x: 240, y: 35, label: "v1" },
          { id: "2", x: 349, y: 114, label: "v2" },
          { id: "3", x: 308, y: 243, label: "v3" },
          { id: "4", x: 172, y: 243, label: "v4" },
          { id: "5", x: 131, y: 114, label: "v5" },
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
