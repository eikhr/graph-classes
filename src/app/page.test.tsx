import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import Home from "./page";

describe("Home page", () => {
  it("renders without crashing", () => {
    render(<Home />);
    expect(document.body).toBeTruthy();
  });
});
