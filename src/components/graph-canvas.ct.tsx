import { test, expect } from "@playwright/experimental-ct-react";
import { GraphCanvas } from "./graph-canvas";
import type { DrawCommand } from "@/rendering/draw-commands";

const sampleCommands: DrawCommand[] = [
  { type: "circle", id: "a", x: 100, y: 100, radius: 16, highlighted: false },
  { type: "circle", id: "b", x: 200, y: 100, radius: 16, highlighted: true },
  { type: "line", id: "a-b", x1: 100, y1: 100, x2: 200, y2: 100, highlighted: false },
  { type: "label", id: "label-a", text: "A", x: 100, y: 100, highlighted: false },
];

test("renders a canvas element", async ({ mount, page }) => {
  await mount(
    <GraphCanvas commands={sampleCommands} width={400} height={300} />,
  );
  const canvas = page.locator("canvas");
  await expect(canvas).toBeVisible();
});

test("canvas has correct dimensions", async ({ mount, page }) => {
  await mount(
    <GraphCanvas commands={sampleCommands} width={400} height={300} />,
  );
  const canvas = page.locator("canvas");
  await expect(canvas).toHaveCSS("width", "400px");
  await expect(canvas).toHaveCSS("height", "300px");
});
