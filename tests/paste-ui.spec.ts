import { test, expect } from "@playwright/test";
import path from "path";

const uiPath = path.join(process.cwd(), "ui.html");

test.describe("Paste Table UI", () => {
  test("has Paste and create table button", async ({ page }) => {
    const start = Date.now();
    await page.goto(`file://${uiPath}`);
    const btn = page.getByRole("button", { name: /paste and create table/i });
    await expect(btn).toBeVisible();
    const loadMs = Date.now() - start;
    expect(loadMs).toBeLessThan(5000);
  });

  test("footer shows Created by Habib Ayoade and Buy Coffee link", async ({ page }) => {
    await page.goto(`file://${uiPath}`);
    await expect(page.getByText("Created by Habib Ayoade", { exact: false })).toBeVisible();
    const link = page.getByRole("link", { name: /buy coffee/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "https://buymeacoffee.com/ayoadehabib");
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("paste area and button are interactive", async ({ page }) => {
    await page.goto(`file://${uiPath}`);
    const textarea = page.locator("#paste-area");
    await textarea.fill("A\tB\n1\t2");
    await expect(textarea).toHaveValue("A\tB\n1\t2");
    const btn = page.getByRole("button", { name: /paste and create table/i });
    await expect(btn).toBeEnabled();
  });
});
