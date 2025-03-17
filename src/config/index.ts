import { Provider } from "../providers/Provider.ts";
import {
  Configuration,
  PathsToStringProps,
  TypeFromPath,
} from "./types.ts";

export { env } from "./env.ts";
export type { Configuration } from "./types.ts";

// Merges source object into target, handling nested objects
function deepMerge<T extends Record<string, any>>(
  target: T,
  source: Record<string, any>,
): T {
  const result = { ...target } as T;

  Object.keys(source).forEach((key) => {
    const targetValue = result[key as keyof T];
    const sourceValue = source[key];

    if (
      typeof sourceValue === "object" &&
      sourceValue !== null &&
      !Array.isArray(sourceValue) &&
      typeof targetValue === "object" &&
      targetValue !== null
    ) {
      (result as any)[key] = deepMerge(
        targetValue as Record<string, any>,
        sourceValue,
      );
    } else if (sourceValue !== undefined) {
      (result as any)[key] = sourceValue;
    }
  });

  return result;
}

/**
 * Type-safe config provider with dot notation access
 */
export class ConfigProvider<T extends Record<string, any>> {
  constructor(private config: Configuration & T) {}

  // Get config value at path with optional default
  get<P extends PathsToStringProps<Configuration & T>>(
    path: P,
    defaultValue?: TypeFromPath<Configuration & T, P>,
  ): TypeFromPath<Configuration & T, P> {
    const value = path.split(".").reduce((obj: any, key: string) => {
      return obj && obj[key] !== undefined ? obj[key] : undefined;
    }, this.config as any);

    return value !== undefined
      ? value
      : (defaultValue as TypeFromPath<Configuration & T, P>);
  }
}

// Global config instance
let configInstance: ConfigProvider<any>;

// Create a type for our config object
export type Config = {
  get<P extends PathsToStringProps<Configuration>>(
    path: P,
    defaultValue?: TypeFromPath<Configuration, P>,
  ): TypeFromPath<Configuration, P>;
};

// Create a proxy that forwards calls to the config instance
export const config: Config = new Proxy({} as Config, {
  get(target, prop) {
    if (!configInstance) {
      throw new Error(
        "Config not initialized. Call createConfig first.",
      );
    }

    return configInstance[prop as keyof typeof configInstance];
  },
});

/**
 * Creates global config from provider defaults and explicit overrides
 */
export function configure<T extends Record<string, any>>(
  config: Partial<Configuration & T>,
): ConfigProvider<T> {
  // Get providers
  const providerClasses = (config.providers || []) as Array<
    new () => Provider
  >;

  // Instantiate providers
  const providers = providerClasses
    .filter(
      (ProviderClass): ProviderClass is new () => Provider =>
        typeof ProviderClass === "function",
    )
    .map((ProviderClass) => new ProviderClass());

  // Collect provider configs
  const providerConfigs = providers.reduce(
    (acc: Record<string, any>, provider: Provider) => {
      if (typeof (provider as any).config === "function") {
        return deepMerge(acc, (provider as any).config());
      }
      return acc;
    },
    {} as Record<string, any>,
  );

  // Merge configs with priority to explicit settings
  const mergedConfig = deepMerge(
    providerConfigs as Configuration & T,
    config as Record<string, any>,
  ) as Configuration & T;

  // Create and store config
  configInstance = new ConfigProvider<T>(mergedConfig);

  return configInstance;
}
