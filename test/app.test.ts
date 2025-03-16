import { Application } from "../src/index.js";

import { beforeEach, describe, expect, it, vi } from "vitest";

describe("Application", () => {
  let app: Application;

  beforeEach(() => {
    // Create a fresh instance before each test
    app = new Application();

    // Clear mocks between tests
    vi.clearAllMocks();
  });

  describe("run method", () => {
    it("should print 'Application started' to the console", async () => {
      // Act
      await app.run();

      // Assert
      expect(app).toHaveProperty("container");
    });
  });
});
