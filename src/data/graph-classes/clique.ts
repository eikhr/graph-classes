import type { GraphClass } from "@/types/graph";

export const cliqueGraphClass: GraphClass = {
  id: "clique",
  name: "Clique graph",
  definition: {
    formal:
      "A graph $G$ is a clique graph if it is the intersection graph of the maximal {clique}s of some graph $H$.",
    equivalentCharacterizations: [
      "A graph that has a family of {clique}s covering all {edge}s with the Helly property",
    ],
  },
  description:
    "A clique graph is a graph that arises as the intersection graph of the maximal {clique}s of some other graph. Equivalently, a graph is a clique graph if it has a clique edge cover satisfying the Helly property (every subfamily of pairwise intersecting cliques has a common {vertex}).",
  superclasses: [],
  references: [
    {
      title: "Clique graph - Wikipedia",
      url: "https://en.wikipedia.org/wiki/Clique_graph",
    },
    {
      title: "ISGCI: Clique graph",
      url: "https://www.graphclasses.org/classes/gc_141.html",
    },
  ],
  examples: [
    {
      graph: {
        nodes: [
          { id: "1", x: 120, y: 150, label: "C1" },
          { id: "2", x: 240, y: 150, label: "C2" },
          { id: "3", x: 360, y: 150, label: "C3" },
        ],
        edges: [
          { source: "1", target: "2" },
          { source: "2", target: "3" },
        ],
      },
      steps: [
        {
          text: "Consider the source graph $H = P_4$, a path on four vertices $u_1$–$u_2$–$u_3$–$u_4$. Its maximal {clique}s are the three {edge}s: $\\{u_1,u_2\\}$, $\\{u_2,u_3\\}$, $\\{u_3,u_4\\}$.",
        },
        {
          text: "Each maximal {clique} of $H$ becomes a node in the clique graph $K(H)$: $C_1 = \\{u_1,u_2\\}$, $C_2 = \\{u_2,u_3\\}$, $C_3 = \\{u_3,u_4\\}$.",
          highlightNodes: ["1", "2", "3"],
        },
        {
          text: "Two clique-nodes are {adjacent} when their corresponding {clique}s share a {vertex}. $C_1$ and $C_2$ share $u_2$.",
          highlightEdges: [["1", "2"]],
        },
        {
          text: "$C_2$ and $C_3$ share $u_3$, giving the second {edge}. $C_1$ and $C_3$ share no {vertex}, so they are not {adjacent}.",
          highlightEdges: [["2", "3"]],
        },
        {
          text: "The resulting clique graph $K(P_4) = P_3$ is itself a path on three vertices. Since it arises as a clique graph of $H$, it belongs to the class of clique graphs.",
        },
      ],
    },
  ],
};
