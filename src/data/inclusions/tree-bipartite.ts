import { bipartiteLayout } from "@/rendering/layouts";
import type { InclusionProof } from "@/types/graph";

const nodes = [
  { id: "r", x: 240, y: 40, label: "r" },
  { id: "a", x: 120, y: 130, label: "a" },
  { id: "b", x: 360, y: 130, label: "b" },
  { id: "c", x: 60, y: 230, label: "c" },
  { id: "d", x: 180, y: 230, label: "d" },
  { id: "e", x: 360, y: 230, label: "e" },
] as const;

export const treeBipartiteProof: InclusionProof = {
  from: "tree",
  to: "bipartite",
  summary:
    "Every tree is bipartite because you can 2-color it by alternating colors at each level from the root.",
  example: {
    graph: {
      nodes: [...nodes],
      edges: [
        { source: "r", target: "a" },
        { source: "r", target: "b" },
        { source: "a", target: "c" },
        { source: "a", target: "d" },
        { source: "b", target: "e" },
      ],
    },
    steps: [
      {
        text: "Start with any tree. We want to show it can always be 2-colored — proving it's bipartite.",
      },
      {
        text: 'Pick any vertex as the root. Color it "blue" (highlighted).',
        highlightNodes: ["r"],
      },
      {
        text: "Color all children of the root the opposite color (unhighlighted). Since trees have no cycles, each child is reached by exactly one path from the root.",
        highlightNodes: ["r"],
        highlightEdges: [
          ["r", "a"],
          ["r", "b"],
        ],
      },
      {
        text: "Continue alternating: grandchildren get the same color as the root. Every edge connects a highlighted vertex to an unhighlighted one.",
        highlightNodes: ["r", "c", "d", "e"],
        highlightEdges: [
          ["a", "c"],
          ["a", "d"],
          ["b", "e"],
        ],
      },
      {
        text: "This always works because trees have no cycles. If there were an odd cycle, two adjacent vertices would get the same color — but that's impossible in a tree.",
        highlightNodes: ["r", "c", "d", "e"],
        highlightEdges: [
          ["r", "a"],
          ["r", "b"],
          ["a", "c"],
          ["a", "d"],
          ["b", "e"],
        ],
      },
      {
        text: "Rearranging into two rows shows the bipartite structure: every edge connects a vertex in the top row to one in the bottom row.",
        highlightNodes: ["r", "c", "d", "e"],
        highlightEdges: [
          ["r", "a"],
          ["r", "b"],
          ["a", "c"],
          ["a", "d"],
          ["b", "e"],
        ],
        movedNodes: bipartiteLayout([...nodes], ["a", "b"], ["r", "c", "d", "e"], 480, 300),
      },
    ],
  },
};
