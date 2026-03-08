import type { Graph } from "@/types/graph";

export type HighlightGroup = "primary" | "secondary";

export type CircleCommand = {
  type: "circle";
  id: string;
  x: number;
  y: number;
  radius: number;
  highlighted: boolean;
  highlightGroup?: HighlightGroup;
  color?: string;
};

export type LineCommand = {
  type: "line";
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  highlighted: boolean;
  highlightGroup?: HighlightGroup;
  color?: string;
};

export type LabelCommand = {
  type: "label";
  id: string;
  text: string;
  x: number;
  y: number;
  highlighted: boolean;
  color?: string;
};

export type DrawCommand = CircleCommand | LineCommand | LabelCommand;

export type HighlightState = {
  highlightNodes?: string[] | undefined;
  highlightEdges?: [string, string][] | undefined;
  highlightEdges2?: [string, string][] | undefined;
  nodeColors?: Record<string, string> | undefined;
};

const NODE_RADIUS = 16;

function buildEdgeSet(edges: [string, string][]): Set<string> {
  return new Set(edges.map(([s, t]) => `${s}->${t}`));
}

export function graphToDrawCommands(
  graph: Graph,
  highlight: HighlightState,
): DrawCommand[] {
  const commands: DrawCommand[] = [];
  const nodeSet = new Set(highlight.highlightNodes ?? []);
  const edgeSet = buildEdgeSet(highlight.highlightEdges ?? []);
  const edgeSet2 = buildEdgeSet(highlight.highlightEdges2 ?? []);
  const nodeColors = highlight.nodeColors;

  // Edges first (drawn behind nodes)
  for (const edge of graph.edges) {
    const source = graph.nodes.find((n) => n.id === edge.source);
    const target = graph.nodes.find((n) => n.id === edge.target);
    if (!source || !target) continue;

    const key1 = `${edge.source}->${edge.target}`;
    const key2 = `${edge.target}->${edge.source}`;
    const isPrimary = edgeSet.has(key1) || edgeSet.has(key2);
    const isSecondary = edgeSet2.has(key1) || edgeSet2.has(key2);

    const cmd: LineCommand = {
      type: "line",
      id: `${edge.source}-${edge.target}`,
      x1: source.x,
      y1: source.y,
      x2: target.x,
      y2: target.y,
      highlighted: isPrimary || isSecondary,
    };
    if (isSecondary && !isPrimary) {
      cmd.highlightGroup = "secondary";
    }
    commands.push(cmd);
  }

  // Nodes
  for (const node of graph.nodes) {
    const color = nodeColors?.[node.id];
    const cmd: CircleCommand = {
      type: "circle",
      id: node.id,
      x: node.x,
      y: node.y,
      radius: NODE_RADIUS,
      highlighted: nodeSet.has(node.id),
    };
    if (color !== undefined) {
      cmd.color = color;
    }
    commands.push(cmd);

    if (node.label !== undefined) {
      commands.push({
        type: "label",
        id: `label-${node.id}`,
        text: node.label,
        x: node.x,
        y: node.y,
        highlighted: nodeSet.has(node.id),
      });
    }
  }

  return commands;
}
