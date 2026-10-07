import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import Home from "./page";

vi.mock("@/components/graph-icon", () => ({
  GraphIcon: () => <div data-testid="graph-icon" />,
}));

describe("Home page", () => {
  it("renders the site title", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Graph Classes");
  });

  it("renders a card for each graph class", () => {
    render(<Home />);
    expect(screen.getByText("Path graph")).toBeInTheDocument();
    expect(screen.getByText("Cycle graph")).toBeInTheDocument();
    expect(screen.getByText("Tree")).toBeInTheDocument();
    expect(screen.getByText("Bipartite graph")).toBeInTheDocument();
    expect(screen.getByText("Complete graph")).toBeInTheDocument();
  });

  it("each card links to the class page", () => {
    render(<Home />);
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThanOrEqual(5);
    expect(links.some((l) => l.getAttribute("href") === "/classes/path")).toBe(true);
  });
});
