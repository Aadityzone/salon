import { expect, test } from "@playwright/test";

test("booking page presents the appointment flow", async ({ page }) => {
  await page.goto("/book");
  await expect(page.getByRole("heading", { name: /book your moment/i })).toBeVisible();
  await expect(page.getByLabel("Appointment date")).toBeVisible();
  await expect(page.getByRole("heading", { name: /choose your ritual/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /almost yours/i })).toBeVisible();
});

test("owner dashboard requires authentication", async ({ page, request }) => {
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
  const response = await request.get("/api/admin/appointments");
  expect(response.status()).toBe(401);
  const servicesResponse = await request.get("/api/admin/services");
  expect(servicesResponse.status()).toBe(401);
});

test("invalid appointment payload is rejected before database access", async ({ request }) => {
  const response = await request.post("/api/appointments", { data: { serviceId: "not-an-id" } });
  expect(response.status()).toBe(400);
});

test("concurrent bookings never exceed available staff capacity and owner can view them", async ({ page, request }, testInfo) => {
  test.skip(process.env.E2E_FULL_FLOW !== "1", "Requires the MongoDB-backed CI test environment.");
  const servicesResponse = await request.get("/api/services");
  expect(servicesResponse.ok()).toBeTruthy();
  const { services } = await servicesResponse.json();
  const service = services[0];
  expect(service).toBeTruthy();

  const date = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    .toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  const time = testInfo.project.name.includes("mobile") ? "13:00" : "10:00";
  const payload = (index: number) => ({
    serviceId: service.id,
    date,
    time,
    customerName: `CI Guest ${testInfo.project.name} ${index}`,
    customerPhone: `+91990000${String(index).padStart(4, "0")}`,
    customerEmail: "",
    notes: "Automated Playwright integration test",
  });
  const results = await Promise.all([0, 1, 2].map(index =>
    request.post("/api/appointments", { data: payload(index) })
  ));
  expect(results.filter(r => r.status() === 201)).toHaveLength(2);
  expect(results.filter(r => r.status() === 409)).toHaveLength(1);

  await page.goto("/admin");
  await page.getByLabel("Owner email").fill(process.env.OWNER_EMAIL ?? "owner@example.com");
  await page.getByLabel("Password").fill("TestOwnerPass123!");
  await page.getByRole("button", { name: /sign in securely/i }).click();
  await expect(page.getByRole("heading", { name: /the appointment book/i })).toBeVisible();
  await expect(page.getByText(new RegExp(`CI Guest ${testInfo.project.name}`)).first()).toBeVisible();
});
