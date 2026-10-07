import type { GraphClass } from "@/types/graph";

import { bipartiteClass } from "./bipartite";
import { chordalClass } from "./chordal";
import { cliqueGraphClass } from "./clique";
import { cographClass } from "./cograph";
import { completeClass } from "./complete";
import { cycleClass } from "./cycle";
import { evenHoleFreeClass } from "./even-hole-free";
import { intervalClass } from "./interval";
import { meynielClass } from "./meyniel";
import { outerplanarClass } from "./outerplanar";
import { pathClass } from "./path";
import { perfectClass } from "./perfect";
import { planarClass } from "./planar";
import { properIntervalClass } from "./proper-interval";
import { thresholdClass } from "./threshold";
import { treeClass } from "./tree";

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
