const { test, describe } = require("node:test");
const assert = require("node:assert");
const request = require("supertest");
const app = require("../server");

process.env.JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret_12345";

describe("API Endpoints Integration Tests", () => {
  test("GET /api/health should return status OK", async () => {
    const res = await request(app).get("/api/health");
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, "OK");
    assert.ok(res.body.timestamp);
  });

  test("GET /api/clients without auth header/cookie should return 401", async () => {
    const res = await request(app).get("/api/clients");
    assert.strictEqual(res.status, 401);
  });

  test("POST /api/auth/login with invalid email should return 400", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "invalid-email", password: "123" });
    assert.strictEqual(res.status, 400);
  });

  test("POST /api/auth/register with empty fields should return 400", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "", email: "", password: "" });
    assert.strictEqual(res.status, 400);
  });
});
