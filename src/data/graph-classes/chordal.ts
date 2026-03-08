import type { GraphClass } from "@/types/graph";

export const chordalClass: GraphClass = {
  id: "chordal",
  name: "Chordal graph",
  definition: {
    formal:
      "A graph $G$ is chordal if every cycle of length $\\geq 4$ in $G$ has a chord, i.e., an edge joining two non-consecutive vertices of the cycle.",
    equivalentCharacterizations: [
      "A graph that has a perfect elimination ordering",
      "The intersection graph of subtrees of a tree",
      "A graph in which every minimal vertex separator is a clique",
    ],
    forbiddenSubgraphs:
      "No induced cycle $C_n$ for $n \\geq 4$",
  },
  description:
    "A chordal graph (also called a triangulated graph) is a graph in which every cycle of four or more vertices has a chord — an edge connecting two non-adjacent vertices in the cycle. Chordal graphs generalize trees and are always perfect. They have many efficient algorithmic properties.",
  superclasses: ["perfect"],
  references: [
    {
      title: "Chordal graph - Wikipedia",
      url: "https://en.wikipedia.org/wiki/Chordal_graph",
    },
  ],
  examples: [
    {
      graph: {
        nodes: [
          { id: "0", x: 240, y: 50, label: "v₀" },
          { id: "1", x: 80, y: 230, label: "v₁" },
          { id: "2", x: 200, y: 230, label: "v₂" },
          { id: "3", x: 320, y: 230, label: "v₃" },
          { id: "4", x: 440, y: 230, label: "v₄" },
        ],
        edges: [
          { source: "0", target: "1" },
          { source: "0", target: "2" },
          { source: "0", target: "3" },
          { source: "0", target: "4" },
          { source: "1", target: "2" },
          { source: "2", target: "3" },
          { source: "3", target: "4" },
        ],
      },
      steps: [
        {
          text: "This is a fan graph: a path v₁-v₂-v₃-v₄ with an apex vertex v₀ connected to all others. It is chordal.",
        },
        {
          text: "Consider the 4-cycle v₀-v₁-v₂-v₃. It has a chord: the edge v₀-v₂ connects two non-consecutive vertices.",
          highlightNodes: ["0", "1", "2", "3"],
          highlightEdges: [
            ["0", "1"],
            ["1", "2"],
            ["2", "3"],
            ["0", "3"],
            ["0", "2"],
          ],
        },
        {
          text: "Similarly, any 4-cycle through v₀ has a chord through v₀. Since v₀ is connected to every other vertex, it provides chords for all long cycles.",
          highlightNodes: ["0"],
          highlightEdges: [
            ["0", "1"],
            ["0", "2"],
            ["0", "3"],
            ["0", "4"],
          ],
        },
        {
          text: "Chordal graphs also have a perfect elimination ordering. Here, v₁ is simplicial (its neighbors {v₀, v₂} form a clique), so we can eliminate it first.",
          highlightNodes: ["1"],
          highlightEdges: [
            ["0", "1"],
            ["1", "2"],
            ["0", "2"],
          ],
        },
      ],
    },
  ],
};
