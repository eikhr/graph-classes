"use client";

import { useState, useMemo } from "react";
import { GraphCanvas } from "./graph-canvas";
import { graphToDrawCommands } from "@/rendering/draw-commands";
import type { GraphExample } from "@/types/graph";
import type { Graph } from "@/types/graph";

type GraphExplainerProps = {
  example: GraphExample;
};

export function GraphExplainer({ example }: GraphExplainerProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const step = example.steps[stepIndex]!;
  const totalSteps = example.steps.length;

  // Build the current graph state by applying addedNodes/addedEdges from steps 0..stepIndex
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
    <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
      <GraphCanvas commands={commands} width={400} height={300} />
      <div>
        <p>{step.text}</p>
        <p>
          Step {stepIndex + 1} of {totalSteps}
        </p>
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
          <button
            onClick={() => setStepIndex((i) => i - 1)}
            disabled={stepIndex === 0}
          >
            Previous
          </button>
          <button
            onClick={() => setStepIndex((i) => i + 1)}
            disabled={stepIndex === totalSteps - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
