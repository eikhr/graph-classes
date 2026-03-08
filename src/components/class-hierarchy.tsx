"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import cytoscape from "cytoscape";
import cytoscapeDagre from "cytoscape-dagre";
import type { GraphClass } from "@/types/graph";
import { inclusionProofs } from "@/data/inclusions";

cytoscape.use(cytoscapeDagre);

type ClassHierarchyProps = {
  classes: GraphClass[];
};

export function ClassHierarchy({ classes }: ClassHierarchyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!containerRef.current) return;

    const elements: cytoscape.ElementDefinition[] = [];

    for (const cls of classes) {
      elements.push({
        data: { id: cls.id, label: cls.name },
      });
    }

    // Build set of edges that have inclusion proofs
    const proofSet = new Set(inclusionProofs.map((p) => `${p.from}:${p.to}`));

    // Edges: subclass → superclass (arrow points toward superclass)
    for (const cls of classes) {
      for (const superId of cls.superclasses) {
        const hasProof = proofSet.has(`${cls.id}:${superId}`);
        elements.push({
          data: { source: cls.id, target: superId, hasProof: hasProof ? "true" : "false" },
        });
      }
    }

    // Read CSS custom properties for theming
    const style = getComputedStyle(document.documentElement);
    const fg = style.getPropertyValue("--foreground").trim() || "#111";
    const muted = style.getPropertyValue("--muted").trim() || "#888";
    const border = style.getPropertyValue("--border").trim() || "#ddd";
    const surface = style.getPropertyValue("--surface").trim() || "#fff";
    const accent = style.getPropertyValue("--accent").trim() || "#3b82f6";

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style: [
        {
          selector: "node",
          style: {
            label: "data(label)",
            "text-valign": "center",
            "text-halign": "center",
            "font-size": "13px",
            color: fg,
            "background-color": surface,
            "border-width": 1.5,
            "border-color": border,
            shape: "round-rectangle",
            width: 140,
            height: 36,
            "text-wrap": "wrap",
            "text-max-width": "130px",
          },
        },
        {
          selector: "edge",
          style: {
            width: 1.5,
            "line-color": muted,
            "target-arrow-color": muted,
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            "arrow-scale": 0.8,
          },
        },
        {
          selector: "edge[hasProof = 'true']",
          style: {
            "line-color": accent,
            "target-arrow-color": accent,
            width: 2,
          },
        },
      ],
      layout: {
        name: "dagre",
        rankDir: "BT",
        nodeSep: 30,
        rankSep: 60,
        padding: 30,
      } as cytoscape.LayoutOptions,
      userZoomingEnabled: false,
      userPanningEnabled: false,
      boxSelectionEnabled: false,
      autoungrabify: true,
    });

    cy.on("tap", "node", (evt) => {
      const id = evt.target.id();
      router.push(`/classes/${id}`);
    });

    cy.on("tap", "edge[hasProof = 'true']", (evt) => {
      const source = evt.target.data("source");
      const target = evt.target.data("target");
      router.push(`/inclusions/${source}/${target}`);
    });

    cy.on("mouseover", "node, edge[hasProof = 'true']", () => {
      if (containerRef.current) {
        containerRef.current.style.cursor = "pointer";
      }
    });

    cy.on("mouseout", "node, edge[hasProof = 'true']", () => {
      if (containerRef.current) {
        containerRef.current.style.cursor = "default";
      }
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
    };
  }, [classes, router]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "500px" }}
      role="img"
      aria-label="Graph class hierarchy diagram"
    />
  );
}
