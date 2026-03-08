import { graphClasses } from "@/data/graph-classes";
import { GraphIcon } from "@/components/graph-icon";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles["main"]}>
      <h1 className={styles["title"]}>Graph Classes</h1>
      <div className={styles["grid"]}>
        {graphClasses.map((gc) => (
          <a key={gc.id} href={`/classes/${gc.id}`} className={styles["card"]}>
            <div className={styles["cardIcon"]}>
              <GraphIcon graph={gc.examples[0]!.graph} />
            </div>
            <h2 className={styles["cardName"]}>{gc.name}</h2>
            <p className={styles["cardDescription"]}>{gc.description}</p>
          </a>
        ))}
      </div>
    </main>
  );
}
