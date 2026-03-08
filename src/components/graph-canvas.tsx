"use client";

import { useRef, useEffect, useCallback } from "react";
import type { DrawCommand } from "@/rendering/draw-commands";

type GraphCanvasProps = {
  commands: DrawCommand[];
  width: number;
  height: number;
};

const ANIMATION_DURATION = 500;

// Color constants as RGB tuples for interpolation
const HIGHLIGHT_RGB = [59, 130, 246] as const; // #3b82f6
const DEFAULT_RGB = [107, 114, 128] as const; // #6b7280
const DIM_RGB = [209, 213, 219] as const; // #d1d5db

type RGB = readonly [number, number, number];

function lerpRgb(a: RGB, b: RGB, t: number): string {
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgb(${r},${g},${bl})`;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function getTargetColor(cmd: DrawCommand, hasAnyHighlight: boolean): RGB {
  if (!hasAnyHighlight) return DEFAULT_RGB;
  return cmd.highlighted ? HIGHLIGHT_RGB : DIM_RGB;
}

function getTargetLineWidth(cmd: DrawCommand): number {
  return cmd.type === "line" && cmd.highlighted ? 3 : 2;
}

function getTargetPosition(cmd: DrawCommand): Position {
  if (cmd.type === "line") {
    return { x: cmd.x1, y: cmd.y1, x2: cmd.x2, y2: cmd.y2 };
  }
  return { x: cmd.x, y: cmd.y };
}

// Easing: ease-out cubic
function ease(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

// Build a key to match commands across frames
function commandKey(cmd: DrawCommand): string {
  return `${cmd.type}:${cmd.id}`;
}

type Position = { x: number; y: number; x2?: number; y2?: number };

type AnimationState = {
  color: RGB;
  lineWidth: number;
  pos: Position;
};

export function GraphCanvas({ commands, width, height }: GraphCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animStateRef = useRef<Map<string, AnimationState>>(new Map());
  const animFrameRef = useRef<number>(0);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, canvasBg: string, t: number) => {
      ctx.save();
      const dpr = window.devicePixelRatio || 1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.fillStyle = canvasBg;
      ctx.fillRect(0, 0, width, height);

      const hasAnyHighlight = commands.some((c) => c.highlighted);
      const animState = animStateRef.current;

      for (const cmd of commands) {
        const key = commandKey(cmd);
        const targetColor = getTargetColor(cmd, hasAnyHighlight);
        const targetLineWidth = getTargetLineWidth(cmd);
        const targetPos = getTargetPosition(cmd);

        let prev = animState.get(key);
        if (!prev) {
          prev = { color: targetColor, lineWidth: targetLineWidth, pos: targetPos };
          animState.set(key, prev);
        }

        const color = lerpRgb(prev.color, targetColor, t);
        const lineWidth = lerp(prev.lineWidth, targetLineWidth, t);
        const x = lerp(prev.pos.x, targetPos.x, t);
        const y = lerp(prev.pos.y, targetPos.y, t);

        switch (cmd.type) {
          case "line": {
            const x2 = lerp(prev.pos.x2 ?? targetPos.x2!, targetPos.x2!, t);
            const y2 = lerp(prev.pos.y2 ?? targetPos.y2!, targetPos.y2!, t);
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.stroke();
            break;
          }
          case "circle": {
            ctx.beginPath();
            ctx.arc(x, y, cmd.radius, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            break;
          }
          case "label": {
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 12px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(cmd.text, x, y);
            break;
          }
        }
      }

      ctx.restore();
    },
    [commands, width, height],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const canvasBg =
      getComputedStyle(canvas).getPropertyValue("--canvas-bg").trim() ||
      "#fafafa";

    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const rawT = Math.min(elapsed / ANIMATION_DURATION, 1);
      const t = ease(rawT);

      draw(ctx!, canvasBg, t);

      if (rawT < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete — snapshot final state
        const hasAnyHighlight = commands.some((c) => c.highlighted);
        const animState = animStateRef.current;
        for (const cmd of commands) {
          const key = commandKey(cmd);
          animState.set(key, {
            color: getTargetColor(cmd, hasAnyHighlight),
            lineWidth: getTargetLineWidth(cmd),
            pos: getTargetPosition(cmd),
          });
        }
      }
    }

    cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animFrameRef.current);
  }, [commands, width, height, draw]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: `${width}px`, height: `${height}px` }}
    />
  );
}
