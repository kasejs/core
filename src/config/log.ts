import { env } from "../env.ts";

export const log = {
  level: env<string>("LOG_LEVEL", "info"),
  format: env<string>("LOG_FORMAT", "logfmt"),
};
