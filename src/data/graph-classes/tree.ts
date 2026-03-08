import type { GraphClass } from "@/types/graph";

export const treeClass: GraphClass = {
  id: "tree",
  name: "Tree",
  definition: {
    formal: "A tree is a connected acyclic graph.",
    equivalentCharacterizations: [
      "A {connected} graph on $n$ vertices with exactly $n - 1$ edges",
      "A {connected} graph in which there is a unique {path} between every pair of vertices",
      "A minimally {connected} graph: removing any edge disconnects it",
      "A maximally acyclic graph: adding any edge creates a cycle",
    ],
    forbiddenSubgraphs: "Contains no cycles as subgraphs",
  },
  description:
    "A tree is a {connected} acyclic graph. Equivalently, a tree on n vertices has exactly n−1 edges and there is a unique {path} between every pair of vertices. Trees are fundamental structures in computer science and combinatorics.",
  superclasses: ["bipartite", "chordal", "outerplanar"],
  references: [
    {
      title: "Tree (graph theory) - Wikipedia",
      url: "https://en.wikipedia.org/wiki/Tree_(graph_theory)",
    },
    {
      title: "Tree - ISGCI",
      url: "https://www.graphclasses.org/classes/gc_342.html",
    },
  ],
  examples: [
    {
      graph: {
        nodes: [
          { id: "1", x: 240, y: 40, label: "v1" },
          { id: "2", x: 140, y: 140, label: "v2" },
          { id: "3", x: 340, y: 140, label: "v3" },
          { id: "4", x: 80, y: 240, label: "v4" },
          { id: "5", x: 200, y: 240, label: "v5" },
          { id: "6", x: 340, y: 240, label: "v6" },
        ],
        edges: [
          { source: "1", target: "2" },
          { source: "1", target: "3" },
          { source: "2", target: "4" },
          { source: "2", target: "5" },
          { source: "3", target: "6" },
        ],
      },
      steps: [
        {
          text: "A tree is a {connected} graph with no cycles. This tree has 6 vertices and 5 edges (n-1).",
        },
        {
          text: "Vertex v1 is the root, with children v2 and v3.",
          highlightNodes: ["1"],
          highlightEdges: [
            ["1", "2"],
            ["1", "3"],
          ],
        },
        {
          text: "The {leaves} — vertices with no children — are v4, v5, and v6.",
          highlightNodes: ["4", "5", "6"],
        },
        {
          text: "There is exactly one {path} between any two vertices. For example, the path from v4 to v6 goes v4 → v2 → v1 → v3 → v6.",
          highlightEdges: [
            ["2", "4"],
            ["1", "2"],
            ["1", "3"],
            ["3", "6"],
          ],
        },
      ],
    },
  ],
};
