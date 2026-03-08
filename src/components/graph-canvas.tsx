"use client";

import { useRef, useEffect } from "react";
import type { DrawCommand } from "@/rendering/draw-commands";

type GraphCanvasProps = {
  commands: DrawCommand[];
  width: number;
  height: number;
};

const HIGHLIGHT_COLOR = "#3b82f6";
const DEFAULT_COLOR = "#6b7280";
const DIM_COLOR = "#d1d5db";
const BG_COLOR = "#ffffff";

export function GraphCanvas({ commands, width, height }: GraphCanvasProps) {
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

    // Clear
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, width, height);

    const hasAnyHighlight = commands.some((c) => c.highlighted);

    for (const cmd of commands) {
      const color = hasAnyHighlight
        ? cmd.highlighted
          ? HIGHLIGHT_COLOR
          : DIM_COLOR
        : DEFAULT_COLOR;

      switch (cmd.type) {
        case "line": {
          ctx.beginPath();
          ctx.moveTo(cmd.x1, cmd.y1);
          ctx.lineTo(cmd.x2, cmd.y2);
          ctx.strokeStyle = color;
          ctx.lineWidth = cmd.highlighted ? 3 : 2;
          ctx.stroke();
          break;
        }
        case "circle": {
          ctx.beginPath();
          ctx.arc(cmd.x, cmd.y, cmd.radius, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
          break;
        }
        case "label": {
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 12px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(cmd.text, cmd.x, cmd.y);
          break;
        }
      }
    }
  }, [commands, width, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: `${width}px`, height: `${height}px` }}
    />
  );
}
