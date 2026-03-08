import type { GraphClass } from "@/types/graph";
import { pathClass } from "./path";
import { cycleClass } from "./cycle";
import { treeClass } from "./tree";
import { bipartiteClass } from "./bipartite";
import { completeClass } from "./complete";

export const graphClasses: GraphClass[] = [
  pathClass,
  cycleClass,
  treeClass,
  bipartiteClass,
  completeClass,
];
