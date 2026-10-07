# Graph Classes Website Design

## Overview

A website showing relationships between graph classes with animated visualizations explaining each class. Accessible to learners but also a reference tool with links to relevant research papers.

## Data Model

All graph class data lives in TypeScript files — no database, no CMS. Adding a new class means adding a new file exporting a `GraphClass` object.

```ts
type Graph = {
  nodes: { id: string; x: number; y: number; label?: string }[];
  edges: { source: string; target: string }[];
};

type GraphClass = {
  id: string;
  name: string;
  description: string;
  references: { title: string; url: string }[];
  superclasses: string[]; // IDs of parent classes in inclusion hierarchy
  examples: GraphExample[];
};

type GraphExample = {
  graph: Graph;
  steps: ExplanationStep[];
};

type ExplanationStep = {
  text: string;
  highlightNodes?: string[];
  highlightEdges?: [string, string][];
  addedNodes?: { id: string; x: number; y: number; label?: string }[];
  addedEdges?: { source: string; target: string }[];
};
```

## Canvas Renderer

A `<GraphCanvas>` React component:

- Takes a `Graph` plus the current step's highlight state as props
- Renders via a draw-command abstraction (shapes, lines, labels) — not hardcoded to "circle = node, line = edge"
- This abstraction allows future expansion to hypergraphs (regions/hulls) or other visual primitives
- Highlighted elements get a distinct color, non-highlighted ones are dimmed
- Smooth transitions when highlight state changes between steps
- Handles canvas sizing/DPI scaling for retina displays
- Fixed layout with manually positioned nodes (no drag/zoom/pan)

## Step-Based Explanation UI

A `<GraphExplainer>` component:

- Takes a `GraphExample` (graph + steps)
- Shows the canvas on one side, step text on the other
- Previous/Next buttons to navigate steps
- Current step indicator (e.g. "Step 2 of 5")
- Smooth animation of canvas state on step transitions
- Steps can add nodes/edges for "build up" explanations

## Pages & Navigation

- **Home page (`/`)** — grid of cards, one per graph class, showing name and short description
- **Class page (`/classes/[id]`)** — full description, animated examples, super/subclass links, references
- Relationships stored as a graph in data, rendered as text links for now (hierarchy visualization deferred)

## Starter Content

Five graph classes: Paths, Cycles, Trees, Bipartite, Complete.

Each includes:

- 1-2 example graphs with 3-5 explanation steps
- 1-2 reference links (Wikipedia or papers)
- Inclusion relationships (e.g. paths ⊂ trees ⊂ bipartite)

## Future Considerations

- Scroll-driven animation as alternative to step buttons
- Interactive playground (drag nodes, classify graphs)
- Hasse diagram / inclusion DAG as navigational overview
- Hypergraph support via the draw-command abstraction
