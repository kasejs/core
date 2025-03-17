import { env } from "../../src/config/env.ts";

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

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

  describe("environment", () => {
    it("should return the default value when environment variable is not set", () => {
      // Ensure variable doesn't exist
      delete process.env.TEST_VAR;

      expect(env("TEST_VAR", "default")).toBe("default");
      expect(env("TEST_VAR", 123)).toBe(123);
      expect(env("TEST_VAR", true)).toBe(true);
    });

    it("should return the environment variable value with correct type", () => {
      // String
      process.env.STRING_VAR = "test-value";
      expect(env("STRING_VAR", "default")).toBe("test-value");

      // Number
      process.env.NUMBER_VAR = "42";
      expect(env("NUMBER_VAR", 0)).toBe(42);

      // Boolean - truthy values
      const truthyValues = [
        "true",
        "TRUE",
        "True",
        "t",
        "T",
        "yes",
        "YES",
        "y",
        "Y",
        "1",
      ];
      for (const value of truthyValues) {
        process.env.BOOL_VAR = value;
        expect(env("BOOL_VAR", false)).toBe(true);
      }

      // Boolean - falsy values
      const falsyValues = [
        "false",
        "FALSE",
        "False",
        "f",
        "F",
        "no",
        "NO",
        "n",
        "N",
        "0",
      ];
      for (const value of falsyValues) {
        process.env.BOOL_VAR = value;
        expect(env("BOOL_VAR", true)).toBe(false);
      }

      // Boolean - invalid values should return default
      process.env.BOOL_VAR = "not-a-boolean";
      expect(env("BOOL_VAR", true)).toBe(true);
      expect(env("BOOL_VAR", false)).toBe(false);

      // Non-numeric string defaults should be NaN
      process.env.NOT_NUMBER = "not-a-number";
      expect(env("NOT_NUMBER", 42)).toBe(NaN);
    });
  });
});
