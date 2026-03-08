# TDD Environment Setup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Set up a fully working TDD environment with Vitest (unit), Playwright (E2E, component tests, visual regression) for an agent-driven Next.js 15 App Router project.

**Architecture:** Next.js 15 with App Router and TypeScript. Vitest handles fast unit/component-logic tests with jsdom. Playwright handles E2E tests against a running dev server, component tests in real browsers, and visual regression via screenshot comparison.

**Tech Stack:** Next.js 15, TypeScript, pnpm, Vitest, React Testing Library, Playwright

---

### Task 1: Scaffold Next.js Project

**Files:**

- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx`

**Step 1: Create Next.js app with pnpm**

```bash
cd /Users/eik/code/atlas/pr-overview
pnpm create next-app@latest . --typescript --eslint --app --src-dir --no-tailwind --import-alias "@/*" --use-pnpm --no-turbopack
```

Accept defaults. This scaffolds the full Next.js project.

**Step 2: Verify it builds**

Run: `pnpm build`
Expected: Build succeeds with no errors.

**Step 3: Initialize git and commit**

```bash
git init
git add -A
git commit -m "chore: scaffold Next.js 15 app with App Router and TypeScript"
```

---

### Task 2: Install and Configure Vitest

**Files:**

- Create: `vitest.config.ts`
- Modify: `package.json` (add scripts and deps)
- Modify: `tsconfig.json` (add vitest types)

**Step 1: Install Vitest and dependencies**

```bash
pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

**Step 2: Create vitest.config.ts**

Create file `vitest.config.ts` in project root:

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    reporters: ["verbose"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
```

**Step 3: Create vitest.setup.ts**

Create file `vitest.setup.ts` in project root:

```typescript
import "@testing-library/jest-dom/vitest";
```

**Step 4: Add test script to package.json**

Add to `scripts` in `package.json`:

```json
"test": "vitest",
"test:unit": "vitest run"
```

**Step 5: Add vitest types to tsconfig**

Add `"vitest/globals"` to the `types` array in `tsconfig.json` compilerOptions. If no `types` array exists, create one:

```json
"types": ["vitest/globals"]
```

**Step 6: Commit**

```bash
git add vitest.config.ts vitest.setup.ts package.json pnpm-lock.yaml tsconfig.json
git commit -m "chore: configure Vitest with React Testing Library"
```

---

### Task 3: Write and Verify First Unit Test

**Files:**

- Create: `src/app/page.test.tsx`

**Step 1: Write a failing test for the home page**

Create file `src/app/page.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Home from "./page";

describe("Home page", () => {
  it("renders without crashing", () => {
    render(<Home />);
    expect(document.body).toBeTruthy();
  });
});
```

**Step 2: Run test to verify it passes**

Run: `pnpm test:unit`
Expected: PASS — 1 test passes. If the default page uses Next.js `<Image>`, the test may fail. If so, simplify `src/app/page.tsx` to a basic component first:

```tsx
export default function Home() {
  return (
    <main>
      <h1>PR Overview</h1>
    </main>
  );
}
```

Then re-run the test.

**Step 3: Commit**

```bash
git add src/app/page.test.tsx src/app/page.tsx
git commit -m "test: add first unit test for Home page"
```

---

### Task 4: Install and Configure Playwright for E2E

**Files:**

- Create: `playwright.config.ts`
- Create: `e2e/home.spec.ts`
- Modify: `package.json` (add scripts)

**Step 1: Install Playwright**

```bash
pnpm add -D @playwright/test
pnpm exec playwright install --with-deps chromium
```

We only install Chromium to keep it fast. Add more browsers later if needed.

**Step 2: Create playwright.config.ts**

Create file `playwright.config.ts` in project root:

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

**Step 3: Add E2E scripts to package.json**

Add to `scripts` in `package.json`:

```json
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui"
```

**Step 4: Add Playwright ignores to .gitignore**

Append to `.gitignore`:

```
# Playwright
/test-results/
/playwright-report/
/blob-report/
/playwright/.cache/
```

**Step 5: Commit**

```bash
git add playwright.config.ts package.json pnpm-lock.yaml .gitignore
git commit -m "chore: configure Playwright for E2E testing"
```

---

### Task 5: Write and Verify First E2E Test

**Files:**

- Create: `e2e/home.spec.ts`

**Step 1: Write E2E test**

Create file `e2e/home.spec.ts`:

```typescript
import { test, expect } from "@playwright/test";

test("home page loads and shows heading", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "PR Overview" })).toBeVisible();
});
```

**Step 2: Run E2E test**

Run: `pnpm test:e2e`
Expected: PASS — Playwright starts the dev server, navigates to `/`, finds the heading.

**Step 3: Commit**

```bash
git add e2e/home.spec.ts
git commit -m "test: add first E2E test for home page"
```

---

### Task 6: Configure Playwright Component Testing

**Files:**

- Create: `playwright-ct.config.ts`
- Create: `playwright/index.html`
- Create: `playwright/index.tsx`
- Modify: `package.json` (add script)

**Step 1: Install Playwright CT**

```bash
pnpm add -D @playwright/experimental-ct-react
```

**Step 2: Create playwright-ct.config.ts**

Create file `playwright-ct.config.ts` in project root:

```typescript
import { defineConfig, devices } from "@playwright/experimental-ct-react";
import { resolve } from "path";

export default defineConfig({
  testDir: "./src",
  testMatch: "**/*.ct.{ts,tsx}",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",
  use: {
    trace: "on-first-retry",
    ctViteConfig: {
      resolve: {
        alias: {
          "@": resolve(__dirname, "./src"),
        },
      },
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
```

**Step 3: Create playwright/index.html**

Create file `playwright/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>Testing</title>
  </head>
  <body>
    <div id="root"></div>
    <script
      type="module"
      src="./index.tsx"
    ></script>
  </body>
</html>
```

**Step 4: Create playwright/index.tsx**

Create file `playwright/index.tsx`:

```tsx
// Global setup for Playwright component tests
// Import global styles here if needed
```

**Step 5: Add CT script to package.json**

Add to `scripts` in `package.json`:

```json
"test:ct": "playwright test --config playwright-ct.config.ts"
```

**Step 6: Commit**

```bash
git add playwright-ct.config.ts playwright/index.html playwright/index.tsx package.json pnpm-lock.yaml
git commit -m "chore: configure Playwright component testing"
```

---

### Task 7: Write and Verify First Component Test

**Files:**

- Create: `src/components/heading.tsx`
- Create: `src/components/heading.ct.tsx`

**Step 1: Create a simple component**

Create file `src/components/heading.tsx`:

```tsx
export function Heading({ text }: { text: string }) {
  return <h1>{text}</h1>;
}
```

**Step 2: Write component test**

Create file `src/components/heading.ct.tsx`:

```tsx
import { test, expect } from "@playwright/experimental-ct-react";
import { Heading } from "./heading";

test("Heading renders text", async ({ mount }) => {
  const component = await mount(<Heading text="Hello World" />);
  await expect(component).toContainText("Hello World");
});
```

**Step 3: Run component test**

Run: `pnpm test:ct`
Expected: PASS — component mounts in real Chromium, text is found.

**Step 4: Commit**

```bash
git add src/components/heading.tsx src/components/heading.ct.tsx
git commit -m "test: add first Playwright component test"
```

---

### Task 8: Configure Visual Regression Testing

**Files:**

- Create: `e2e/visual.spec.ts`
- Modify: `package.json` (add script)
- Modify: `.gitignore`

**Step 1: Write visual regression test**

Create file `e2e/visual.spec.ts`:

```typescript
import { test, expect } from "@playwright/test";

test("home page visual regression", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveScreenshot("home.png", {
    fullPage: true,
  });
});
```

**Step 2: Add visual test script to package.json**

Add to `scripts` in `package.json`:

```json
"test:visual": "playwright test e2e/visual.spec.ts",
"test:visual:update": "playwright test e2e/visual.spec.ts --update-snapshots"
```

**Step 3: Generate initial snapshots**

Run: `pnpm test:visual:update`
Expected: Creates snapshot files in `e2e/visual.spec.ts-snapshots/`.

**Step 4: Run visual test to verify it passes**

Run: `pnpm test:visual`
Expected: PASS — screenshots match the baselines just created.

**Step 5: Commit snapshots**

```bash
git add e2e/visual.spec.ts e2e/visual.spec.ts-snapshots/ package.json
git commit -m "test: add visual regression test for home page"
```

---

### Task 9: Add test:all Script and TESTING.md

**Files:**

- Modify: `package.json` (add test:all script)
- Create: `TESTING.md`

**Step 1: Add test:all script to package.json**

Add to `scripts`:

```json
"test:all": "pnpm test:unit && pnpm test:ct && pnpm test:e2e"
```

**Step 2: Create TESTING.md**

Create file `TESTING.md` in project root:

````markdown
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
````

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

````

**Step 3: Run all tests to verify everything works**

Run: `pnpm test:all`
Expected: All unit, component, and E2E tests pass.

**Step 4: Commit**

```bash
git add package.json TESTING.md
git commit -m "docs: add TESTING.md and test:all script"
````

---
