import type { GraphClass } from "@/types/graph";

export const planarClass: GraphClass = {
  id: "planar",
  name: "Planar graph",
  definition: {
    formal:
      "A graph $G$ is planar if it can be embedded in the plane, i.e., drawn so that no two edges cross.",
    equivalentCharacterizations: [
      "A graph with no $K_5$ minor and no $K_{3,3}$ minor (Kuratowski/Wagner)",
      "A graph with genus $0$",
    ],
    forbiddenSubgraphs:
      "No $K_5$ minor and no $K_{3,3}$ minor",
  },
  description:
    "A planar graph is a graph that can be drawn in the plane without any edges crossing. By Kuratowski's theorem, a graph is planar if and only if it does not contain a subdivision of K₅ or K₃,₃. Planar graphs satisfy Euler's formula: V - E + F = 2.",
  superclasses: [],
  references: [
    {
      title: "Planar graph - Wikipedia",
      url: "https://en.wikipedia.org/wiki/Planar_graph",
    },
  ],
  examples: [
    {
      graph: {
        nodes: [
          { id: "1", x: 240, y: 35, label: "1" },
          { id: "2", x: 349, y: 114, label: "2" },
          { id: "3", x: 308, y: 243, label: "3" },
          { id: "4", x: 172, y: 243, label: "4" },
          { id: "5", x: 131, y: 114, label: "5" },
          { id: "6", x: 240, y: 150, label: "6" },
        ],
        edges: [
          { source: "1", target: "2" },
          { source: "2", target: "3" },
          { source: "3", target: "4" },
          { source: "4", target: "5" },
          { source: "5", target: "1" },
          { source: "1", target: "6" },
          { source: "2", target: "6" },
          { source: "3", target: "6" },
          { source: "4", target: "6" },
          { source: "5", target: "6" },
        ],
      },
      steps: [
        {
          text: "This is a wheel graph W₅: a 5-cycle with a central hub vertex 6 connected to all outer vertices. It is planar — no edges cross.",
        },
        {
          text: "The outer cycle forms a pentagon. Vertex 6 sits inside, with spokes to each outer vertex. No crossings!",
          highlightEdges: [
            ["1", "2"],
            ["2", "3"],
            ["3", "4"],
            ["4", "5"],
            ["5", "1"],
          ],
        },
        {
          text: "Euler's formula says V - E + F = 2. Here: 6 vertices - 10 edges + 6 {faces} = 2. ✓",
          highlightNodes: ["1", "2", "3", "4", "5", "6"],
        },
        {
          text: "Note: K₅ (complete graph on 5 vertices) is NOT planar — it always requires a crossing. But this graph avoids having all 10 edges of K₅, so it stays planar.",
          highlightEdges: [
            ["1", "6"],
            ["2", "6"],
            ["3", "6"],
            ["4", "6"],
            ["5", "6"],
          ],
        },
      ],
    },
  ],
};
