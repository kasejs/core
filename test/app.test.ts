import { Sparkle } from "../src/index.js";

import { beforeEach, describe, expect, it, vi } from "vitest";

describe("Application", () => {
  let sparkle: Sparkle;

  beforeEach(() => {
    // Create a fresh instance before each test
    sparkle = new Sparkle();

    // Clear mocks between tests
    vi.clearAllMocks();
  });

  describe("run method", () => {
    it("should print 'Application started' to the console", async () => {
      // Act
      await sparkle.run();

      // Assert
      expect(console.log).toHaveBeenCalledWith("Application started");
    });
  });
});
