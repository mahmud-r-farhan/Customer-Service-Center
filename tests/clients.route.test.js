const { test, describe } = require("node:test");
const assert = require("node:assert");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../server");

process.env.JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret_12345";

function authCookie() {
  const token = jwt.sign(
    { id: "000000000000000000000000", role: "agent", email: "agent@example.com" },
    process.env.JWT_SECRET
  );
  return [`token=${token}`];
}

describe("Client status update validation", () => {
  test("rejects a malformed client id with 400", async () => {
    const res = await request(app)
      .put("/api/clients/not-a-valid-id/status")
      .set("Cookie", authCookie())
      .send({ status: "queued" });
    assert.strictEqual(res.status, 400);
  });

  test("rejects an invalid status value with 400", async () => {
    const res = await request(app)
      .put("/api/clients/000000000000000000000000/status")
      .set("Cookie", authCookie())
      .send({ status: "bogus-status" });
    assert.strictEqual(res.status, 400);
  });
});

describe("Unknown routes and CORS", () => {
  test("GET on an unknown API route returns 404", async () => {
    const res = await request(app).get("/api/does-not-exist");
    assert.strictEqual(res.status, 404);
  });

  test("recycle-tokens endpoint requires DELETE (GET should 404)", async () => {
    const res = await request(app).get("/api/clients/recycle-tokens");
    assert.strictEqual(res.status, 404);
  });
});
