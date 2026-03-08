export type GraphNode = {
  id: string;
  x: number;
  y: number;
  label?: string;
};

export type GraphEdge = {
  source: string;
  target: string;
};

export type Graph = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

export type ExplanationStep = {
  text: string;
  highlightNodes?: string[];
  highlightEdges?: [string, string][];
  addedNodes?: GraphNode[];
  addedEdges?: GraphEdge[];
};

export type GraphExample = {
  graph: Graph;
  steps: ExplanationStep[];
};

export type GraphReference = {
  title: string;
  url: string;
};

export type GraphClass = {
  id: string;
  name: string;
  description: string;
  references: GraphReference[];
  superclasses: string[];
  examples: GraphExample[];
};
