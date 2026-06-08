import { chromium } from "@playwright/test";

export default async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  // Pre-warm all pages so Next.js compiles them before tests start
  const pages = ["/", "/planning", "/breakdown", "/review", "/risk"];
  for (const url of pages) {
    await page.goto(`http://localhost:3000${url}`);
    await page.waitForLoadState("networkidle").catch(() => {});
  }
  await browser.close();
}
