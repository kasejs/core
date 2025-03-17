import { Logger } from "./logger.ts";

import { pino } from "pino";

/**
 * Logger implementation using Pino.
 */
export class PinoLogger extends Logger {
  private logger: pino.Logger;

  constructor(options?: pino.LoggerOptions) {
    super();
    this.logger = pino(options);
  }

  trace(message: string, ...args: any[]): void {
    this.logger.trace(args.length ? { args } : {}, message);
  }

  debug(message: string, ...args: any[]): void {
    this.logger.debug(args.length ? { args } : {}, message);
  }

  info(message: string, ...args: any[]): void {
    this.logger.info(args.length ? { args } : {}, message);
  }

  warn(message: string, ...args: any[]): void {
    this.logger.warn(args.length ? { args } : {}, message);
  }

  error(message: string | Error, ...args: any[]): void {
    if (message instanceof Error) {
      this.logger.error(
        { err: message, args: args.length ? args : undefined },
        message.message,
      );
    } else {
      this.logger.error(args.length ? { args } : {}, message);
    }
  }

  fatal(message: string | Error, ...args: any[]): void {
    if (message instanceof Error) {
      this.logger.fatal(
        { err: message, args: args.length ? args : undefined },
        message.message,
      );
    } else {
      this.logger.fatal(args.length ? { args } : {}, message);
    }
  }
}
