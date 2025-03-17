import { config, env } from "../config.ts";
import { Container } from "../container/index.ts";
import { Logger, PinoLogger } from "../services/logger/index.ts";
import { Provider } from "./Provider.ts";

import { pino } from "pino";

/**
 * Here we are extending the core config with new properties
 * that will be available to the config instance and will be
 * automatically suggested by the IDE when using the
 * `config.get("path.to.property")` method.
 */
declare module "../config/types.ts" {
  interface Configuration {
    log: {
      level: pino.LevelWithSilent;
      format: "json" | "pretty";
    };
  }
}

/**
 * Provider for the logger service
 */
export class LoggerProvider extends Provider {
  /**
   * Get default logger configuration
   */
  public config() {
    return {
      log: {
        level: env<string>("LOG_LEVEL", "info"),
        format: env<string>("LOG_FORMAT", "pretty"),
      },
    };
  }

  /**
   * Register the logger service in the container
   */
  public register(container: Container) {
    const transport =
      config.get("log.format") === "pretty"
        ? { target: "pino-pretty" as const }
        : undefined;

    container.bind(Logger).to(
      new PinoLogger({
        level: config.get("log.level"),
        transport,
        formatters: {
          level(label: string) {
            return { level: label };
          },
        },
      }),
    );
  }

  public async boot(container: Container) {
    // You can put any boot logic that should be executed
    // after all services have been registered.
    const logger = container.get(Logger);
    logger.info("LoggerProvider booted");
  }
}
