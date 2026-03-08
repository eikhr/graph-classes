import type { GraphClass } from "@/types/graph";

export const intervalClass: GraphClass = {
  id: "interval",
  name: "Interval graph",
  definition: {
    formal:
      "A graph $G$ is an interval graph if it is the intersection graph of a family of intervals on the real line. That is, each vertex corresponds to an interval, and two vertices are adjacent if and only if their intervals overlap.",
    equivalentCharacterizations: [
      "A chordal graph with no asteroidal triple",
      "The intersection graph of subpaths of a path",
    ],
    forbiddenSubgraphs:
      "No asteroidal triple and no induced cycle $C_n$ for $n \\geq 4$",
  },
  description:
    "An interval graph is the intersection graph of a set of intervals on the real line. Two vertices are adjacent whenever their corresponding intervals overlap. Interval graphs arise naturally in scheduling problems and temporal reasoning. They are always chordal and perfect.",
  superclasses: ["chordal"],
  references: [
    {
      title: "Interval graph - Wikipedia",
      url: "https://en.wikipedia.org/wiki/Interval_graph",
    },
  ],
  examples: [
    {
      graph: {
        nodes: [
          { id: "a", x: 80, y: 100, label: "a" },
          { id: "b", x: 200, y: 60, label: "b" },
          { id: "c", x: 320, y: 100, label: "c" },
          { id: "d", x: 200, y: 200, label: "d" },
          { id: "e", x: 400, y: 200, label: "e" },
        ],
        edges: [
          { source: "a", target: "b" },
          { source: "a", target: "d" },
          { source: "b", target: "c" },
          { source: "b", target: "d" },
          { source: "c", target: "d" },
          { source: "c", target: "e" },
        ],
      },
      steps: [
        {
          text: "An interval graph comes from overlapping intervals on a line. Each vertex represents an interval, and edges connect overlapping ones.",
        },
        {
          text: "Vertex a has interval [1,3], b has [2,5], d has [2.5,4]. These overlap pairwise, forming a triangle.",
          highlightNodes: ["a", "b", "d"],
          highlightEdges: [
            ["a", "b"],
            ["a", "d"],
            ["b", "d"],
          ],
        },
        {
          text: "Vertex c has interval [4,7], which overlaps with b and d. Vertex e has [6,8], overlapping only with c.",
          highlightNodes: ["c", "e"],
          highlightEdges: [
            ["b", "c"],
            ["c", "d"],
            ["c", "e"],
          ],
        },
        {
          text: "Notice every cycle of length ≥ 4 has a chord — this is because interval graphs are always chordal. The cycle a-b-c-d has the chord b-d.",
          highlightEdges: [
            ["a", "b"],
            ["b", "c"],
            ["c", "d"],
            ["a", "d"],
            ["b", "d"],
          ],
        },
      ],
    },
  ],
};
