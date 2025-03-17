import { configure } from "./config/index.ts";
import { LoggerProvider } from "./providers/LoggerProvider.ts";

export {
  env,
  config,
  configure,
  type Configuration,
} from "./config/index.ts";

/**
 * Global configuration initialization.
 *
 * The `config` object will be available globally in service providers
 *  and will have automatic suggestions by the IDE when using the
 * `config.get("path.to.property")` method.
 */
configure({
  providers: [
    /**
     * Core providers
     */
    LoggerProvider,
  ],
});
