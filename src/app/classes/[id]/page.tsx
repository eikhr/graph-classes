import { notFound } from "next/navigation";
import { graphClasses } from "@/data/graph-classes";
import { findProof } from "@/data/inclusions";
import { GraphExplainer } from "@/components/graph-explainer";
import { DefinitionBox } from "@/components/definition-box";
import styles from "./page.module.css";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return graphClasses.map((gc) => ({ id: gc.id }));
}

export default async function ClassPage({ params }: Props) {
  const { id } = await params;
  const graphClass = graphClasses.find((gc) => gc.id === id);

  if (!graphClass) {
    notFound();
  }

  const superclassData = graphClasses.filter((gc) =>
    graphClass.superclasses.includes(gc.id),
  );

  const subclassData = graphClasses.filter((gc) =>
    gc.superclasses.includes(graphClass.id),
  );

  return (
    <main>
      <a href="/" className={styles["backLink"]}>
        &larr; All graph classes
      </a>
      <h1>{graphClass.name}</h1>
      <p className={styles["description"]}>{graphClass.description}</p>

      <DefinitionBox definition={graphClass.definition} />

      {graphClass.examples.map((example, i) => (
        <section key={i} className={styles["exampleSection"]}>
          <GraphExplainer example={example} />
        </section>
      ))}

      <div className={styles["sidebar"]}>
        {superclassData.length > 0 && (
          <div className={styles["sidebarSection"]}>
            <h2>Superclasses</h2>
            <ul>
              {superclassData.map((sc) => {
                const proof = findProof(graphClass.id, sc.id);
                return (
                  <li key={sc.id}>
                    {proof ? (
                      <a href={`/inclusions/${graphClass.id}/${sc.id}`}>
                        {sc.name}{" "}
                        <span className={styles["proofHint"]}>
                          — see why
                        </span>
                      </a>
                    ) : (
                      <a href={`/classes/${sc.id}`}>{sc.name}</a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {subclassData.length > 0 && (
          <div className={styles["sidebarSection"]}>
            <h2>Subclasses</h2>
            <ul>
              {subclassData.map((sc) => {
                const proof = findProof(sc.id, graphClass.id);
                return (
                  <li key={sc.id}>
                    {proof ? (
                      <a href={`/inclusions/${sc.id}/${graphClass.id}`}>
                        {sc.name}{" "}
                        <span className={styles["proofHint"]}>
                          — see why
                        </span>
                      </a>
                    ) : (
                      <a href={`/classes/${sc.id}`}>{sc.name}</a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className={styles["sidebarSection"]}>
          <h2>References</h2>
          <ul>
            {graphClass.references.map((ref, i) => (
              <li key={i}>
                <a href={ref.url} target="_blank" rel="noopener noreferrer">
                  {ref.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
