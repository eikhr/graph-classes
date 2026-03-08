import { describe, it, expect } from "vitest";
import type { Graph, GraphClass, GraphExample, ExplanationStep } from "./graph";

describe("Graph types", () => {
  it("allows creating a valid Graph", () => {
    const graph: Graph = {
      nodes: [
        { id: "a", x: 0, y: 0 },
        { id: "b", x: 100, y: 0, label: "B" },
      ],
      edges: [{ source: "a", target: "b" }],
    };
    expect(graph.nodes).toHaveLength(2);
    expect(graph.edges).toHaveLength(1);
  });

  it("allows creating a valid ExplanationStep", () => {
    const step: ExplanationStep = {
      text: "This is a path",
      highlightNodes: ["a", "b"],
      highlightEdges: [["a", "b"]],
    };
    expect(step.text).toBe("This is a path");
  });

  it("allows creating a step with added nodes/edges", () => {
    const step: ExplanationStep = {
      text: "Add a new node",
      addedNodes: [{ id: "c", x: 50, y: 50 }],
      addedEdges: [{ source: "a", target: "c" }],
    };
    expect(step.addedNodes).toHaveLength(1);
  });

  it("allows creating a valid GraphClass", () => {
    const graphClass: GraphClass = {
      id: "path",
      name: "Path Graph",
      description: "A graph where vertices form a single line.",
      references: [{ title: "Wikipedia", url: "https://en.wikipedia.org/wiki/Path_graph" }],
      superclasses: ["tree"],
      examples: [
        {
          graph: {
            nodes: [{ id: "a", x: 0, y: 0 }],
            edges: [],
          },
          steps: [{ text: "A single node is a trivial path." }],
        },
      ],
    };
    expect(graphClass.id).toBe("path");
    expect(graphClass.examples).toHaveLength(1);
  });
});
