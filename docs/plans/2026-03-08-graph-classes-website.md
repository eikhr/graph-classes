# Graph Classes Website Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a website showing graph class relationships with animated canvas-based visualizations explaining each class.

**Architecture:** Next.js App Router with TypeScript data files defining graph classes. A canvas renderer uses a draw-command abstraction for future extensibility (hypergraphs). Step-based explanation UI animates through highlights on the canvas.

**Tech Stack:** Next.js 16, React 19, TypeScript, HTML Canvas API, Vitest + RTL, Playwright CT

---

### Task 1: Data Model Types

**Files:**
- Create: `src/types/graph.ts`
- Test: `src/types/graph.test.ts`

**Step 1: Write the failing test**

```ts
// src/types/graph.test.ts
import { describe, it, expect } from "vitest";
import type { Graph, GraphClass, GraphExample, ExplanationStep } from "./graph";

describe("Graph types", () => {
  it("allows creating a valid Graph", () => {
    const graph: Graph = {
      nodes: [
        { id: "a", x: 0, y: 0 },
        { id: "b", x: 100, y: 0, label: "B" },
      ],
      edges: [{ source: "a", target: "b" }],
    };
    expect(graph.nodes).toHaveLength(2);
    expect(graph.edges).toHaveLength(1);
  });

  it("allows creating a valid ExplanationStep", () => {
    const step: ExplanationStep = {
      text: "This is a path",
      highlightNodes: ["a", "b"],
      highlightEdges: [["a", "b"]],
    };
    expect(step.text).toBe("This is a path");
  });

  it("allows creating a step with added nodes/edges", () => {
    const step: ExplanationStep = {
      text: "Add a new node",
      addedNodes: [{ id: "c", x: 50, y: 50 }],
      addedEdges: [{ source: "a", target: "c" }],
    };
    expect(step.addedNodes).toHaveLength(1);
  });

  it("allows creating a valid GraphClass", () => {
    const graphClass: GraphClass = {
      id: "path",
      name: "Path Graph",
      description: "A graph where vertices form a single line.",
      references: [{ title: "Wikipedia", url: "https://en.wikipedia.org/wiki/Path_graph" }],
      superclasses: ["tree"],
      examples: [
        {
          graph: {
            nodes: [{ id: "a", x: 0, y: 0 }],
            edges: [],
          },
          steps: [{ text: "A single node is a trivial path." }],
        },
      ],
    };
    expect(graphClass.id).toBe("path");
    expect(graphClass.examples).toHaveLength(1);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test:unit -- src/types/graph.test.ts`
Expected: FAIL — module `./graph` not found

**Step 3: Write minimal implementation**

```ts
// src/types/graph.ts
export type GraphNode = {
  id: string;
  x: number;
  y: number;
  label?: string;
};

export type GraphEdge = {
  source: string;
  target: string;
};

export type Graph = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

export type ExplanationStep = {
  text: string;
  highlightNodes?: string[];
  highlightEdges?: [string, string][];
  addedNodes?: GraphNode[];
  addedEdges?: GraphEdge[];
};

export type GraphExample = {
  graph: Graph;
  steps: ExplanationStep[];
};

export type GraphClass = {
  id: string;
  name: string;
  description: string;
  references: { title: string; url: string }[];
  superclasses: string[];
  examples: GraphExample[];
};
```

**Step 4: Run test to verify it passes**

Run: `pnpm test:unit -- src/types/graph.test.ts`
Expected: PASS — all 4 tests pass

**Step 5: Commit**

```bash
git add src/types/graph.ts src/types/graph.test.ts
git commit -m "feat: add graph data model types"
```

---

### Task 2: Draw Command Abstraction

**Files:**
- Create: `src/rendering/draw-commands.ts`
- Test: `src/rendering/draw-commands.test.ts`

**Step 1: Write the failing test**

```ts
// src/rendering/draw-commands.test.ts
import { describe, it, expect } from "vitest";
import type { DrawCommand } from "./draw-commands";
import { graphToDrawCommands } from "./draw-commands";
import type { Graph } from "@/types/graph";

describe("graphToDrawCommands", () => {
  it("generates circle commands for nodes", () => {
    const graph: Graph = {
      nodes: [{ id: "a", x: 50, y: 50 }],
      edges: [],
    };
    const commands = graphToDrawCommands(graph, {});
    const circles = commands.filter((c) => c.type === "circle");
    expect(circles).toHaveLength(1);
    expect(circles[0]).toMatchObject({
      type: "circle",
      x: 50,
      y: 50,
      radius: expect.any(Number),
    });
  });

  it("generates line commands for edges", () => {
    const graph: Graph = {
      nodes: [
        { id: "a", x: 0, y: 0 },
        { id: "b", x: 100, y: 0 },
      ],
      edges: [{ source: "a", target: "b" }],
    };
    const commands = graphToDrawCommands(graph, {});
    const lines = commands.filter((c) => c.type === "line");
    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatchObject({
      type: "line",
      x1: 0,
      y1: 0,
      x2: 100,
      y2: 0,
    });
  });

  it("generates label commands for nodes with labels", () => {
    const graph: Graph = {
      nodes: [{ id: "a", x: 50, y: 50, label: "A" }],
      edges: [],
    };
    const commands = graphToDrawCommands(graph, {});
    const labels = commands.filter((c) => c.type === "label");
    expect(labels).toHaveLength(1);
    expect(labels[0]).toMatchObject({
      type: "label",
      text: "A",
      x: 50,
      y: 50,
    });
  });

  it("marks highlighted nodes", () => {
    const graph: Graph = {
      nodes: [
        { id: "a", x: 0, y: 0 },
        { id: "b", x: 100, y: 0 },
      ],
      edges: [],
    };
    const commands = graphToDrawCommands(graph, {
      highlightNodes: ["a"],
    });
    const circles = commands.filter((c) => c.type === "circle");
    expect(circles[0]!.highlighted).toBe(true);
    expect(circles[1]!.highlighted).toBe(false);
  });

  it("marks highlighted edges", () => {
    const graph: Graph = {
      nodes: [
        { id: "a", x: 0, y: 0 },
        { id: "b", x: 100, y: 0 },
        { id: "c", x: 50, y: 50 },
      ],
      edges: [
        { source: "a", target: "b" },
        { source: "b", target: "c" },
      ],
    };
    const commands = graphToDrawCommands(graph, {
      highlightEdges: [["a", "b"]],
    });
    const lines = commands.filter((c) => c.type === "line");
    expect(lines[0]!.highlighted).toBe(true);
    expect(lines[1]!.highlighted).toBe(false);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test:unit -- src/rendering/draw-commands.test.ts`
Expected: FAIL — module not found

**Step 3: Write minimal implementation**

```ts
// src/rendering/draw-commands.ts
import type { Graph } from "@/types/graph";

export type CircleCommand = {
  type: "circle";
  x: number;
  y: number;
  radius: number;
  highlighted: boolean;
};

export type LineCommand = {
  type: "line";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  highlighted: boolean;
};

export type LabelCommand = {
  type: "label";
  text: string;
  x: number;
  y: number;
  highlighted: boolean;
};

export type DrawCommand = CircleCommand | LineCommand | LabelCommand;

export type HighlightState = {
  highlightNodes?: string[];
  highlightEdges?: [string, string][];
};

const NODE_RADIUS = 16;

export function graphToDrawCommands(
  graph: Graph,
  highlight: HighlightState,
): DrawCommand[] {
  const commands: DrawCommand[] = [];
  const nodeSet = new Set(highlight.highlightNodes ?? []);

  const edgeSet = new Set(
    (highlight.highlightEdges ?? []).map(([s, t]) => `${s}->${t}`),
  );

  // Edges first (drawn behind nodes)
  for (const edge of graph.edges) {
    const source = graph.nodes.find((n) => n.id === edge.source);
    const target = graph.nodes.find((n) => n.id === edge.target);
    if (!source || !target) continue;

    const key1 = `${edge.source}->${edge.target}`;
    const key2 = `${edge.target}->${edge.source}`;

    commands.push({
      type: "line",
      x1: source.x,
      y1: source.y,
      x2: target.x,
      y2: target.y,
      highlighted: edgeSet.has(key1) || edgeSet.has(key2),
    });
  }

  // Nodes
  for (const node of graph.nodes) {
    commands.push({
      type: "circle",
      x: node.x,
      y: node.y,
      radius: NODE_RADIUS,
      highlighted: nodeSet.has(node.id),
    });

    if (node.label !== undefined) {
      commands.push({
        type: "label",
        text: node.label,
        x: node.x,
        y: node.y,
        highlighted: nodeSet.has(node.id),
      });
    }
  }

  return commands;
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm test:unit -- src/rendering/draw-commands.test.ts`
Expected: PASS — all 5 tests pass

**Step 5: Commit**

```bash
git add src/rendering/draw-commands.ts src/rendering/draw-commands.test.ts
git commit -m "feat: add draw-command abstraction for graph rendering"
```

---

### Task 3: Canvas Renderer Component

**Files:**
- Create: `src/components/graph-canvas.tsx`
- Test: `src/components/graph-canvas.ct.tsx` (Playwright CT — needs real canvas)

**Step 1: Write the failing component test**

```tsx
// src/components/graph-canvas.ct.tsx
import { test, expect } from "@playwright/experimental-ct-react";
import { GraphCanvas } from "./graph-canvas";
import type { DrawCommand } from "@/rendering/draw-commands";

const sampleCommands: DrawCommand[] = [
  { type: "circle", x: 100, y: 100, radius: 16, highlighted: false },
  { type: "circle", x: 200, y: 100, radius: 16, highlighted: true },
  { type: "line", x1: 100, y1: 100, x2: 200, y2: 100, highlighted: false },
  { type: "label", text: "A", x: 100, y: 100, highlighted: false },
];

test("renders a canvas element", async ({ mount }) => {
  const component = await mount(
    <GraphCanvas commands={sampleCommands} width={400} height={300} />,
  );
  const canvas = component.locator("canvas");
  await expect(canvas).toBeVisible();
});

test("canvas has correct dimensions", async ({ mount }) => {
  const component = await mount(
    <GraphCanvas commands={sampleCommands} width={400} height={300} />,
  );
  const canvas = component.locator("canvas");
  await expect(canvas).toHaveCSS("width", "400px");
  await expect(canvas).toHaveCSS("height", "300px");
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test:ct -- src/components/graph-canvas.ct.tsx`
Expected: FAIL — component not found

**Step 3: Write minimal implementation**

```tsx
// src/components/graph-canvas.tsx
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
```

**Step 4: Run test to verify it passes**

Run: `pnpm test:ct -- src/components/graph-canvas.ct.tsx`
Expected: PASS — both tests pass

**Step 5: Commit**

```bash
git add src/components/graph-canvas.tsx src/components/graph-canvas.ct.tsx
git commit -m "feat: add GraphCanvas component with draw-command rendering"
```

---

### Task 4: Graph Explainer Component

**Files:**
- Create: `src/components/graph-explainer.tsx`
- Test: `src/components/graph-explainer.test.tsx` (Vitest — tests logic/DOM, not canvas pixels)

**Step 1: Write the failing test**

```tsx
// src/components/graph-explainer.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { GraphExplainer } from "./graph-explainer";
import type { GraphExample } from "@/types/graph";

// Mock canvas — jsdom doesn't support canvas rendering
vi.mock("./graph-canvas", () => ({
  GraphCanvas: ({ commands }: { commands: unknown[] }) => (
    <div data-testid="graph-canvas" data-command-count={commands.length} />
  ),
}));

const example: GraphExample = {
  graph: {
    nodes: [
      { id: "a", x: 0, y: 0, label: "A" },
      { id: "b", x: 100, y: 0, label: "B" },
      { id: "c", x: 50, y: 80, label: "C" },
    ],
    edges: [
      { source: "a", target: "b" },
      { source: "b", target: "c" },
    ],
  },
  steps: [
    { text: "Here is a path graph." },
    { text: "Node A connects to B.", highlightNodes: ["a", "b"], highlightEdges: [["a", "b"]] },
    { text: "B connects to C.", highlightNodes: ["b", "c"], highlightEdges: [["b", "c"]] },
  ],
};

describe("GraphExplainer", () => {
  it("shows the first step text initially", () => {
    render(<GraphExplainer example={example} />);
    expect(screen.getByText("Here is a path graph.")).toBeInTheDocument();
  });

  it("shows step indicator", () => {
    render(<GraphExplainer example={example} />);
    expect(screen.getByText("Step 1 of 3")).toBeInTheDocument();
  });

  it("advances to next step on Next click", async () => {
    const user = userEvent.setup();
    render(<GraphExplainer example={example} />);
    await user.click(screen.getByRole("button", { name: /next/i }));
    expect(screen.getByText("Node A connects to B.")).toBeInTheDocument();
    expect(screen.getByText("Step 2 of 3")).toBeInTheDocument();
  });

  it("goes back on Previous click", async () => {
    const user = userEvent.setup();
    render(<GraphExplainer example={example} />);
    await user.click(screen.getByRole("button", { name: /next/i }));
    await user.click(screen.getByRole("button", { name: /previous/i }));
    expect(screen.getByText("Here is a path graph.")).toBeInTheDocument();
  });

  it("disables Previous on first step", () => {
    render(<GraphExplainer example={example} />);
    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
  });

  it("disables Next on last step", async () => {
    const user = userEvent.setup();
    render(<GraphExplainer example={example} />);
    await user.click(screen.getByRole("button", { name: /next/i }));
    await user.click(screen.getByRole("button", { name: /next/i }));
    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
  });

  it("renders the canvas mock", () => {
    render(<GraphExplainer example={example} />);
    expect(screen.getByTestId("graph-canvas")).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test:unit -- src/components/graph-explainer.test.tsx`
Expected: FAIL — module not found

**Step 3: Write minimal implementation**

```tsx
// src/components/graph-explainer.tsx
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
```

**Step 4: Run test to verify it passes**

Run: `pnpm test:unit -- src/components/graph-explainer.test.tsx`
Expected: PASS — all 7 tests pass

**Step 5: Commit**

```bash
git add src/components/graph-explainer.tsx src/components/graph-explainer.test.tsx
git commit -m "feat: add GraphExplainer component with step navigation"
```

---

### Task 5: Starter Graph Class Data (Paths, Cycles, Trees, Bipartite, Complete)

**Files:**
- Create: `src/data/graph-classes/path.ts`
- Create: `src/data/graph-classes/cycle.ts`
- Create: `src/data/graph-classes/tree.ts`
- Create: `src/data/graph-classes/bipartite.ts`
- Create: `src/data/graph-classes/complete.ts`
- Create: `src/data/graph-classes/index.ts`
- Test: `src/data/graph-classes/graph-classes.test.ts`

**Step 1: Write the failing test**

```ts
// src/data/graph-classes/graph-classes.test.ts
import { describe, it, expect } from "vitest";
import { graphClasses } from "./index";
import type { GraphClass } from "@/types/graph";

describe("graph class data", () => {
  it("exports all five starter classes", () => {
    expect(graphClasses).toHaveLength(5);
  });

  it("each class has required fields", () => {
    for (const gc of graphClasses) {
      expect(gc.id).toBeTruthy();
      expect(gc.name).toBeTruthy();
      expect(gc.description).toBeTruthy();
      expect(gc.references.length).toBeGreaterThan(0);
      expect(gc.examples.length).toBeGreaterThan(0);
    }
  });

  it("each example has at least one step", () => {
    for (const gc of graphClasses) {
      for (const example of gc.examples) {
        expect(example.steps.length).toBeGreaterThan(0);
        expect(example.graph.nodes.length).toBeGreaterThan(0);
      }
    }
  });

  it("includes path, cycle, tree, bipartite, complete", () => {
    const ids = graphClasses.map((gc) => gc.id);
    expect(ids).toContain("path");
    expect(ids).toContain("cycle");
    expect(ids).toContain("tree");
    expect(ids).toContain("bipartite");
    expect(ids).toContain("complete");
  });

  it("superclass references point to valid class IDs", () => {
    const ids = new Set(graphClasses.map((gc) => gc.id));
    for (const gc of graphClasses) {
      for (const superId of gc.superclasses) {
        expect(ids).toContain(superId);
      }
    }
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test:unit -- src/data/graph-classes/graph-classes.test.ts`
Expected: FAIL — module not found

**Step 3: Write the data files**

Create each of the five graph class data files and the index. Each class should have:
- Accurate description (2-3 sentences)
- 1 example graph with 3-5 explanation steps that walk through the class's defining property
- 1-2 references (Wikipedia + a textbook/paper)
- Correct superclass relationships

Inclusion hierarchy:
- path → superclasses: ["tree"]
- cycle → superclasses: []  (cycles are not trees or bipartite in general)
- tree → superclasses: ["bipartite"]
- bipartite → superclasses: []
- complete → superclasses: []

The index file re-exports all classes as an array:

```ts
// src/data/graph-classes/index.ts
import type { GraphClass } from "@/types/graph";
import { pathClass } from "./path";
import { cycleClass } from "./cycle";
import { treeClass } from "./tree";
import { bipartiteClass } from "./bipartite";
import { completeClass } from "./complete";

export const graphClasses: GraphClass[] = [
  pathClass,
  cycleClass,
  treeClass,
  bipartiteClass,
  completeClass,
];
```

Node positions should be hand-picked for clean layouts (e.g. path nodes in a line, cycle nodes in a circle, tree nodes in a hierarchy). Use a 400×300 coordinate space.

**Step 4: Run test to verify it passes**

Run: `pnpm test:unit -- src/data/graph-classes/graph-classes.test.ts`
Expected: PASS — all 5 tests pass

**Step 5: Commit**

```bash
git add src/data/graph-classes/
git commit -m "feat: add starter graph class data (path, cycle, tree, bipartite, complete)"
```

---

### Task 6: Home Page — Grid of Graph Class Cards

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/layout.tsx` (update metadata)
- Create: `src/app/page.module.css` (replace existing boilerplate styles)
- Test: `src/app/page.test.tsx` (modify existing)

**Step 1: Write the failing test**

```tsx
// src/app/page.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Home from "./page";

describe("Home page", () => {
  it("renders the site title", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Graph Classes");
  });

  it("renders a card for each graph class", () => {
    render(<Home />);
    expect(screen.getByText("Path Graph")).toBeInTheDocument();
    expect(screen.getByText("Cycle Graph")).toBeInTheDocument();
    expect(screen.getByText("Tree")).toBeInTheDocument();
    expect(screen.getByText("Bipartite Graph")).toBeInTheDocument();
    expect(screen.getByText("Complete Graph")).toBeInTheDocument();
  });

  it("each card links to the class page", () => {
    render(<Home />);
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThanOrEqual(5);
    expect(links.some((l) => l.getAttribute("href") === "/classes/path")).toBe(true);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test:unit -- src/app/page.test.tsx`
Expected: FAIL — "Graph Classes" heading not found

**Step 3: Write minimal implementation**

Update `src/app/page.tsx` to import `graphClasses` from the data layer and render a grid of linked cards (name + short description). Update `src/app/layout.tsx` metadata title to "Graph Classes" and description. Add basic grid styles to `page.module.css`.

**Step 4: Run test to verify it passes**

Run: `pnpm test:unit -- src/app/page.test.tsx`
Expected: PASS — all 3 tests pass

**Step 5: Commit**

```bash
git add src/app/page.tsx src/app/page.test.tsx src/app/page.module.css src/app/layout.tsx
git commit -m "feat: add home page with graph class card grid"
```

---

### Task 7: Class Detail Page with Animated Examples

**Files:**
- Create: `src/app/classes/[id]/page.tsx`
- Test: `src/app/classes/[id]/page.test.tsx`

**Step 1: Write the failing test**

```tsx
// src/app/classes/[id]/page.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ClassPage from "./page";

// Mock canvas
vi.mock("@/components/graph-canvas", () => ({
  GraphCanvas: ({ commands }: { commands: unknown[] }) => (
    <div data-testid="graph-canvas" data-command-count={commands.length} />
  ),
}));

describe("Class detail page", () => {
  it("renders the class name as heading", async () => {
    const page = await ClassPage({ params: Promise.resolve({ id: "path" }) });
    render(page);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Path Graph");
  });

  it("renders the class description", async () => {
    const page = await ClassPage({ params: Promise.resolve({ id: "path" }) });
    render(page);
    // Description text should be present (partial match)
    expect(screen.getByText(/path/i)).toBeInTheDocument();
  });

  it("renders reference links", async () => {
    const page = await ClassPage({ params: Promise.resolve({ id: "path" }) });
    render(page);
    expect(screen.getByText("Wikipedia")).toBeInTheDocument();
  });

  it("renders the explainer component", async () => {
    const page = await ClassPage({ params: Promise.resolve({ id: "path" }) });
    render(page);
    expect(screen.getByText(/step 1 of/i)).toBeInTheDocument();
  });

  it("renders superclass links", async () => {
    const page = await ClassPage({ params: Promise.resolve({ id: "path" }) });
    render(page);
    // Path's superclass is tree
    expect(screen.getByRole("link", { name: /tree/i })).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test:unit -- src/app/classes/\\[id\\]/page.test.tsx`
Expected: FAIL — module not found

**Step 3: Write minimal implementation**

```tsx
// src/app/classes/[id]/page.tsx
import { notFound } from "next/navigation";
import { graphClasses } from "@/data/graph-classes";
import { GraphExplainer } from "@/components/graph-explainer";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return graphClasses.map((gc) => ({ id: gc.id }));
}

export default async function ClassPage({ params }: Props) {
  const { id } = await params;
  const graphClass = graphClasses.find((gc) => gc.id === id);

  if (!graphClass) {
    notFound();
  }

  const superclassData = graphClasses.filter((gc) =>
    graphClass.superclasses.includes(gc.id),
  );

  return (
    <main>
      <h1>{graphClass.name}</h1>
      <p>{graphClass.description}</p>

      {graphClass.examples.map((example, i) => (
        <section key={i}>
          <GraphExplainer example={example} />
        </section>
      ))}

      {superclassData.length > 0 && (
        <section>
          <h2>Superclasses</h2>
          <ul>
            {superclassData.map((sc) => (
              <li key={sc.id}>
                <a href={`/classes/${sc.id}`}>{sc.name}</a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2>References</h2>
        <ul>
          {graphClass.references.map((ref, i) => (
            <li key={i}>
              <a href={ref.url} target="_blank" rel="noopener noreferrer">
                {ref.title}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm test:unit -- src/app/classes/\\[id\\]/page.test.tsx`
Expected: PASS — all 5 tests pass

**Step 5: Commit**

```bash
git add src/app/classes/
git commit -m "feat: add graph class detail page with explainer and references"
```

---

### Task 8: E2E Smoke Test

**Files:**
- Modify: `e2e/home.spec.ts` (or create if it doesn't exist)

**Step 1: Write the failing E2E test**

```ts
// e2e/home.spec.ts
import { test, expect } from "@playwright/test";

test("home page shows graph class cards", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Graph Classes");
  await expect(page.getByText("Path Graph")).toBeVisible();
  await expect(page.getByText("Complete Graph")).toBeVisible();
});

test("clicking a card navigates to class page", async ({ page }) => {
  await page.goto("/");
  await page.getByText("Path Graph").click();
  await expect(page).toHaveURL("/classes/path");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Path Graph");
});

test("class page has working step navigation", async ({ page }) => {
  await page.goto("/classes/path");
  await expect(page.getByText(/step 1 of/i)).toBeVisible();
  await page.getByRole("button", { name: /next/i }).click();
  await expect(page.getByText(/step 2 of/i)).toBeVisible();
});

test("class page shows references", async ({ page }) => {
  await page.goto("/classes/path");
  await expect(page.getByText("Wikipedia")).toBeVisible();
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test:e2e -- e2e/home.spec.ts`
Expected: FAIL — page content doesn't match (if run before other tasks, module not found)

**Step 3: No new implementation needed** — this tests the integration of all previous tasks.

**Step 4: Run test to verify it passes**

Run: `pnpm test:e2e -- e2e/home.spec.ts`
Expected: PASS — all 4 tests pass

**Step 5: Commit**

```bash
git add e2e/home.spec.ts
git commit -m "test: add E2E smoke tests for home and class pages"
```

---

### Task 9: Cleanup and Polish

**Files:**
- Modify: `src/app/globals.css` (add base styles for the site)
- Delete: `src/components/heading.tsx` and `src/components/heading.ct.tsx` (unused boilerplate)
- Delete: `public/next.svg`, `public/vercel.svg`, `public/file.svg`, `public/globe.svg`, `public/window.svg` (unused)

**Step 1: Update global styles**

Add minimal typography, card styles, and layout spacing in `globals.css`. Keep it simple — the site should look clean with good readability.

**Step 2: Remove unused boilerplate files**

```bash
rm src/components/heading.tsx src/components/heading.ct.tsx
rm public/next.svg public/vercel.svg public/file.svg public/globe.svg public/window.svg
```

**Step 3: Run all tests**

Run: `pnpm test:all`
Expected: All tests pass (heading tests will need to be removed too)

**Step 4: Commit**

```bash
git add -A
git commit -m "chore: clean up boilerplate and add base styles"
```
