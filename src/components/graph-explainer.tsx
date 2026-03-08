"use client";

import { useState, useMemo, useCallback } from "react";
import { GraphCanvas } from "./graph-canvas";
import { AnnotationPanel } from "./annotation-panel";
import { graphToDrawCommands } from "@/rendering/draw-commands";
import type { GraphExample, Graph } from "@/types/graph";
import styles from "./graph-explainer.module.css";

type GraphExplainerProps = {
  example: GraphExample;
};

export function GraphExplainer({ example }: GraphExplainerProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const step = example.steps[stepIndex]!;
  const totalSteps = example.steps.length;

  const hasAnnotations = example.steps.some((s) => s.annotation !== undefined);

  // Clear selection when changing steps
  const goToStep = useCallback((next: number) => {
    setStepIndex(next);
    setSelectedId(null);
  }, []);

  const handleSelect = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const currentGraph: Graph = useMemo(() => {
    const nodes = example.graph.nodes.map((n) => ({ ...n }));
    const edges = [...example.graph.edges];

    for (let i = 0; i <= stepIndex; i++) {
      const s = example.steps[i]!;
      if (s.addedNodes) nodes.push(...s.addedNodes.map((n) => ({ ...n })));
      if (s.addedEdges) edges.push(...s.addedEdges);
    }

    // Apply position overrides from the current step
    if (step.movedNodes) {
      for (const moved of step.movedNodes) {
        const node = nodes.find((n) => n.id === moved.id);
        if (node) {
          node.x = moved.x;
          node.y = moved.y;
        }
      }
    }

    return { nodes, edges };
  }, [example, stepIndex, step]);

  // When a node is selected interactively, derive highlights from the graph
  const selectionHighlight = useMemo(() => {
    if (selectedId === null) return null;
    const edges = currentGraph.edges;
    const connectedEdges: [string, string][] = [];
    const neighborIds = new Set<string>([selectedId]);
    for (const edge of edges) {
      if (edge.source === selectedId || edge.target === selectedId) {
        connectedEdges.push([edge.source, edge.target]);
        neighborIds.add(edge.source);
        neighborIds.add(edge.target);
      }
    }
    return {
      highlightNodes: [...neighborIds],
      highlightEdges: connectedEdges,
    };
  }, [selectedId, currentGraph]);

  const commands = useMemo(
    () =>
      graphToDrawCommands(currentGraph, {
        highlightNodes:
          selectionHighlight?.highlightNodes ?? step.highlightNodes,
        highlightEdges:
          selectionHighlight?.highlightEdges ?? step.highlightEdges,
        highlightEdges2: selectionHighlight ? undefined : step.highlightEdges2,
        nodeColors: step.nodeColors,
      }),
    [currentGraph, step, selectionHighlight],
  );

  const canvasWidth = hasAnnotations ? 280 : 480;
  const canvasHeight = hasAnnotations ? 220 : 300;

  return (
    <div className={styles["explainer"]}>
      <div
        className={
          hasAnnotations ? styles["splitCanvasWrap"] : styles["canvasWrap"]
        }
      >
        <GraphCanvas
          commands={commands}
          width={canvasWidth}
          height={canvasHeight}
          onNodeClick={hasAnnotations ? handleSelect : undefined}
        />
        {step.annotation && (
          <div className={styles["annotationPane"]}>
            <AnnotationPanel
              annotation={step.annotation}
              selectedId={selectedId}
              onSelect={handleSelect}
            />
          </div>
        )}
      </div>
      <div className={styles["controls"]}>
        <p className={styles["stepText"]}>{step.text}</p>
        <div className={styles["stepNav"]}>
          <button
            className={styles["navButton"]}
            onClick={() => goToStep(stepIndex - 1)}
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
            onClick={() => goToStep(stepIndex + 1)}
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
