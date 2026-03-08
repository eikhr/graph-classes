import type { GraphClass } from "@/types/graph";

export const perfectClass: GraphClass = {
  id: "perfect",
  name: "Perfect graph",
  definition: {
    formal:
      "A graph $G$ is perfect if for every induced subgraph $H$ of $G$, the chromatic number equals the clique number: $\\chi(H) = \\omega(H)$.",
    equivalentCharacterizations: [
      "A graph with no odd hole and no odd antihole (Strong Perfect Graph Theorem)",
      "A graph whose complement is also perfect (Perfect Graph Theorem)",
    ],
    forbiddenSubgraphs:
      "No induced odd hole $C_{2k+1}$ or odd antihole $\\overline{C_{2k+1}}$ for $k \\geq 2$",
  },
  description:
    "A perfect graph is one where the chromatic number equals the clique number for every induced subgraph. This means coloring is as efficient as possible — you never need more colors than the size of the largest clique. Bipartite graphs, chordal graphs, and comparability graphs are all perfect.",
  superclasses: [],
  references: [
    {
      title: "Perfect graph - Wikipedia",
      url: "https://en.wikipedia.org/wiki/Perfect_graph",
    },
  ],
  examples: [
    {
      graph: {
        nodes: [
          { id: "a", x: 240, y: 35, label: "a" },
          { id: "b", x: 349, y: 114, label: "b" },
          { id: "c", x: 308, y: 243, label: "c" },
          { id: "d", x: 172, y: 243, label: "d" },
          { id: "e", x: 131, y: 114, label: "e" },
        ],
        edges: [
          { source: "a", target: "b" },
          { source: "b", target: "c" },
          { source: "c", target: "d" },
          { source: "d", target: "e" },
          { source: "e", target: "a" },
          { source: "a", target: "c" },
        ],
      },
      steps: [
        {
          text: "This graph has 5 vertices and a chord from a to c. The largest clique is {a, b, c} with size ω = 3.",
          highlightNodes: ["a", "b", "c"],
          highlightEdges: [
            ["a", "b"],
            ["b", "c"],
            ["a", "c"],
          ],
        },
        {
          text: "We can color it with exactly 3 colors: a=red, b=blue, c=green, d=red, e=blue. So χ = 3 = ω.",
          highlightNodes: ["a", "d"],
        },
        {
          text: "For perfection, this must hold for EVERY induced subgraph. Removing c leaves a path a-b and d-e with edge e-a — which needs only 2 colors and has ω = 2. ✓",
          highlightNodes: ["a", "b", "d", "e"],
          highlightEdges: [
            ["a", "b"],
            ["d", "e"],
            ["e", "a"],
          ],
        },
        {
          text: "Contrast with C₅ (a 5-cycle with NO chords): it has ω = 2 but needs χ = 3 colors. So C₅ is NOT perfect. The chord a-c is what makes our graph perfect.",
          highlightEdges: [["a", "c"]],
          highlightNodes: ["a", "c"],
        },
      ],
    },
  ],
};
