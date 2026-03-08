import type { InclusionProof } from "@/types/graph";

export const pathTreeProof: InclusionProof = {
  from: "path",
  to: "tree",
  summary:
    "Every path graph is a tree because it is connected and contains no cycles.",
  example: {
    graph: {
      nodes: [
        { id: "1", x: 60, y: 150, label: "v1" },
        { id: "2", x: 170, y: 150, label: "v2" },
        { id: "3", x: 280, y: 150, label: "v3" },
        { id: "4", x: 390, y: 150, label: "v4" },
      ],
      edges: [
        { source: "1", target: "2" },
        { source: "2", target: "3" },
        { source: "3", target: "4" },
      ],
    },
    steps: [
      {
        text: "A tree is a connected acyclic graph. We need to show every path satisfies both properties.",
      },
      {
        text: "First: is a path connected? Yes — you can reach any vertex from any other by following edges along the path.",
        highlightEdges: [
          ["1", "2"],
          ["2", "3"],
          ["3", "4"],
        ],
      },
      {
        text: "Second: is a path acyclic? A cycle requires returning to a starting vertex. In a path, each vertex has at most 2 neighbors arranged in a line — there is no way to loop back.",
        highlightNodes: ["1", "4"],
      },
      {
        text: "We can also verify: a tree on n vertices has exactly n−1 edges. This path has 4 vertices and 3 edges. ✓",
        highlightNodes: ["1", "2", "3", "4"],
        highlightEdges: [
          ["1", "2"],
          ["2", "3"],
          ["3", "4"],
        ],
      },
    ],
  },
};
