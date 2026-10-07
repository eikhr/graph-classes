import { describe, it, expect } from "vitest";

import { inclusionProofs } from "@/data/inclusions";

import { graphClasses } from "./index";

const superclassesOf = new Map(graphClasses.map((gc) => [gc.id, gc.superclasses]));

function reachable(from: string, skipEdgeTo?: string): Set<string> {
  const seen = new Set<string>();
  const stack = (superclassesOf.get(from) ?? []).filter((id) => id !== skipEdgeTo);
  while (stack.length > 0) {
    const id = stack.pop()!;
    if (seen.has(id)) {
      continue;
    }
    seen.add(id);
    stack.push(...(superclassesOf.get(id) ?? []));
  }
  return seen;
}

function isSubclass(sub: string, sup: string): boolean {
  return reachable(sub).has(sup);
}

// [subclass, superclass]
const knownInclusions: [string, string][] = [
  ["path", "proper-interval"],
  ["path", "bipartite"],
  ["tree", "perfect"],
  ["complete", "proper-interval"],
  ["complete", "cograph"],
  ["threshold", "interval"],
  ["threshold", "chordal"],
  ["interval", "perfect"],
  ["chordal", "even-hole-free"],
  ["cycle", "planar"],
];

// [class, not-a-superclass, counterexample]
const knownNonInclusions: [string, string, string][] = [
  ["threshold", "proper-interval", "the claw K_{1,3}"],
  ["interval", "proper-interval", "the claw K_{1,3}"],
  ["tree", "proper-interval", "the claw K_{1,3}"],
  ["tree", "interval", "a claw with each edge subdivided"],
  ["bipartite", "chordal", "C_4"],
  ["cograph", "chordal", "C_4"],
  ["cycle", "chordal", "C_4"],
  ["cycle", "perfect", "C_5"],
  ["outerplanar", "perfect", "C_5"],
  ["even-hole-free", "perfect", "C_5"],
  ["planar", "perfect", "C_5"],
  ["perfect", "planar", "K_5"],
  ["complete", "bipartite", "K_3"],
  ["complete", "planar", "K_5"],
];

describe("class hierarchy", () => {
  it("is acyclic", () => {
    for (const gc of graphClasses) {
      expect(reachable(gc.id), `${gc.id} reaches itself`).not.toContain(gc.id);
    }
  });

  it("has no redundant (transitively implied) edges", () => {
    for (const gc of graphClasses) {
      for (const superId of gc.superclasses) {
        expect(
          reachable(gc.id, superId),
          `${gc.id} → ${superId} is implied by other edges`,
        ).not.toContain(superId);
      }
    }
  });

  it.each(knownInclusions)("%s is a subclass of %s", (sub, sup) => {
    expect(isSubclass(sub, sup)).toBe(true);
  });

  it.each(knownNonInclusions)("%s is not a subclass of %s (counterexample: %s)", (sub, sup) => {
    expect(isSubclass(sub, sup)).toBe(false);
  });

  it("every inclusion proof corresponds to a hierarchy edge", () => {
    for (const proof of inclusionProofs) {
      expect(superclassesOf.get(proof.from)).toContain(proof.to);
    }
  });
});
