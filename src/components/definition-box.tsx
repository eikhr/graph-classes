import type { Definition } from "@/types/graph";
import styles from "./definition-box.module.css";

type DefinitionBoxProps = {
  definition: Definition;
};

export function DefinitionBox({ definition }: DefinitionBoxProps) {
  return (
    <div className={styles["box"]}>
      <div className={styles["label"]}>Definition</div>
      <p className={styles["formal"]}>{definition.formal}</p>

      {definition.equivalentCharacterizations &&
        definition.equivalentCharacterizations.length > 0 && (
          <div className={styles["section"]}>
            <div className={styles["sectionLabel"]}>
              Equivalent characterizations
            </div>
            <ul className={styles["list"]}>
              {definition.equivalentCharacterizations.map((char, i) => (
                <li key={i}>{char}</li>
              ))}
            </ul>
          </div>
        )}

      {definition.forbiddenSubgraphs && (
        <div className={styles["section"]}>
          <div className={styles["sectionLabel"]}>Forbidden subgraphs</div>
          <p className={styles["forbidden"]}>{definition.forbiddenSubgraphs}</p>
        </div>
      )}
    </div>
  );
}
