import { notFound } from "next/navigation";

import { GraphExplainer } from "@/components/graph-explainer";
import { graphClasses } from "@/data/graph-classes";
import { inclusionProofs, findProof } from "@/data/inclusions";

import styles from "./page.module.css";

type Props = {
  params: Promise<{ from: string; to: string }>;
};

export function generateStaticParams() {
  return inclusionProofs.map((p) => ({ from: p.from, to: p.to }));
}

export default async function InclusionPage({ params }: Props) {
  const { from, to } = await params;
  const proof = findProof(from, to);

  if (!proof) {
    notFound();
  }

  const fromClass = graphClasses.find((gc) => gc.id === from);
  const toClass = graphClasses.find((gc) => gc.id === to);

  if (!fromClass || !toClass) {
    notFound();
  }

  return (
    <main>
      <h1 className={styles["title"]}>
        <a
          href={`/classes/${from}`}
          className={styles["className"]}
        >
          {fromClass.name}
        </a>
        <span className={styles["arrow"]}>&sub;</span>
        <a
          href={`/classes/${to}`}
          className={styles["className"]}
        >
          {toClass.name}
        </a>
      </h1>

      <p className={styles["summary"]}>{proof.summary}</p>

      <section className={styles["exampleSection"]}>
        <GraphExplainer example={proof.example} />
      </section>

      <div className={styles["classLinks"]}>
        <div className={styles["classLink"]}>
          <div className={styles["classLinkLabel"]}>Subclass</div>
          <a href={`/classes/${from}`}>{fromClass.name}</a>
        </div>
        <div className={styles["classLink"]}>
          <div className={styles["classLinkLabel"]}>Superclass</div>
          <a href={`/classes/${to}`}>{toClass.name}</a>
        </div>
      </div>
    </main>
  );
}
