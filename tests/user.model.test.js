const { test, describe } = require("node:test");
const assert = require("node:assert");
const User = require("../models/User");

describe("User model pre-save hook", () => {
  test("hashes the password and completes without hanging", async () => {
    const doc = new User({
      name: "Test Agent",
      email: "hook-test@example.com",
      password: "plainTextPassword123",
    });

    const hooks = User.schema.s.hooks;

    const result = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error("pre-save hook did not complete within 2s"));
      }, 2000);

      hooks.execPre("save", doc, [], (err) => {
        clearTimeout(timer);
        if (err) return reject(err);
        resolve();
      });
    });

    assert.strictEqual(result, undefined);
    assert.notStrictEqual(doc.password, "plainTextPassword123", "password should be hashed");
    assert.ok(doc.password.startsWith("$2"), "password should be a bcrypt hash");

    const isMatch = await doc.comparePassword("plainTextPassword123");
    assert.strictEqual(isMatch, true);
  });

  test("does not re-hash the password when it hasn't changed", async () => {
    const doc = new User({
      name: "Test Agent 2",
      email: "hook-test-2@example.com",
      password: "plainTextPassword123",
    });

    const hooks = User.schema.s.hooks;
    await new Promise((resolve, reject) => {
      hooks.execPre("save", doc, [], (err) => (err ? reject(err) : resolve()));
    });
    const firstHash = doc.password;

    // Simulate an already-persisted, unmodified document.
    doc.isNew = false;
    doc.$__.saveOptions = {};
    doc.$clearModifiedPaths();

    await new Promise((resolve, reject) => {
      hooks.execPre("save", doc, [], (err) => (err ? reject(err) : resolve()));
    });

    assert.strictEqual(doc.password, firstHash, "password hash should be unchanged");
  });

  test("normalizes email to lowercase and trims whitespace", () => {
    const doc = new User({
      name: "  Jane Doe  ",
      email: "  Jane.Doe@Example.COM  ",
      password: "irrelevant",
    });

    assert.strictEqual(doc.email, "jane.doe@example.com");
    assert.strictEqual(doc.name, "Jane Doe");
  });
});
