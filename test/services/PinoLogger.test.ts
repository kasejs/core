import { Logger, PinoLogger } from "../../src/services";

import * as pinoModule from "pino";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

// Mock pino module before any imports are processed
vi.mock("pino", () => {
  const mockLogger = {
    trace: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
  };

  return {
    pino: vi.fn(() => mockLogger),
  };
});

describe("PinoLogger", () => {
  let logger: PinoLogger;
  let mockPinoLogger: any;

  // Store original env variables to restore them after tests
  const originalEnv = { ...process.env };

  beforeEach(() => {
    // Reset env variables before each test
    process.env = { ...originalEnv };
    process.env.LOG_LEVEL = "trace";

    vi.clearAllMocks();
    logger = new PinoLogger();
    // Get the mock instance that was created when pino() was called
    mockPinoLogger = (pinoModule.pino as any)();
  });

  afterEach(() => {
    // Restore env variables after each test
    process.env = originalEnv;
  });

  it("should extend Logger", () => {
    expect(logger).toBeInstanceOf(Logger);
  });

  it("should trace", () => {
    logger.trace("test message");
    expect(mockPinoLogger.trace).toHaveBeenCalledWith(
      {},
      "test message",
    );
  });

  // test different log levels
  it("should log at different levels", () => {
    logger.trace("trace message");
    expect(mockPinoLogger.trace).toHaveBeenCalledWith(
      {},
      "trace message",
    );

    logger.debug("debug message");
    expect(mockPinoLogger.debug).toHaveBeenCalledWith(
      {},
      "debug message",
    );

    logger.info("info message");
    expect(mockPinoLogger.info).toHaveBeenCalledWith(
      {},
      "info message",
    );

    logger.warn("warn message");
    expect(mockPinoLogger.warn).toHaveBeenCalledWith(
      {},
      "warn message",
    );

    logger.error("error message");
    expect(mockPinoLogger.error).toHaveBeenCalledWith(
      {},
      "error message",
    );

    logger.fatal("fatal message");
    expect(mockPinoLogger.fatal).toHaveBeenCalledWith(
      {},
      "fatal message",
    );
  });

  it("should log extra arguments", () => {
    logger.info("message", "argument1", "argument2");
    expect(mockPinoLogger.info).toHaveBeenCalledWith(
      { args: ["argument1", "argument2"] },
      "message",
    );
  });

  it("should handle errors properly", () => {
    const error = new Error("Test error");
    logger.error(error);
    expect(mockPinoLogger.error).toHaveBeenCalledWith(
      { err: error },
      "Test error",
    );

    logger.error(error, "context");
    expect(mockPinoLogger.error).toHaveBeenCalledWith(
      { err: error, args: ["context"] },
      "Test error",
    );
  });
});
