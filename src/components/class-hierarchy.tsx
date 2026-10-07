"use client";

import cytoscape from "cytoscape";
import cytoscapeDagre from "cytoscape-dagre";
import { useRouter } from "next/navigation";
import { useRef, useEffect } from "react";

import { inclusionProofs } from "@/data/inclusions";
import type { Graph, GraphClass } from "@/types/graph";

const THUMB_W = 80;
const THUMB_H = 44;
const THUMB_PAD = 4;
const THUMB_NODE_R = 3;

function graphToSvgDataUri(graph: Graph): string {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const node of graph.nodes) {
    if (node.x < minX) {
      minX = node.x;
    }
    if (node.y < minY) {
      minY = node.y;
    }
    if (node.x > maxX) {
      maxX = node.x;
    }
    if (node.y > maxY) {
      maxY = node.y;
    }
  }

  const srcW = maxX - minX;
  const srcH = maxY - minY;
  const drawW = THUMB_W - THUMB_PAD * 2;
  const drawH = THUMB_H - THUMB_PAD * 2;
  const scale =
    srcW === 0 && srcH === 0
      ? 1
      : Math.min(srcW === 0 ? Infinity : drawW / srcW, srcH === 0 ? Infinity : drawH / srcH);
  const offsetX = THUMB_PAD + (drawW - srcW * scale) / 2;
  const offsetY = THUMB_PAD + (drawH - srcH * scale) / 2;

  function tx(x: number) {
    return offsetX + (x - minX) * scale;
  }
  function ty(y: number) {
    return offsetY + (y - minY) * scale;
  }

  const lines: string[] = [];
  for (const edge of graph.edges) {
    const s = graph.nodes.find((n) => n.id === edge.source);
    const t = graph.nodes.find((n) => n.id === edge.target);
    if (!s || !t) {
      continue;
    }
    lines.push(
      `<line x1="${tx(s.x)}" y1="${ty(s.y)}" x2="${tx(t.x)}" y2="${ty(t.y)}" stroke="#9ca3af" stroke-width="1.2"/>`,
    );
  }

  const circles: string[] = [];
  for (const node of graph.nodes) {
    circles.push(
      `<circle cx="${tx(node.x)}" cy="${ty(node.y)}" r="${THUMB_NODE_R}" fill="#6b7280"/>`,
    );
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${THUMB_W}" height="${THUMB_H}">${lines.join("")}${circles.join("")}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

cytoscape.use(cytoscapeDagre);

type ClassHierarchyProps = {
  classes: GraphClass[];
};

export function ClassHierarchy({ classes }: ClassHierarchyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const elements: cytoscape.ElementDefinition[] = [];

    for (const cls of classes) {
      const thumb = graphToSvgDataUri(cls.examples[0]!.graph);
      elements.push({
        data: { id: cls.id, label: cls.name, thumb },
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
            "text-valign": "bottom",
            "text-halign": "center",
            "text-margin-y": -24,
            "font-size": "12px",
            color: fg,
            "background-color": surface,
            "border-width": 1.5,
            "border-color": border,
            shape: "round-rectangle",
            width: 150,
            height: 90,
            "text-wrap": "wrap",
            "text-max-width": "130px",
            "background-image": "data(thumb)",
            "background-width": `${THUMB_W}px`,
            "background-height": `${THUMB_H}px`,
            "background-position-y": "30%",
          } as cytoscape.Css.Node,
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
        {
          selector: ".dimmed",
          style: {
            opacity: 0.15,
          } as cytoscape.Css.Node,
        },
        {
          selector: "node.highlighted",
          style: {
            "border-color": accent,
            "border-width": 2.5,
          },
        },
        {
          selector: "edge.highlighted",
          style: {
            "line-color": accent,
            "target-arrow-color": accent,
            width: 2.5,
            opacity: 1,
          } as cytoscape.Css.Edge,
        },
      ],
      layout: {
        name: "dagre",
        rankDir: "BT",
        nodeSep: 50,
        rankSep: 70,
        edgeSep: 20,
        ranker: "network-simplex",
        padding: 40,
      } as cytoscape.LayoutOptions,
      userZoomingEnabled: true,
      userPanningEnabled: true,
      minZoom: 0.3,
      maxZoom: 2,
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

    cy.on("mouseover", "node", (evt) => {
      if (containerRef.current) {
        containerRef.current.style.cursor = "pointer";
      }
      const node = evt.target;
      const connected = node.connectedEdges().connectedNodes();
      const neighborhood = node.connectedEdges().union(connected).union(node);
      cy.elements().not(neighborhood).addClass("dimmed");
      neighborhood.addClass("highlighted");
    });

    cy.on("mouseout", "node", () => {
      if (containerRef.current) {
        containerRef.current.style.cursor = "default";
      }
      cy.elements().removeClass("dimmed").removeClass("highlighted");
    });

    cy.on("mouseover", "edge[hasProof = 'true']", () => {
      if (containerRef.current) {
        containerRef.current.style.cursor = "pointer";
      }
    });

    cy.on("mouseout", "edge[hasProof = 'true']", () => {
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
      style={{
        width: "100%",
        height: "900px",
        border: "1px solid var(--border)",
        borderRadius: "8px",
      }}
      role="img"
      aria-label="Graph class hierarchy diagram"
    />
  );
}
