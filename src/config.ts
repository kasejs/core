import { createConfig } from "./config/index.ts";
import { LoggerProvider } from "./providers/LoggerProvider.ts";

export { config, env } from "./config/index.ts";

/**
 * Here we are initializing the global config
 * with the core providers such as logger.
 *
 * The `config` object will be available globally and will
 * be automatically suggested by the IDE when using the
 * `config.get("path.to.property")` method.
 *
 * This can be redefined in the application that uses
 * this package to extend the core config with more
 * properties.
 */
createConfig({
  providers: [
    // Core providers
    LoggerProvider,
  ],
});
