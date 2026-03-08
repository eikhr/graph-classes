# TDD Environment Design for pr-overview

## Overview

Set up a comprehensive TDD environment for a Next.js 15 App Router application, optimized for agent-driven development where tests serve as specs and agents write the implementation.

## Stack

- **Next.js 15** — App Router, TypeScript, pnpm
- **Vitest** — unit and component logic tests (fast, watch mode)
- **React Testing Library** — DOM-based component assertions
- **Playwright** — E2E tests, component tests (CT), visual regression

## Test Layers

| Layer     | Tool                   | Purpose                                |
| --------- | ---------------------- | -------------------------------------- |
| Unit      | Vitest + RTL           | Functions, hooks, component logic      |
| Component | Playwright CT          | Component rendering in real browsers   |
| E2E       | Playwright             | Full user flows against running server |
| Visual    | Playwright screenshots | Screenshot comparison for regression   |

## File Structure

```
pr-overview/
├── src/
│   └── app/                    # Next.js App Router
├── e2e/                        # Playwright E2E tests
├── playwright/                 # Playwright CT setup
├── vitest.config.ts
├── playwright.config.ts
├── playwright-ct.config.ts
├── package.json
└── TESTING.md                  # How to write/run each test type
```

## Test Organization

- Co-located unit tests: `Button.tsx` + `Button.test.tsx`
- E2E tests in top-level `e2e/` directory
- Component tests in `playwright/` directory
- Visual regression snapshots managed by Playwright

## Config Decisions

1. Vitest uses `@vitejs/plugin-react` with `jsdom` environment
2. Playwright `webServer` auto-starts Next.js dev server for E2E
3. Playwright CT configured separately via `playwright-ct.config.ts`
4. Visual regression via `toHaveScreenshot()` with per-project snapshot dirs
5. All reporters configured for agent-readable output (verbose/list)

## Scripts

- `test` — Vitest unit tests
- `test:e2e` — Playwright E2E tests
- `test:ct` — Playwright component tests
- `test:visual` — Playwright visual regression
- `test:all` — Run everything
