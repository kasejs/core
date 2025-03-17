import { vi } from "vitest";

// Mock console.log to prevent noise in test output
vi.stubGlobal("console", {
  ...console,
  log: vi.fn(),
});
