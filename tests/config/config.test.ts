import { env } from "../../src/config/env.ts";
import { config, configure } from "../../src/config/index.ts";
import { Provider } from "../../src/providers/index.ts";

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

/**
 * Here we are extending the core config with new properties
 * that will be available to the config instance and will be
 * automatically suggested by the IDE when using the
 * `config.get("path.to.property")` method.
 */
declare module "../../src/config/types.ts" {
  interface Configuration {
    test: {
      value: "a" | "b";
    };
  }
}

export class TestProvider extends Provider {
  /**
   * Get default logger configuration
   */
  public config() {
    return {
      test: {
        value: env<"a" | "b">("TEST_VALUE", "a"),
      },
    };
  }

  public register() {
    // no-op
  }

  public async boot() {
    // no-op
  }
}

describe("Config", () => {
  // Store original env variables to restore them after tests
  const originalEnv = { ...process.env };

  beforeEach(() => {
    // Reset env variables before each test
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore env variables after each test
    process.env = originalEnv;
  });

  describe("provider", () => {
    it("should be able to get extended config defined in a provider", () => {
      process.env.TEST_VALUE = "a";

      configure({
        providers: [TestProvider],
      });

      expect(config.get("test.value")).toBe("a");
    });

    it("should be able to get value from env variable", () => {
      process.env.TEST_VALUE = "b";

      configure({
        providers: [TestProvider],
      });

      expect(config.get("test.value")).toBe("b");
    });

    it("should be able to get provider value in unsafe manner", () => {
      process.env.TEST_VALUE = "c";

      configure({
        providers: [TestProvider],
      });

      const value = config.maybe<string>("test.value");

      expect(value).toBeTypeOf("string");
      expect(value).toBe("c");
    });

    it("should be able to get explicit config in unsafe manner", () => {
      process.env.EXPLICIT_VALUE = "foo";

      configure({
        explicit: {
          value: env("EXPLICIT_VALUE", "bar"),
        },
      });

      const value = config.maybe<string>("explicit.value");

      expect(value).toBeTypeOf("string");
      expect(value).toBe("foo");
    });
  });
});
