import type { GraphClass } from "@/types/graph";
import { pathClass } from "./path";
import { cycleClass } from "./cycle";
import { treeClass } from "./tree";
import { bipartiteClass } from "./bipartite";
import { completeClass } from "./complete";
import { intervalClass } from "./interval";
import { chordalClass } from "./chordal";
import { perfectClass } from "./perfect";
import { outerplanarClass } from "./outerplanar";
import { planarClass } from "./planar";
import { thresholdClass } from "./threshold";
import { cographClass } from "./cograph";
import { properIntervalClass } from "./proper-interval";
import { meynielClass } from "./meyniel";
import { evenHoleFreeClass } from "./even-hole-free";
import { cliqueGraphClass } from "./clique";

export const graphClasses: GraphClass[] = [
  pathClass,
  cycleClass,
  treeClass,
  bipartiteClass,
  completeClass,
  intervalClass,
  chordalClass,
  perfectClass,
  outerplanarClass,
  planarClass,
  thresholdClass,
  cographClass,
  properIntervalClass,
  meynielClass,
  evenHoleFreeClass,
  cliqueGraphClass,
];
