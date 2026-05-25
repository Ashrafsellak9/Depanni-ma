import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "tests/**/*.test.ts"],
    globals: false,
    env: {
      NODE_ENV: "test",
      VITEST: "true",
    },
  },
});
