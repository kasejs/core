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
    provider: {
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
      provider: {
        value: env<"a" | "b">("PROVIDER_VALUE", "a"),
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
    it("should be able to get config defined in the provider", () => {
      process.env.PROVIDER_VALUE = "a";

      configure({
        providers: [TestProvider],
      });

      expect(config.get("provider.value")).toBe("a");
    });

    it("should be able to get config defined explicitly", () => {
      process.env.EXPLICIT_VALUE = "b";

      configure({
        explicit: {
          value: env("EXPLICIT_VALUE", "b"),
        },
      });

      expect(config.get("explicit.value")).toBe("b");
    });
  });
});
