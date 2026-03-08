import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
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
