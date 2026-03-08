"use client";

import { useRef, useEffect } from "react";
import type { Graph } from "@/types/graph";

type GraphIconProps = {
  graph: Graph;
  width?: number;
  height?: number;
};

const PADDING = 6;
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

    // Compute bounding box from node positions
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const node of graph.nodes) {
      if (node.x < minX) minX = node.x;
      if (node.y < minY) minY = node.y;
      if (node.x > maxX) maxX = node.x;
      if (node.y > maxY) maxY = node.y;
    }

    const srcW = maxX - minX;
    const srcH = maxY - minY;
    const drawW = width - PADDING * 2;
    const drawH = height - PADDING * 2;
    const scale = srcW === 0 && srcH === 0 ? 1 : Math.min(
      srcW === 0 ? Infinity : drawW / srcW,
      srcH === 0 ? Infinity : drawH / srcH,
    );
    const offsetX = PADDING + (drawW - srcW * scale) / 2;
    const offsetY = PADDING + (drawH - srcH * scale) / 2;

    function tx(x: number) { return offsetX + (x - minX) * scale; }
    function ty(y: number) { return offsetY + (y - minY) * scale; }

    // Edges
    ctx.strokeStyle = EDGE_COLOR;
    ctx.lineWidth = 1.5;
    for (const edge of graph.edges) {
      const source = graph.nodes.find((n) => n.id === edge.source);
      const target = graph.nodes.find((n) => n.id === edge.target);
      if (!source || !target) continue;
      ctx.beginPath();
      ctx.moveTo(tx(source.x), ty(source.y));
      ctx.lineTo(tx(target.x), ty(target.y));
      ctx.stroke();
    }

    // Nodes
    ctx.fillStyle = NODE_COLOR;
    for (const node of graph.nodes) {
      ctx.beginPath();
      ctx.arc(tx(node.x), ty(node.y), NODE_RADIUS, 0, Math.PI * 2);
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
