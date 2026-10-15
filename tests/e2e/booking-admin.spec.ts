import { expect, test } from "@playwright/test";

test("booking page presents the appointment flow", async ({ page }) => {
  await page.goto("/book");
  await expect(page.getByRole("heading", { name: /book your moment/i })).toBeVisible();
  await expect(page.getByLabel("Choose a date")).toBeVisible();
  await expect(page.getByRole("heading", { name: /choose your ritual/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /your details/i })).toBeVisible();
});

test("owner dashboard requires authentication", async ({ page, request }) => {
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
  const response = await request.get("/api/admin/appointments");
  expect(response.status()).toBe(401);
});

test("invalid appointment payload is rejected before database access", async ({ request }) => {
  const response = await request.post("/api/appointments", { data: { serviceId: "not-an-id" } });
  expect(response.status()).toBe(400);
});
