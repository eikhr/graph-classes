import { describe, it, expect } from "vitest";
import { graphToDrawCommands } from "./draw-commands";
import type { Graph } from "@/types/graph";

describe("graphToDrawCommands", () => {
  it("generates circle commands for nodes", () => {
    const graph: Graph = {
      nodes: [{ id: "a", x: 50, y: 50 }],
      edges: [],
    };
    const commands = graphToDrawCommands(graph, {});
    const circles = commands.filter((c) => c.type === "circle");
    expect(circles).toHaveLength(1);
    expect(circles[0]).toMatchObject({
      type: "circle",
      x: 50,
      y: 50,
      radius: expect.any(Number),
    });
  });

  it("generates line commands for edges", () => {
    const graph: Graph = {
      nodes: [
        { id: "a", x: 0, y: 0 },
        { id: "b", x: 100, y: 0 },
      ],
      edges: [{ source: "a", target: "b" }],
    };
    const commands = graphToDrawCommands(graph, {});
    const lines = commands.filter((c) => c.type === "line");
    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatchObject({
      type: "line",
      x1: 0,
      y1: 0,
      x2: 100,
      y2: 0,
    });
  });

  it("generates label commands for nodes with labels", () => {
    const graph: Graph = {
      nodes: [{ id: "a", x: 50, y: 50, label: "A" }],
      edges: [],
    };
    const commands = graphToDrawCommands(graph, {});
    const labels = commands.filter((c) => c.type === "label");
    expect(labels).toHaveLength(1);
    expect(labels[0]).toMatchObject({
      type: "label",
      text: "A",
      x: 50,
      y: 50,
    });
  });

  it("marks highlighted nodes", () => {
    const graph: Graph = {
      nodes: [
        { id: "a", x: 0, y: 0 },
        { id: "b", x: 100, y: 0 },
      ],
      edges: [],
    };
    const commands = graphToDrawCommands(graph, {
      highlightNodes: ["a"],
    });
    const circles = commands.filter((c) => c.type === "circle");
    expect(circles[0]!.highlighted).toBe(true);
    expect(circles[1]!.highlighted).toBe(false);
  });

  it("marks highlighted edges", () => {
    const graph: Graph = {
      nodes: [
        { id: "a", x: 0, y: 0 },
        { id: "b", x: 100, y: 0 },
        { id: "c", x: 50, y: 50 },
      ],
      edges: [
        { source: "a", target: "b" },
        { source: "b", target: "c" },
      ],
    };
    const commands = graphToDrawCommands(graph, {
      highlightEdges: [["a", "b"]],
    });
    const lines = commands.filter((c) => c.type === "line");
    expect(lines[0]!.highlighted).toBe(true);
    expect(lines[1]!.highlighted).toBe(false);
  });
});
