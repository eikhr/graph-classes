import { describe, it, expect } from "vitest";
import { bipartiteLayout } from "./layouts";
import type { GraphNode } from "@/types/graph";

describe("bipartiteLayout", () => {
  const treeNodes: GraphNode[] = [
    { id: "r", x: 240, y: 40, label: "r" },
    { id: "a", x: 120, y: 130, label: "a" },
    { id: "b", x: 360, y: 130, label: "b" },
    { id: "c", x: 60, y: 230, label: "c" },
    { id: "d", x: 180, y: 230, label: "d" },
    { id: "e", x: 360, y: 230, label: "e" },
  ];

  it("puts the partition with lower avg y on top", () => {
    // {a, b} avg y = 130, {r, c, d, e} avg y = (40+230+230+230)/4 = 182.5
    const result = bipartiteLayout(
      treeNodes,
      ["a", "b"],
      ["r", "c", "d", "e"],
      480,
      300,
    );

    const nodeA = result.find((n) => n.id === "a")!;
    const nodeR = result.find((n) => n.id === "r")!;
    // a/b should be on top (lower y), r/c/d/e on bottom
    expect(nodeA.y).toBeLessThan(nodeR.y);
  });

  it("preserves relative x-ordering within each row", () => {
    const result = bipartiteLayout(
      treeNodes,
      ["a", "b"],
      ["r", "c", "d", "e"],
      480,
      300,
    );

    // Bottom row: r, c, d, e — original x order: c(60), d(180), r(240), e(360)
    const bottom = result.filter((n) => ["r", "c", "d", "e"].includes(n.id));
    const sorted = [...bottom].sort((a, b) => a.x - b.x);
    expect(sorted.map((n) => n.id)).toEqual(["c", "d", "r", "e"]);
  });

  it("spaces nodes evenly across the width", () => {
    const result = bipartiteLayout(
      treeNodes,
      ["a", "b"],
      ["r", "c", "d", "e"],
      480,
      300,
    );

    // Top row has 2 nodes (a, b) — should be at padding and width-padding
    const top = result.filter((n) => ["a", "b"].includes(n.id));
    const sortedTop = [...top].sort((a, b) => a.x - b.x);
    expect(sortedTop[0]!.x).toBe(40); // PADDING
    expect(sortedTop[1]!.x).toBe(440); // width - PADDING
  });

  it("centers a single-node row", () => {
    const nodes: GraphNode[] = [
      { id: "a", x: 100, y: 50 },
      { id: "b", x: 200, y: 200 },
      { id: "c", x: 300, y: 200 },
    ];
    const result = bipartiteLayout(nodes, ["a"], ["b", "c"], 480, 300);
    const nodeA = result.find((n) => n.id === "a")!;
    expect(nodeA.x).toBe(240); // centered
  });

  it("returns a MovedNode for every input node", () => {
    const result = bipartiteLayout(
      treeNodes,
      ["a", "b"],
      ["r", "c", "d", "e"],
      480,
      300,
    );
    expect(result).toHaveLength(6);
    const ids = result.map((n) => n.id).sort();
    expect(ids).toEqual(["a", "b", "c", "d", "e", "r"]);
  });
});
