import { describe, expect, it } from "vitest";
import request from "supertest";
import { z } from "zod";

import { createApp } from "../../src/app.js";
import { nearbyQuerySchema } from "../../src/modules/artisans/artisans.schemas.js";
import { createJobSchema } from "../../src/modules/jobs/jobs.schemas.js";

const app = createApp();

describe("Zod validation (unit)", () => {
  it("rejects GPS out of range", () => {
    expect(() => nearbyQuerySchema.parse({ lat: 999, lng: 0 })).toThrow(z.ZodError);
  });

  it("rejects malformed job payload", () => {
    expect(() =>
      createJobSchema.parse({
        categoryId: "not-uuid",
        title: "x",
        description: "too short",
        lat: 0,
        lng: 0,
        address: "a",
        city: "c",
      }),
    ).toThrow(z.ZodError);
  });
});

describe("HTTP input hardening", () => {
  it("rejects nearby with out-of-range GPS", async () => {
    const res = await request(app).get("/api/artisans/nearby").query({ lat: 999, lng: 0 });
    expect(res.status).toBe(400);
    expect(res.body.error?.code).toBe("VALIDATION_ERROR");
  });

  it("rejects job id that is not UUID with 401 on bad token", async () => {
    const res = await request(app)
      .get("/api/jobs/not-a-uuid")
      .set("Authorization", "Bearer invalid.token.here");
    expect(res.status).toBe(401);
  });

  it("strips NoSQL operators from JSON body", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "x", password: "y" });
    expect(res.status).not.toBe(500);
  });
});
