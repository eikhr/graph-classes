"use client";

import { useState, useMemo } from "react";
import { GraphCanvas } from "./graph-canvas";
import { graphToDrawCommands } from "@/rendering/draw-commands";
import type { GraphExample, Graph } from "@/types/graph";
import styles from "./graph-explainer.module.css";

type GraphExplainerProps = {
  example: GraphExample;
};

export function GraphExplainer({ example }: GraphExplainerProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const step = example.steps[stepIndex]!;
  const totalSteps = example.steps.length;

  const currentGraph: Graph = useMemo(() => {
    const nodes = [...example.graph.nodes];
    const edges = [...example.graph.edges];

    for (let i = 0; i <= stepIndex; i++) {
      const s = example.steps[i]!;
      if (s.addedNodes) nodes.push(...s.addedNodes);
      if (s.addedEdges) edges.push(...s.addedEdges);
    }

    return { nodes, edges };
  }, [example, stepIndex]);

  const commands = useMemo(
    () =>
      graphToDrawCommands(currentGraph, {
        highlightNodes: step.highlightNodes,
        highlightEdges: step.highlightEdges,
      }),
    [currentGraph, step],
  );

  return (
    <div className={styles["explainer"]}>
      <div className={styles["canvasWrap"]}>
        <GraphCanvas commands={commands} width={480} height={300} />
      </div>
      <div className={styles["controls"]}>
        <p className={styles["stepText"]}>{step.text}</p>
        <div className={styles["stepNav"]}>
          <button
            className={styles["navButton"]}
            onClick={() => setStepIndex((i) => i - 1)}
            disabled={stepIndex === 0}
            aria-label="Previous"
          >
            &larr;
          </button>
          <span className={styles["stepIndicator"]}>
            Step {stepIndex + 1} of {totalSteps}
          </span>
          <button
            className={styles["navButton"]}
            onClick={() => setStepIndex((i) => i + 1)}
            disabled={stepIndex === totalSteps - 1}
            aria-label="Next"
          >
            &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
