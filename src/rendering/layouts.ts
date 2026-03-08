import type { GraphNode } from "@/types/graph";

type MovedNode = { id: string; x: number; y: number };

const PADDING = 40;

/**
 * Compute a two-row bipartite layout that minimizes total node movement.
 *
 * Picks which partition goes on top vs bottom based on average y position,
 * then spaces each row evenly while preserving relative x-order.
 */
export function bipartiteLayout(
  nodes: GraphNode[],
  partitionA: string[],
  partitionB: string[],
  width: number,
  height: number,
): MovedNode[] {
  const setA = new Set(partitionA);
  const setB = new Set(partitionB);

  const nodesA = nodes.filter((n) => setA.has(n.id));
  const nodesB = nodes.filter((n) => setB.has(n.id));

  const avgY = (group: GraphNode[]) =>
    group.reduce((sum, n) => sum + n.y, 0) / group.length;

  // Put the group with lower average y on top
  const aAbove = avgY(nodesA) <= avgY(nodesB);
  const topNodes = aAbove ? nodesA : nodesB;
  const bottomNodes = aAbove ? nodesB : nodesA;

  const topY = height * 0.25;
  const bottomY = height * 0.75;

  function spaceRow(group: GraphNode[], rowY: number): MovedNode[] {
    // Preserve relative x-ordering
    const sorted = [...group].sort((a, b) => a.x - b.x);
    const usable = width - 2 * PADDING;
    const gap = sorted.length > 1 ? usable / (sorted.length - 1) : 0;
    const startX = sorted.length > 1 ? PADDING : width / 2;

    return sorted.map((node, i) => ({
      id: node.id,
      x: startX + i * gap,
      y: rowY,
    }));
  }

  return [...spaceRow(topNodes, topY), ...spaceRow(bottomNodes, bottomY)];
}
