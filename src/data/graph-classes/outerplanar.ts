import { regularPolygon } from "@/data/graph-helpers";
import type { GraphClass } from "@/types/graph";

export const outerplanarClass: GraphClass = {
  id: "outerplanar",
  name: "Outerplanar graph",
  definition: {
    formal:
      "A graph $G$ is outerplanar if it has a planar embedding in which all vertices lie on the boundary of the outer face.",
    equivalentCharacterizations: [
      "A graph with no $K_4$ minor and no $K_{2,3}$ minor",
      "A graph that can be drawn in the plane with no crossings and all vertices on the outer {face}",
    ],
    forbiddenSubgraphs: "No $K_4$ minor and no $K_{2,3}$ minor",
  },
  description:
    "An outerplanar graph is a planar graph that can be drawn with all vertices on the outer {face}. {Trees} and cycles are outerplanar. Outerplanar graphs have treewidth at most 2 and are always planar.",
  superclasses: ["planar"],
  references: [
    {
      title: "Outerplanar graph - Wikipedia",
      url: "https://en.wikipedia.org/wiki/Outerplanar_graph",
    },
    {
      title: "Outerplanar - ISGCI",
      url: "https://www.graphclasses.org/classes/gc_110.html",
    },
  ],
  examples: [
    {
      graph: {
        nodes: regularPolygon(5, {
          cx: 240,
          cy: 150,
          r: 115,
          ids: ["1", "2", "3", "4", "5"],
          labels: ["1", "2", "3", "4", "5"],
        }),
        edges: [
          { source: "1", target: "2" },
          { source: "2", target: "3" },
          { source: "3", target: "4" },
          { source: "4", target: "5" },
          { source: "5", target: "1" },
          { source: "1", target: "3" },
          { source: "1", target: "4" },
        ],
      },
      steps: [
        {
          text: "This is a pentagon (5-cycle) with two non-crossing diagonals. All vertices are on the outer boundary.",
        },
        {
          text: "The outer cycle 1-2-3-4-5 forms the boundary. Every vertex is visible from the outside.",
          highlightEdges: [
            ["1", "2"],
            ["2", "3"],
            ["3", "4"],
            ["4", "5"],
            ["5", "1"],
          ],
        },
        {
          text: "The diagonals 1-3 and 1-4 divide the interior into triangles without crossing each other. This is called a triangulation.",
          highlightEdges: [
            ["1", "3"],
            ["1", "4"],
          ],
        },
        {
          text: "This graph has no K₄ minor — you cannot contract edges to get a complete graph on 4 vertices. That's the key property of outerplanar graphs.",
          highlightNodes: ["1", "2", "3", "4", "5"],
        },
      ],
    },
  ],
};
