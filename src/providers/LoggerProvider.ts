import { log } from "../config/log.ts";
import { Container } from "../container/Container.ts";
import { Logger, PinoLogger } from "../services/logger/index.ts";
import { Provider } from "./Provider.ts";

import { pino } from "pino";

/**
 * Configuration for the logger provider
 */
export interface LoggerConfig {
  level?: pino.LevelWithSilent;
  transport?: pino.TransportSingleOptions;
}

/**
 * Provider for the logger service
 */
export class LoggerProvider extends Provider {
  constructor(private config: LoggerConfig = {}) {
    super();

    this.config.level = log.level as pino.LevelWithSilent;
    this.config.transport =
      log.format === "pretty"
        ? {
            target: "pino-pretty",
          }
        : undefined;
  }

  /**
   * Register the logger service in the container
   */
  public register(container: Container): void {
    container.bind(Logger).to(
      new PinoLogger({
        level: this.config.level || "info",
        transport: this.config.transport,
      }),
    );
  }

  public async boot(container: Container): Promise<void> {
    //
  }
}
