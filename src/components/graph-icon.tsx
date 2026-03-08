"use client";

import { useRef, useEffect } from "react";
import type { Graph } from "@/types/graph";

type GraphIconProps = {
  graph: Graph;
  width?: number;
  height?: number;
};

const SOURCE_WIDTH = 480;
const SOURCE_HEIGHT = 300;
const NODE_RADIUS = 5;
const NODE_COLOR = "#6b7280";
const EDGE_COLOR = "#d1d5db";

export function GraphIcon({
  graph,
  width = 120,
  height = 75,
}: GraphIconProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const sx = width / SOURCE_WIDTH;
    const sy = height / SOURCE_HEIGHT;

    // Edges
    ctx.strokeStyle = EDGE_COLOR;
    ctx.lineWidth = 1.5;
    for (const edge of graph.edges) {
      const source = graph.nodes.find((n) => n.id === edge.source);
      const target = graph.nodes.find((n) => n.id === edge.target);
      if (!source || !target) continue;
      ctx.beginPath();
      ctx.moveTo(source.x * sx, source.y * sy);
      ctx.lineTo(target.x * sx, target.y * sy);
      ctx.stroke();
    }

    // Nodes
    ctx.fillStyle = NODE_COLOR;
    for (const node of graph.nodes) {
      ctx.beginPath();
      ctx.arc(node.x * sx, node.y * sy, NODE_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [graph, width, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: `${width}px`, height: `${height}px` }}
      aria-hidden="true"
    />
  );
}
