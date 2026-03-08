"use client";

import { useRef, useEffect, useCallback } from "react";
import type { DrawCommand } from "@/rendering/draw-commands";

type GraphCanvasProps = {
  commands: DrawCommand[];
  width: number;
  height: number;
  onNodeClick?: ((nodeId: string) => void) | undefined;
};

const ANIMATION_DURATION = 500;

type RGB = readonly [number, number, number];

type Palette = {
  highlight: RGB;
  secondary: RGB;
  default: RGB;
  dim: RGB;
  labelFill: string;
};

const LIGHT_PALETTE: Palette = {
  highlight: [59, 130, 246],   // #3b82f6
  secondary: [245, 158, 11],   // #f59e0b
  default: [107, 114, 128],    // #6b7280
  dim: [209, 213, 219],        // #d1d5db
  labelFill: "#ffffff",
};

const DARK_PALETTE: Palette = {
  highlight: [96, 165, 250],   // #60a5fa
  secondary: [251, 191, 36],   // #fbbf24
  default: [156, 163, 175],    // #9ca3af
  dim: [55, 65, 81],           // #374151
  labelFill: "#0a0a0a",
};

function parseHex(hex: string): RGB {
  const h = hex.startsWith("#") ? hex.slice(1) : hex;
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function lerpRgb(a: RGB, b: RGB, t: number): string {
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgb(${r},${g},${bl})`;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function getTargetColor(
  cmd: DrawCommand,
  hasAnyHighlight: boolean,
  palette: Palette,
): RGB {
  if (cmd.color !== undefined) {
    if (hasAnyHighlight && !cmd.highlighted) {
      return palette.dim;
    }
    return parseHex(cmd.color);
  }
  if (!hasAnyHighlight) return palette.default;
  if (!cmd.highlighted) return palette.dim;
  if ("highlightGroup" in cmd && cmd.highlightGroup === "secondary") {
    return palette.secondary;
  }
  return palette.highlight;
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

function detectPalette(el: HTMLElement): Palette {
  const bg = getComputedStyle(el).getPropertyValue("--background").trim();
  if (!bg) return LIGHT_PALETTE;
  const rgb = parseHex(bg);
  // Simple luminance check: dark background = dark mode
  return rgb[0] + rgb[1] + rgb[2] < 384 ? DARK_PALETTE : LIGHT_PALETTE;
}

export function GraphCanvas({
  commands,
  width,
  height,
  onNodeClick,
}: GraphCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animStateRef = useRef<Map<string, AnimationState>>(new Map());
  const animFrameRef = useRef<number>(0);

  const hitTestNode = useCallback(
    (clientX: number, clientY: number): string | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      for (const cmd of commands) {
        if (cmd.type !== "circle") continue;
        const dx = x - cmd.x;
        const dy = y - cmd.y;
        if (dx * dx + dy * dy <= cmd.radius * cmd.radius) {
          return cmd.id;
        }
      }
      return null;
    },
    [commands],
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!onNodeClick) return;
      const nodeId = hitTestNode(e.clientX, e.clientY);
      if (nodeId) {
        onNodeClick(nodeId);
      }
    },
    [hitTestNode, onNodeClick],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!onNodeClick) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const nodeId = hitTestNode(e.clientX, e.clientY);
      canvas.style.cursor = nodeId ? "pointer" : "";
    },
    [hitTestNode, onNodeClick],
  );

  const draw = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      canvasBg: string,
      palette: Palette,
      t: number,
    ) => {
      ctx.save();
      const dpr = window.devicePixelRatio || 1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.fillStyle = canvasBg;
      ctx.fillRect(0, 0, width, height);

      const hasAnyHighlight = commands.some((c) => c.highlighted);
      const animState = animStateRef.current;

      for (const cmd of commands) {
        const key = commandKey(cmd);
        const targetColor = getTargetColor(cmd, hasAnyHighlight, palette);
        const targetLineWidth = getTargetLineWidth(cmd);
        const targetPos = getTargetPosition(cmd);

        let prev = animState.get(key);
        if (!prev) {
          prev = {
            color: targetColor,
            lineWidth: targetLineWidth,
            pos: targetPos,
          };
          animState.set(key, prev);
        }

        const color = lerpRgb(prev.color, targetColor, t);
        const lineWidth = lerp(prev.lineWidth, targetLineWidth, t);
        const x = lerp(prev.pos.x, targetPos.x, t);
        const y = lerp(prev.pos.y, targetPos.y, t);

        switch (cmd.type) {
          case "line": {
            const x2 = lerp(
              prev.pos.x2 ?? targetPos.x2!,
              targetPos.x2!,
              t,
            );
            const y2 = lerp(
              prev.pos.y2 ?? targetPos.y2!,
              targetPos.y2!,
              t,
            );
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
            ctx.fillStyle = palette.labelFill;
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
    const palette = detectPalette(canvas);

    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const rawT = Math.min(elapsed / ANIMATION_DURATION, 1);
      const t = ease(rawT);

      draw(ctx!, canvasBg, palette, t);

      if (rawT < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete — snapshot final state
        const hasAnyHighlight = commands.some((c) => c.highlighted);
        const animState = animStateRef.current;
        for (const cmd of commands) {
          const key = commandKey(cmd);
          animState.set(key, {
            color: getTargetColor(cmd, hasAnyHighlight, palette),
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
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      style={{ width: `${width}px`, height: `${height}px` }}
    />
  );
}
