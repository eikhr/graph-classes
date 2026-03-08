import { describe, it, expect } from "vitest";
import { graphClasses } from "./index";

describe("graph class data", () => {
  it("exports all five starter classes", () => {
    expect(graphClasses).toHaveLength(5);
  });

  it("each class has required fields", () => {
    for (const gc of graphClasses) {
      expect(gc.id).toBeTruthy();
      expect(gc.name).toBeTruthy();
      expect(gc.description).toBeTruthy();
      expect(gc.references.length).toBeGreaterThan(0);
      expect(gc.examples.length).toBeGreaterThan(0);
    }
  });

  it("each example has at least one step", () => {
    for (const gc of graphClasses) {
      for (const example of gc.examples) {
        expect(example.steps.length).toBeGreaterThan(0);
        expect(example.graph.nodes.length).toBeGreaterThan(0);
      }
    }
  });

  it("includes path, cycle, tree, bipartite, complete", () => {
    const ids = graphClasses.map((gc) => gc.id);
    expect(ids).toContain("path");
    expect(ids).toContain("cycle");
    expect(ids).toContain("tree");
    expect(ids).toContain("bipartite");
    expect(ids).toContain("complete");
  });

  it("superclass references point to valid class IDs", () => {
    const ids = new Set(graphClasses.map((gc) => gc.id));
    for (const gc of graphClasses) {
      for (const superId of gc.superclasses) {
        expect(ids).toContain(superId);
      }
    }
  });
});
