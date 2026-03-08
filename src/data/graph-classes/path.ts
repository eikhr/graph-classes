import type { GraphClass } from "@/types/graph";

export const pathClass: GraphClass = {
  id: "path",
  name: "Path graph",
  definition: {
    formal:
      "A path graph $P_n$ is a graph on $n$ vertices $v_1, v_2, \\ldots, v_n$ with edges $\\{v_i, v_{i+1}\\}$ for $i = 1, \\ldots, n-1$.",
    equivalentCharacterizations: [
      "A {connected} graph in which every vertex has {degree} at most $2$ and there are no cycles",
      "A {tree} with at most two {leaves}",
    ],
  },
  description:
    "A path graph is a graph consisting of a single sequence of vertices connected end-to-end by edges. Every path graph has exactly two endpoints (vertices of {degree} 1) and all internal vertices have {degree} 2. Path graphs are the simplest {connected} graphs with no cycles.",
  superclasses: ["tree", "interval"],
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
          { id: "1", x: 40, y: 150, label: "v1" },
          { id: "2", x: 173, y: 150, label: "v2" },
          { id: "3", x: 307, y: 150, label: "v3" },
          { id: "4", x: 440, y: 150, label: "v4" },
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
