import { describe, it, expect } from "vitest";
import type { Graph, GraphClass, ExplanationStep, GraphNode, GraphEdge } from "./graph";

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
      definition: {
        formal: "A path graph Pn is a graph on n vertices.",
        equivalentCharacterizations: ["A tree with at most two leaves"],
      },
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

  it("rejects an ExplanationStep without text", () => {
    // @ts-expect-error - text is required
    const step: ExplanationStep = { highlightNodes: ["a"] };
    expect(step).toBeDefined();
  });

  it("rejects a GraphNode without id", () => {
    // @ts-expect-error - id is required
    const node: GraphNode = { x: 0, y: 0 };
    expect(node).toBeDefined();
  });

  it("rejects a GraphNode without x and y", () => {
    // @ts-expect-error - x and y are required
    const node: GraphNode = { id: "a" };
    expect(node).toBeDefined();
  });

  it("rejects a GraphEdge without source", () => {
    // @ts-expect-error - source is required
    const edge: GraphEdge = { target: "b" };
    expect(edge).toBeDefined();
  });

  it("rejects a GraphEdge without target", () => {
    // @ts-expect-error - target is required
    const edge: GraphEdge = { source: "a" };
    expect(edge).toBeDefined();
  });
});
