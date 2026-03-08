import type { GraphClass } from "@/types/graph";

export const evenHoleFreeClass: GraphClass = {
  id: "even-hole-free",
  name: "Even-hole-free graph",
  definition: {
    formal:
      "A graph containing no induced {cycle} of even length $\\geq 6$.",
    equivalentCharacterizations: [
      "A graph with no induced $C_{2k}$ for $k \\geq 3$",
    ],
  },
  description:
    "An even-hole-free graph is a graph that contains no induced {cycle} of even length six or more. This class contains all chordal graphs (which have no induced cycles at all) but allows odd holes like C₅ and C₇.",
  superclasses: [],
  references: [
    {
      title: "Even-hole-free graph - Wikipedia",
      url: "https://en.wikipedia.org/wiki/Even-hole-free_graph",
    },
    {
      title: "ISGCI: Even-hole-free graph",
      url: "https://www.graphclasses.org/classes/gc_547.html",
    },
  ],
  examples: [
    {
      graph: {
        nodes: [
          { id: "1", x: 240, y: 40, label: "v1" },
          { id: "2", x: 400, y: 130, label: "v2" },
          { id: "3", x: 340, y: 270, label: "v3" },
          { id: "4", x: 140, y: 270, label: "v4" },
          { id: "5", x: 80, y: 130, label: "v5" },
          { id: "6", x: 450, y: 40, label: "v6" },
        ],
        edges: [
          { source: "1", target: "2" },
          { source: "2", target: "3" },
          { source: "3", target: "4" },
          { source: "4", target: "5" },
          { source: "5", target: "1" },
          { source: "2", target: "6" },
          { source: "1", target: "6" },
        ],
      },
      steps: [
        {
          text: "Vertices $v_1$ through $v_5$ form a 5-{cycle} ($C_5$), which is an odd hole.",
          highlightEdges: [
            ["1", "2"],
            ["2", "3"],
            ["3", "4"],
            ["4", "5"],
            ["5", "1"],
          ],
        },
        {
          text: "Vertex $v_6$ is connected to two adjacent vertices of the {cycle}: $v_1$ and $v_2$.",
          highlightNodes: ["6"],
          highlightEdges: [
            ["1", "6"],
            ["2", "6"],
          ],
        },
        {
          text: "The triangle $v_1$–$v_2$–$v_6$ does not create any even hole, since $v_6$ connects to two adjacent {cycle} vertices rather than forming a longer even path.",
          highlightNodes: ["1", "2", "6"],
        },
        {
          text: "The odd hole $C_5$ on $\\{v_1, \\ldots, v_5\\}$ is permitted — only even holes of length $\\geq 6$ are forbidden.",
        },
        {
          text: "This graph has no induced even {cycle} of length six or more, so it is even-hole-free.",
        },
      ],
    },
  ],
};
