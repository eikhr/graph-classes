import type { GraphClass } from "@/types/graph";

export const pathClass: GraphClass = {
  id: "path",
  name: "Path graph",
  description:
    "A path graph is a graph consisting of a single sequence of vertices connected end-to-end by edges. Every path graph has exactly two endpoints (vertices of degree 1) and all internal vertices have degree 2. Path graphs are the simplest connected graphs with no cycles.",
  superclasses: ["tree"],
  references: [
    {
      title: "Path graph - Wikipedia",
      url: "https://en.wikipedia.org/wiki/Path_graph",
    },
  ],
  examples: [
    {
      graph: {
        nodes: [
          { id: "1", x: 50, y: 150, label: "v1" },
          { id: "2", x: 150, y: 150, label: "v2" },
          { id: "3", x: 250, y: 150, label: "v3" },
          { id: "4", x: 350, y: 150, label: "v4" },
        ],
        edges: [
          { source: "1", target: "2" },
          { source: "2", target: "3" },
          { source: "3", target: "4" },
        ],
      },
      steps: [
        {
          text: "A path graph is a sequence of vertices connected end-to-end. This is P4, a path on 4 vertices.",
        },
        {
          text: "Each internal vertex has exactly two neighbors.",
          highlightNodes: ["2", "3"],
        },
        {
          text: "The two endpoints each have exactly one neighbor.",
          highlightNodes: ["1", "4"],
        },
        {
          text: "There are no cycles — you can only travel in one direction along the path.",
          highlightEdges: [
            ["1", "2"],
            ["2", "3"],
            ["3", "4"],
          ],
        },
      ],
    },
  ],
};
