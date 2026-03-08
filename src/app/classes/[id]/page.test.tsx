import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ClassPage from "./page";

// Mock canvas — jsdom doesn't support canvas rendering
vi.mock("@/components/graph-canvas", () => ({
  GraphCanvas: ({ commands }: { commands: unknown[] }) => (
    <div data-testid="graph-canvas" data-command-count={commands.length} />
  ),
}));

vi.mock("@/components/graph-icon", () => ({
  GraphIcon: () => <div data-testid="graph-icon" />,
}));

describe("Class detail page", () => {
  it("renders the class name as heading", async () => {
    const page = await ClassPage({ params: Promise.resolve({ id: "path" }) });
    render(page);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Path graph");
  });

  it("renders the class description", async () => {
    const page = await ClassPage({ params: Promise.resolve({ id: "path" }) });
    render(page);
    expect(screen.getByText(/vertices of degree 1/i)).toBeInTheDocument();
  });

  it("renders reference links", async () => {
    const page = await ClassPage({ params: Promise.resolve({ id: "path" }) });
    render(page);
    expect(screen.getByText(/Wikipedia/i)).toBeInTheDocument();
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
    const treeLink = screen.getByRole("link", { name: /tree/i });
    expect(treeLink).toBeInTheDocument();
    // Links to inclusion proof page when proof exists
    expect(treeLink.getAttribute("href")).toBe("/inclusions/path/tree");
  });
});
