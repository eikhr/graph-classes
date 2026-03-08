/**
 * Take a screenshot of a page on the dev server.
 * Usage: pnpm screenshot [path] [output]
 * Examples:
 *   pnpm screenshot              # screenshots /
 *   pnpm screenshot /classes/path
 *   pnpm screenshot /classes/path screenshot.png
 */
import { chromium } from "@playwright/test";

const path = process.argv[2] ?? "/";
const output = process.argv[3] ?? "screenshot.png";
const url = `http://localhost:3000${path}`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto(url, { waitUntil: "networkidle" });
await page.screenshot({ path: output, fullPage: true });
await browser.close();
console.log(`Screenshot saved: ${output}`);
