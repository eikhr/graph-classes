import type { InclusionProof } from "@/types/graph";

import { pathTreeProof } from "./path-tree";
import { treeBipartiteProof } from "./tree-bipartite";

export const inclusionProofs: InclusionProof[] = [pathTreeProof, treeBipartiteProof];

export function findProof(from: string, to: string): InclusionProof | undefined {
  return inclusionProofs.find((p) => p.from === from && p.to === to);
}
