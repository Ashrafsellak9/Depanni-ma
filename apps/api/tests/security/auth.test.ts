import { describe, expect, it } from "vitest";
import jwt from "jsonwebtoken";
import { generateKeyPairSync } from "node:crypto";

import {
  signAccessToken,
  verifyAccessToken,
} from "../../src/config/jwt.js";

describe("JWT RS256 security", () => {
  const { privateKey, publicKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });

  it("rejects tampered token", () => {
    const token = jwt.sign(
      { userId: "u1", role: "CITIZEN" },
      privateKey,
      { algorithm: "RS256", expiresIn: "15m" },
    );
    const bad = `${token.slice(0, -3)}xxx`;
    expect(() => jwt.verify(bad, publicKey, { algorithms: ["RS256"] })).toThrow();
  });

  it("rejects expired token", () => {
    const token = jwt.sign(
      { userId: "u1", role: "CITIZEN" },
      privateKey,
      { algorithm: "RS256", expiresIn: "-1s" },
    );
    expect(() => jwt.verify(token, publicKey, { algorithms: ["RS256"] })).toThrow();
  });

  it("rejects HS256 token when RS256 expected", () => {
    const token = jwt.sign({ userId: "u1", role: "ADMIN" }, "symmetric-secret", {
      algorithm: "HS256",
    });
    expect(() => jwt.verify(token, publicKey, { algorithms: ["RS256"] })).toThrow();
  });

  it("signs and verifies access token in test mode", () => {
    const token = signAccessToken({ userId: "test-user", role: "ADMIN" });
    const payload = verifyAccessToken(token);
    expect(payload.userId).toBe("test-user");
    expect(payload.role).toBe("ADMIN");
  });
});
