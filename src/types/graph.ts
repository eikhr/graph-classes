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
  movedNodes?: { id: string; x: number; y: number }[];
};

export type GraphExample = {
  graph: Graph;
  steps: ExplanationStep[];
};

export type GraphReference = {
  title: string;
  url: string;
};

export type Definition = {
  formal: string;
  equivalentCharacterizations?: string[] | undefined;
  forbiddenSubgraphs?: string | undefined;
};

export type InclusionProof = {
  from: string;
  to: string;
  summary: string;
  example: GraphExample;
};

export type GraphClass = {
  id: string;
  name: string;
  definition: Definition;
  description: string;
  references: GraphReference[];
  superclasses: string[];
  examples: GraphExample[];
};
