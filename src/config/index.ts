import { Provider } from "../providers/Provider.ts";
import { Configuration } from "./types.ts";

export { env } from "./env.ts";
export type { Configuration } from "./types.ts";

// Private config data
let configData: Record<string, any> = {};

// Simple deep merge function
function deepMerge<T extends Record<string, any>>(
  target: T,
  source: Record<string, any>,
): T {
  const result = { ...target } as Record<string, any>;

  for (const key in source) {
    const targetValue = result[key];
    const sourceValue = source[key];

    if (
      sourceValue &&
      typeof sourceValue === "object" &&
      !Array.isArray(sourceValue) &&
      targetValue &&
      typeof targetValue === "object"
    ) {
      result[key] = deepMerge(targetValue, sourceValue);
    } else if (sourceValue !== undefined) {
      result[key] = sourceValue;
    }
  }

  return result as T;
}

// Public config object
const config = {
  get<T>(path: string, defaultValue?: T): T {
    if (Object.keys(configData).length === 0) {
      throw new Error(
        "Config not initialized. Call 'configure' first.",
      );
    }

    const value = path.split(".").reduce((obj: any, key: string) => {
      return obj && obj[key] !== undefined ? obj[key] : undefined;
    }, configData);

    return value !== undefined ? value : (defaultValue as T);
  },
};

// Creates global config from provider defaults and explicit overrides
function configure<T extends Record<string, any>>(
  configInput: Partial<Configuration & T>,
): void {
  // Get and instantiate providers
  const providerClasses = (configInput.providers || []) as Array<
    new () => Provider
  >;

  const providers = providerClasses
    .filter(
      (ProviderClass: any): ProviderClass is new () => Provider =>
        typeof ProviderClass === "function",
    )
    .map((ProviderClass: new () => Provider) => new ProviderClass());

  // Collect provider configs
  const providerConfig = providers.reduce(
    (acc: Record<string, any>, provider: Provider) => {
      if (typeof (provider as any).config === "function") {
        return deepMerge(acc, (provider as any).config());
      }
      return acc;
    },
    {} as Record<string, any>,
  );

  // Merge configs with priority to explicit settings
  configData = deepMerge(providerConfig, configInput);
}

// Export public API
export { config, configure };
