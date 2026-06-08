import { test, expect, Page } from "@playwright/test";

// Capture console errors and JS exceptions per page
async function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`[console.error] ${msg.text()}`);
  });
  page.on("pageerror", (err) => errors.push(`[pageerror] ${err.message}`));
  return errors;
}

// Wait for the page to stop loading Supabase data (network idle)
async function waitForData(page: Page) {
  await page.waitForLoadState("networkidle", { timeout: 12000 }).catch(() => {});
}

test.describe("Dashboard /", () => {
  test("renders without JS errors", async ({ page }) => {
    const errors = await collectErrors(page);
    await page.goto("/");
    await waitForData(page);

    // Key UI elements
    await expect(page.getByText("Sprint 14 Dashboard")).toBeVisible();
    await expect(page.getByText("Velocity Trend")).toBeVisible();
    await expect(page.getByText("Health Score")).toBeVisible();

    // Chart loads with real data (velocity line chart should have path elements)
    await expect(page.locator(".recharts-line")).toBeVisible({ timeout: 8000 });

    expect(errors).toHaveLength(0);
  });

  test("health score is non-zero", async ({ page }) => {
    await page.goto("/");
    await waitForData(page);
    const scoreText = await page.locator("text=/ 100").first().textContent();
    expect(scoreText).not.toBeNull();
    // Score should be a number > 0
    const score = parseInt(await page.locator(".tracking-tight").filter({ hasText: / \/ 100/ }).textContent() ?? "0");
    expect(score).toBeGreaterThan(0);
  });

  test("Roast modal opens and closes", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /roast/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });
});

test.describe("Planning /planning", () => {
  test("renders without JS errors", async ({ page }) => {
    const errors = await collectErrors(page);
    await page.goto("/planning");
    await waitForData(page);

    await expect(page.getByText("Backlog")).toBeVisible();
    expect(errors).toHaveLength(0);
  });

  test("loads backlog tasks from Supabase", async ({ page }) => {
    await page.goto("/planning");
    await waitForData(page);

    // Should have task rows (not the empty state)
    await expect(page.getByText(/No backlog tasks/i)).not.toBeVisible({ timeout: 8000 });
    const taskCount = await page.locator("button.w-full.text-left").count();
    expect(taskCount).toBeGreaterThan(0);
  });

  test("selecting a task shows AI sizing panel", async ({ page }) => {
    await page.goto("/planning");
    await waitForData(page);

    await page.locator("button.w-full.text-left").first().click();
    await expect(page.getByRole("heading", { name: "AI Sizing" })).toBeVisible();
    await expect(page.getByText("Suggested")).toBeVisible();
  });

  test("search filters tasks", async ({ page }) => {
    await page.goto("/planning");
    await waitForData(page);

    const beforeCount = await page.locator("button.w-full.text-left").count();
    await page.getByPlaceholder("Search backlog…").fill("payment");
    await expect(page.locator("button.w-full.text-left")).not.toHaveCount(beforeCount);
  });
});

test.describe("Breakdown /breakdown", () => {
  test("renders without JS errors", async ({ page }) => {
    const errors = await collectErrors(page);
    await page.goto("/breakdown");
    await waitForData(page);

    await expect(page.getByText("Implement Payment Flow")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Sub-tasks" })).toBeVisible();
    expect(errors).toHaveLength(0);
  });

  test("auto-runs AI breakdown on mount and shows subtasks", async ({ page }) => {
    await page.goto("/breakdown");

    // AI pipeline runs automatically — wait for skeleton to disappear and rows to appear
    await expect(page.getByText(/No sub-tasks generated/i)).not.toBeVisible({ timeout: 30000 });
    await expect(page.locator("tbody tr").first()).toBeVisible({ timeout: 30000 });
    const rows = await page.locator("tbody tr").count();
    expect(rows).toBeGreaterThan(0);
  });

  test("team load bars render", async ({ page }) => {
    await page.goto("/breakdown");
    await waitForData(page);

    await expect(page.getByText("Team Load")).toBeVisible();
    const bars = await page.locator(".bg-emerald-500, .bg-amber-500, .bg-rose-500").count();
    expect(bars).toBeGreaterThan(0);
  });
});

test.describe("Review /review", () => {
  test("renders without JS errors", async ({ page }) => {
    const errors = await collectErrors(page);
    await page.goto("/review");
    await waitForData(page);

    await expect(page.getByText("Sprint 14 Review")).toBeVisible();
    await expect(page.getByText("Planned vs Done")).toBeVisible();
    expect(errors).toHaveLength(0);
  });

  test("planned vs done chart loads", async ({ page }) => {
    await page.goto("/review");
    await waitForData(page);

    await expect(page.locator(".recharts-bar").first()).toBeVisible({ timeout: 8000 });
  });

  test("Generate Review button is interactive", async ({ page }) => {
    await page.goto("/review");
    const btn = page.getByRole("button", { name: /generate review/i });
    await expect(btn).toBeEnabled();
  });
});

test.describe("Health & Risk /risk", () => {
  test("renders without JS errors", async ({ page }) => {
    const errors = await collectErrors(page);
    await page.goto("/risk");
    await waitForData(page);

    await expect(page.getByText("Score & Risk")).toBeVisible();
    await expect(page.getByText("Butterfly Effect Simulator")).toBeVisible();
    expect(errors).toHaveLength(0);
  });

  test("health gauge shows score", async ({ page }) => {
    await page.goto("/risk");
    await waitForData(page);

    await expect(page.locator("svg circle.stroke-emerald-500, svg circle.stroke-amber-500, svg circle.stroke-rose-500")).toBeVisible({ timeout: 8000 });
  });

  test("blockable task select is populated", async ({ page }) => {
    await page.goto("/risk");
    await waitForData(page);

    const trigger = page.locator("[data-radix-collection-item]").first();
    // Dropdown should have tasks loaded
    const count = await page.locator("text=Block task").count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});

test.describe("Navigation", () => {
  test("sidebar links navigate correctly", async ({ page }) => {
    await page.goto("/");
    const links = [
      { label: "Sprint Planning", path: "/planning" },
      { label: "Task Breakdown", path: "/breakdown" },
      { label: "Sprint Review", path: "/review" },
      { label: "Health & Risk", path: "/risk" },
      { label: "Dashboard", path: "/" },
    ];
    for (const { label, path } of links) {
      await page.getByRole("link", { name: label }).click();
      await expect(page).toHaveURL(new RegExp(path === "/" ? "^http://localhost:3000/$" : path));
      await page.waitForLoadState("domcontentloaded");
    }
  });
});
