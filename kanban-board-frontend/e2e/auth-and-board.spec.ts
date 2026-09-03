import { test, expect } from "@playwright/test";
test("unauthenticated users are sent to login from boards", async ({
  page,
}) => {
  await page.goto("/boards");
  await expect(page).toHaveURL(/\/login$/);
  await expect(
    page.getByRole("heading", { name: "Welcome back" }),
  ).toBeVisible();
});
test("register page exposes accessible form controls", async ({ page }) => {
  await page.goto("/register");
  await expect(page.getByLabel("Name")).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByRole("button", { name: "Register" })).toBeVisible();
});
