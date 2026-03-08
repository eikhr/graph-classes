# Testing Guide

This project uses a layered testing approach for agent-driven TDD development.

## Test Layers

| Layer     | Tool          | Command            | Files                    |
| --------- | ------------- | ------------------ | ------------------------ |
| Unit      | Vitest + RTL  | `pnpm test`        | `src/**/*.test.{ts,tsx}` |
| Component | Playwright CT | `pnpm test:ct`     | `src/**/*.ct.{ts,tsx}`   |
| E2E       | Playwright    | `pnpm test:e2e`    | `e2e/**/*.spec.ts`       |
| Visual    | Playwright    | `pnpm test:visual` | `e2e/visual.spec.ts`     |
| All       | —             | `pnpm test:all`    | Everything above         |

## Writing Tests

### Unit Tests (Vitest)

Co-locate with source files. Use for pure functions, hooks, and component logic.

```tsx
// src/components/button.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("renders label", () => {
    render(<Button label="Click me" />);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });
});
```

### Component Tests (Playwright CT)

Use for testing components in a real browser. Good for interaction-heavy components.

```tsx
// src/components/button.ct.tsx
import { test, expect } from "@playwright/experimental-ct-react";
import { Button } from "./button";

test("Button click triggers callback", async ({ mount }) => {
  let clicked = false;
  const component = await mount(
    <Button
      label="Click"
      onClick={() => {
        clicked = true;
      }}
    />,
  );
  await component.click();
  expect(clicked).toBe(true);
});
```

### E2E Tests (Playwright)

Use for full user flows. Tests run against the dev server.

```typescript
// e2e/login.spec.ts
import { test, expect } from "@playwright/test";

test("user can log in", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("user@test.com");
  await page.getByLabel("Password").fill("password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL("/dashboard");
});
```

### Visual Regression

Use `toHaveScreenshot()` in any Playwright test. Update baselines with:

```bash
pnpm test:visual:update
```

## TDD Workflow

1. Write a failing test
2. Run it — confirm it fails
3. Write minimal code to pass
4. Run it — confirm it passes
5. Refactor if needed
6. Commit
