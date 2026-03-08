import type { Graph } from "@/types/graph";

export type CircleCommand = {
  type: "circle";
  x: number;
  y: number;
  radius: number;
  highlighted: boolean;
};

export type LineCommand = {
  type: "line";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  highlighted: boolean;
};

export type LabelCommand = {
  type: "label";
  text: string;
  x: number;
  y: number;
  highlighted: boolean;
};

export type DrawCommand = CircleCommand | LineCommand | LabelCommand;

export type HighlightState = {
  highlightNodes?: string[] | undefined;
  highlightEdges?: [string, string][] | undefined;
};

const NODE_RADIUS = 16;

export function graphToDrawCommands(
  graph: Graph,
  highlight: HighlightState,
): DrawCommand[] {
  const commands: DrawCommand[] = [];
  const nodeSet = new Set(highlight.highlightNodes ?? []);

  const edgeSet = new Set(
    (highlight.highlightEdges ?? []).map(([s, t]) => `${s}->${t}`),
  );

  // Edges first (drawn behind nodes)
  for (const edge of graph.edges) {
    const source = graph.nodes.find((n) => n.id === edge.source);
    const target = graph.nodes.find((n) => n.id === edge.target);
    if (!source || !target) continue;

    const key1 = `${edge.source}->${edge.target}`;
    const key2 = `${edge.target}->${edge.source}`;

    commands.push({
      type: "line",
      x1: source.x,
      y1: source.y,
      x2: target.x,
      y2: target.y,
      highlighted: edgeSet.has(key1) || edgeSet.has(key2),
    });
  }

  // Nodes
  for (const node of graph.nodes) {
    commands.push({
      type: "circle",
      x: node.x,
      y: node.y,
      radius: NODE_RADIUS,
      highlighted: nodeSet.has(node.id),
    });

    if (node.label !== undefined) {
      commands.push({
        type: "label",
        text: node.label,
        x: node.x,
        y: node.y,
        highlighted: nodeSet.has(node.id),
      });
    }
  }

  return commands;
}
