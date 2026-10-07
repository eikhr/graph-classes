import { ClassHierarchy } from "@/components/class-hierarchy";
import { graphClasses } from "@/data/graph-classes";

import styles from "./page.module.css";

export default function HierarchyPage() {
  return (
    <main className={styles["main"]}>
      <h1>Class Hierarchy</h1>
      <p className={styles["description"]}>
        An arrow from A to B means every A-graph is also a B-graph.
      </p>
      <ClassHierarchy classes={graphClasses} />
    </main>
  );
}
