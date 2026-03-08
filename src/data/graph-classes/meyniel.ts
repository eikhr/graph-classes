import type { GraphClass } from "@/types/graph";

export const meynielClass: GraphClass = {
  id: "meyniel",
  name: "Meyniel graph",
  definition: {
    formal:
      "A graph is Meyniel if every odd {cycle} of length $\\geq 5$ has at least two chords.",
    equivalentCharacterizations: [
      "A graph in which every odd {cycle} of length $\\geq 5$ has at least two chords",
      "A very strongly perfect graph",
    ],
  },
  description:
    "A Meyniel graph is a graph in which every odd {cycle} of length five or more has at least two chords. Named after Henri Meyniel, these graphs generalize both chordal and bipartite graphs and form a subclass of perfect graphs.",
  superclasses: ["perfect"],
  references: [
    {
      title: "Meyniel graph - Wikipedia",
      url: "https://en.wikipedia.org/wiki/Meyniel_graph",
    },
    {
      title: "ISGCI: Meyniel graph",
      url: "https://www.graphclasses.org/classes/gc_194.html",
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
        ],
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
          text: "Start with a 5-{cycle} $C_5$: $v_1$–$v_2$–$v_3$–$v_4$–$v_5$–$v_1$.",
          highlightEdges: [
            ["1", "2"],
            ["2", "3"],
            ["3", "4"],
            ["4", "5"],
            ["5", "1"],
          ],
        },
        {
          text: "A bare $C_5$ is an odd {cycle} of length 5 with zero chords — not Meyniel. We need at least two chords.",
        },
        {
          text: "Add the chord $(v_1, v_3)$, connecting two non-adjacent vertices of the {cycle}.",
          highlightEdges: [["1", "3"]],
        },
        {
          text: "Add a second chord $(v_1, v_4)$. Now the only 5-{cycle} $v_1$–$v_2$–$v_3$–$v_4$–$v_5$–$v_1$ has two chords.",
          highlightEdges: [["1", "4"]],
        },
        {
          text: "Every odd {cycle} of length $\\geq 5$ in this graph has at least two chords, so it is a Meyniel graph.",
        },
      ],
    },
  ],
};
