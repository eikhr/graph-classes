import type { Definition } from "@/types/graph";
import { MathText } from "./math-text";
import styles from "./definition-box.module.css";

type DefinitionBoxProps = {
  definition: Definition;
};

export function DefinitionBox({ definition }: DefinitionBoxProps) {
  return (
    <div className={styles["box"]}>
      <div className={styles["label"]}>Definition</div>
      <p className={styles["formal"]}>
        <MathText>{definition.formal}</MathText>
      </p>

      {definition.equivalentCharacterizations &&
        definition.equivalentCharacterizations.length > 0 && (
          <div className={styles["section"]}>
            <div className={styles["sectionLabel"]}>
              Equivalent characterizations
            </div>
            <ul className={styles["list"]}>
              {definition.equivalentCharacterizations.map((char, i) => (
                <li key={i}>
                  <MathText glossary>{char}</MathText>
                </li>
              ))}
            </ul>
          </div>
        )}

      {definition.forbiddenSubgraphs && (
        <div className={styles["section"]}>
          <div className={styles["sectionLabel"]}>Forbidden subgraphs</div>
          <p className={styles["forbidden"]}>
            <MathText glossary>{definition.forbiddenSubgraphs}</MathText>
          </p>
        </div>
      )}
    </div>
  );
}
