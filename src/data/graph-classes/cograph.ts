import type { GraphClass } from "@/types/graph";

export const cographClass: GraphClass = {
  id: "cograph",
  name: "Cograph",
  definition: {
    formal:
      "A cograph (complement-reducible graph) is a graph with no induced $P_4$ (path on 4 vertices).",
    equivalentCharacterizations: [
      "A graph constructible from single vertices using disjoint union and join operations",
      "A graph in which every {connected} induced subgraph has diameter at most $2$",
    ],
  },
  description:
    "A cograph (short for complement-reducible graph) is a P₄-free graph — one containing no induced {path} on four vertices. Cographs can be built from single vertices using only disjoint union and join (connecting all vertices of one graph to all vertices of another). Every cograph is a perfect graph.",
  superclasses: ["perfect"],
  references: [
    {
      title: "Cograph - Wikipedia",
      url: "https://en.wikipedia.org/wiki/Cograph",
    },
    {
      title: "ISGCI: Cograph",
      url: "https://www.graphclasses.org/classes/gc_151.html",
    },
  ],
  examples: [
    {
      graph: {
        nodes: [
          { id: "1", x: 140, y: 60, label: "v1" },
          { id: "2", x: 240, y: 60, label: "v2" },
          { id: "3", x: 340, y: 60, label: "v3" },
          { id: "4", x: 170, y: 220, label: "v4" },
          { id: "5", x: 310, y: 220, label: "v5" },
        ],
        edges: [
          { source: "1", target: "2" },
          { source: "1", target: "3" },
          { source: "2", target: "3" },
          { source: "4", target: "5" },
          { source: "1", target: "4" },
          { source: "1", target: "5" },
          { source: "2", target: "4" },
          { source: "2", target: "5" },
          { source: "3", target: "4" },
          { source: "3", target: "5" },
        ],
      },
      steps: [
        {
          text: "This cograph is built using disjoint union and join. Start with a triangle $K_3$ on $\\{v_1, v_2, v_3\\}$.",
          highlightNodes: ["1", "2", "3"],
          highlightEdges: [
            ["1", "2"],
            ["1", "3"],
            ["2", "3"],
          ],
        },
        {
          text: "Separately, form an edge $K_2$ on $\\{v_4, v_5\\}$.",
          highlightNodes: ["4", "5"],
          highlightEdges: [["4", "5"]],
        },
        {
          text: "Join the two components: connect every vertex of the triangle to every vertex of the pair.",
          highlightEdges: [
            ["1", "4"],
            ["1", "5"],
            ["2", "4"],
            ["2", "5"],
            ["3", "4"],
            ["3", "5"],
          ],
        },
        {
          text: "The result is a cograph. Verify: no four vertices form an induced $P_4$, since the join operation ensures high connectivity between the two parts.",
        },
      ],
    },
  ],
};
