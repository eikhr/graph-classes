import type { Graph } from "@/types/graph";

export type GlossaryEntry = {
  term: string;
  aliases?: string[];
  definition: string;
  illustration?: Graph;
  /** Set to false to exclude from auto-linking (for common words like "connected") */
  autoLink?: boolean;
};

export const glossary: GlossaryEntry[] = [
  {
    term: "vertex",
    aliases: ["vertices"],
    definition:
      "A fundamental unit of a graph, also called a node. Vertices are connected by edges.",
    illustration: {
      nodes: [{ id: "a", x: 50, y: 50 }],
      edges: [],
    },
  },
  {
    term: "edge",
    aliases: ["edges"],
    definition:
      "A connection between two vertices in a graph. In a simple graph, each edge connects exactly two distinct vertices.",
    illustration: {
      nodes: [
        { id: "a", x: 20, y: 50 },
        { id: "b", x: 80, y: 50 },
      ],
      edges: [{ source: "a", target: "b" }],
    },
  },
  {
    term: "degree",
    autoLink: false,
    definition:
      "The number of edges incident to a vertex. A vertex with degree 0 is isolated; degree 1 is a leaf.",
    illustration: {
      nodes: [
        { id: "a", x: 50, y: 20 },
        { id: "b", x: 20, y: 80 },
        { id: "c", x: 80, y: 80 },
        { id: "d", x: 50, y: 80 },
      ],
      edges: [
        { source: "a", target: "b" },
        { source: "a", target: "c" },
        { source: "a", target: "d" },
      ],
    },
  },
  {
    term: "cycle",
    aliases: ["cycles"],
    definition:
      "A closed path in a graph where the first and last vertices are the same, with no repeated edges or vertices (except the start/end).",
    illustration: {
      nodes: [
        { id: "a", x: 50, y: 10 },
        { id: "b", x: 90, y: 60 },
        { id: "c", x: 70, y: 95 },
        { id: "d", x: 30, y: 95 },
        { id: "e", x: 10, y: 60 },
      ],
      edges: [
        { source: "a", target: "b" },
        { source: "b", target: "c" },
        { source: "c", target: "d" },
        { source: "d", target: "e" },
        { source: "e", target: "a" },
      ],
    },
  },
  {
    term: "subgraph",
    aliases: ["subgraphs"],
    definition:
      "A graph formed from a subset of the vertices and edges of another graph.",
  },
  {
    term: "induced subgraph",
    aliases: ["induced subgraphs"],
    definition:
      "A subgraph containing a subset of vertices and all edges from the original graph between those vertices.",
  },
  {
    term: "clique",
    aliases: ["cliques"],
    definition:
      "A subset of vertices that are all pairwise adjacent — every two vertices in the clique are connected by an edge.",
    illustration: {
      nodes: [
        { id: "a", x: 50, y: 10 },
        { id: "b", x: 90, y: 70 },
        { id: "c", x: 10, y: 70 },
        { id: "d", x: 50, y: 45 },
      ],
      edges: [
        { source: "a", target: "b" },
        { source: "a", target: "c" },
        { source: "a", target: "d" },
        { source: "b", target: "c" },
        { source: "b", target: "d" },
        { source: "c", target: "d" },
      ],
    },
  },
  {
    term: "chromatic number",
    definition:
      "The minimum number of colors needed to color the vertices of a graph so that no two adjacent vertices share a color. Denoted χ(G).",
  },
  {
    term: "clique number",
    definition:
      "The size of the largest clique in a graph. Denoted ω(G).",
  },
  {
    term: "chord",
    aliases: ["chords"],
    definition:
      "An edge joining two non-adjacent vertices in a cycle. A graph is chordal if every cycle of length 4 or more has a chord.",
    illustration: {
      nodes: [
        { id: "a", x: 10, y: 10 },
        { id: "b", x: 90, y: 10 },
        { id: "c", x: 90, y: 90 },
        { id: "d", x: 10, y: 90 },
      ],
      edges: [
        { source: "a", target: "b" },
        { source: "b", target: "c" },
        { source: "c", target: "d" },
        { source: "d", target: "a" },
        { source: "a", target: "c" },
      ],
    },
  },
  {
    term: "independent set",
    aliases: ["independent sets"],
    definition:
      "A set of vertices with no edges between any pair. Also called a stable set.",
    illustration: {
      nodes: [
        { id: "a", x: 10, y: 50 },
        { id: "b", x: 50, y: 50 },
        { id: "c", x: 90, y: 50 },
      ],
      edges: [],
    },
  },
  {
    term: "connected",
    definition:
      "A graph is connected if there is a path between every pair of vertices.",
    autoLink: false,
  },
  {
    term: "planar embedding",
    aliases: ["planar embeddings"],
    definition:
      "A drawing of a graph on a plane with no edge crossings.",
  },
  {
    term: "bipartite",
    definition:
      "A graph whose vertices can be split into two groups so that every edge goes between the groups, never within.",
  },
  {
    term: "tree",
    aliases: ["trees"],
    autoLink: false,
    definition:
      "A connected graph with no cycles. A tree on n vertices has exactly n−1 edges.",
    illustration: {
      nodes: [
        { id: "a", x: 50, y: 10 },
        { id: "b", x: 25, y: 55 },
        { id: "c", x: 75, y: 55 },
        { id: "d", x: 10, y: 95 },
        { id: "e", x: 40, y: 95 },
      ],
      edges: [
        { source: "a", target: "b" },
        { source: "a", target: "c" },
        { source: "b", target: "d" },
        { source: "b", target: "e" },
      ],
    },
  },
  {
    term: "perfect graph",
    aliases: ["perfect graphs"],
    definition:
      "A graph where the chromatic number equals the clique number for every induced subgraph.",
  },
  {
    term: "intersection graph",
    aliases: ["intersection graphs"],
    definition:
      "A graph where each vertex represents a set, and two vertices are adjacent if and only if their sets intersect.",
  },
  {
    term: "asteroidal triple",
    aliases: ["asteroidal triples"],
    definition:
      "Three vertices such that between any two of them there exists a path that avoids the neighborhood of the third.",
  },
  {
    term: "regular",
    definition:
      "A graph where every vertex has the same degree. A k-regular graph has every vertex with degree k.",
    autoLink: false,
  },
  {
    term: "complement",
    definition:
      "The complement of a graph G has the same vertices but has an edge between two vertices if and only if G does not.",
    autoLink: false,
  },
  {
    term: "diameter",
    definition:
      "The longest shortest path between any two vertices in a graph.",
    autoLink: false,
  },
  {
    term: "forbidden subgraph",
    aliases: ["forbidden subgraphs"],
    definition:
      "A graph that must not appear as a (usually induced) subgraph for a graph to belong to a certain class.",
  },
  {
    term: "leaf",
    aliases: ["leaves"],
    definition:
      "A vertex of degree 1 — it has exactly one neighbor.",
    autoLink: false,
  },
  {
    term: "path",
    aliases: ["paths"],
    autoLink: false,
    definition:
      "A sequence of vertices where each adjacent pair is connected by an edge, with no repeated vertices.",
    illustration: {
      nodes: [
        { id: "a", x: 10, y: 50 },
        { id: "b", x: 40, y: 50 },
        { id: "c", x: 70, y: 50 },
        { id: "d", x: 100, y: 50 },
      ],
      edges: [
        { source: "a", target: "b" },
        { source: "b", target: "c" },
        { source: "c", target: "d" },
      ],
    },
  },
  {
    term: "face",
    aliases: ["faces"],
    definition:
      "In a planar embedding, a region bounded by edges. Every planar graph has an unbounded outer face.",
    autoLink: false,
  },
  {
    term: "adjacent",
    definition:
      "Two vertices are adjacent if they are connected by an edge. Also called neighbors.",
    autoLink: false,
  },
  {
    term: "neighbor",
    aliases: ["neighbors", "neighbourhood", "neighborhood"],
    definition:
      "A vertex adjacent to a given vertex. The neighborhood of v is the set of all vertices adjacent to v.",
    autoLink: false,
  },
];

// Build a lookup map: lowercased term/alias → entry
const lookupMap = new Map<string, GlossaryEntry>();
for (const entry of glossary) {
  lookupMap.set(entry.term.toLowerCase(), entry);
  if (entry.aliases) {
    for (const alias of entry.aliases) {
      lookupMap.set(alias.toLowerCase(), entry);
    }
  }
}

export function lookupGlossary(term: string): GlossaryEntry | undefined {
  return lookupMap.get(term.toLowerCase());
}

// Auto-linkable strings sorted longest-first (so "induced subgraph" matches before "subgraph")
// Excludes entries with autoLink: false (ambiguous common words like "connected", "path", etc.)
const autoLinkMap = new Map<string, GlossaryEntry>();
for (const entry of glossary) {
  if (entry.autoLink === false) continue;
  autoLinkMap.set(entry.term.toLowerCase(), entry);
  if (entry.aliases) {
    for (const alias of entry.aliases) {
      autoLinkMap.set(alias.toLowerCase(), entry);
    }
  }
}

export const glossaryPatterns: string[] = [...autoLinkMap.keys()].sort(
  (a, b) => b.length - a.length,
);
