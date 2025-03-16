/**
 * This is the interface for the logger service.
 * It is used to log messages to the transport defined in the config.
 */
export abstract class Logger {
  abstract trace(message: string, ...args: any[]): void;
  abstract debug(message: string, ...args: any[]): void;
  abstract info(message: string, ...args: any[]): void;
  abstract warn(message: string, ...args: any[]): void;
  abstract error(message: string | Error, ...args: any[]): void;
  abstract fatal(message: string | Error, ...args: any[]): void;
}
