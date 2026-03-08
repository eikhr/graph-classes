import type { GraphClass } from "@/types/graph";

export const bipartiteClass: GraphClass = {
  id: "bipartite",
  name: "Bipartite graph",
  description:
    "A bipartite graph is a graph whose vertices can be divided into two disjoint sets such that every edge connects a vertex in one set to a vertex in the other. Equivalently, a graph is bipartite if and only if it contains no odd-length cycles.",
  superclasses: [],
  references: [
    {
      title: "Bipartite graph - Wikipedia",
      url: "https://en.wikipedia.org/wiki/Bipartite_graph",
    },
  ],
  examples: [
    {
      graph: {
        nodes: [
          { id: "a1", x: 80, y: 80, label: "a1" },
          { id: "a2", x: 200, y: 80, label: "a2" },
          { id: "a3", x: 320, y: 80, label: "a3" },
          { id: "b1", x: 80, y: 220, label: "b1" },
          { id: "b2", x: 200, y: 220, label: "b2" },
          { id: "b3", x: 320, y: 220, label: "b3" },
        ],
        edges: [
          { source: "a1", target: "b1" },
          { source: "a1", target: "b2" },
          { source: "a2", target: "b2" },
          { source: "a2", target: "b3" },
          { source: "a3", target: "b1" },
          { source: "a3", target: "b3" },
        ],
      },
      steps: [
        {
          text: "A bipartite graph has vertices split into two groups where edges only go between groups, never within a group.",
        },
        {
          text: "The top row {a1, a2, a3} forms one partition of the vertex set.",
          highlightNodes: ["a1", "a2", "a3"],
        },
        {
          text: "The bottom row {b1, b2, b3} forms the other partition.",
          highlightNodes: ["b1", "b2", "b3"],
        },
        {
          text: "Every edge connects a top vertex to a bottom vertex — there are no edges within either group.",
          highlightEdges: [
            ["a1", "b1"],
            ["a1", "b2"],
            ["a2", "b2"],
            ["a2", "b3"],
            ["a3", "b1"],
            ["a3", "b3"],
          ],
        },
      ],
    },
  ],
};
