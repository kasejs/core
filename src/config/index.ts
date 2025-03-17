import { Provider } from "../providers/Provider.ts";
import {
  CoreConfig,
  PathsToStringProps,
  TypeFromPath,
} from "./types.ts";

export { env } from "./env.ts";

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
  constructor(private config: CoreConfig & T) {}

  // Get config value at path with optional default
  get<P extends PathsToStringProps<CoreConfig & T>>(
    path: P,
    defaultValue?: TypeFromPath<CoreConfig & T, P>,
  ): TypeFromPath<CoreConfig & T, P> {
    const value = path.split(".").reduce((obj: any, key: string) => {
      return obj && obj[key] !== undefined ? obj[key] : undefined;
    }, this.config as any);

    return value !== undefined
      ? value
      : (defaultValue as TypeFromPath<CoreConfig & T, P>);
  }
}

// Global config instance
let configInstance: ConfigProvider<any>;

// Create a type for our config object
export type Config = {
  get<P extends PathsToStringProps<CoreConfig>>(
    path: P,
    defaultValue?: TypeFromPath<CoreConfig, P>,
  ): TypeFromPath<CoreConfig, P>;
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
export function createConfig<T extends Record<string, any>>(
  config: Partial<CoreConfig & T>,
): ConfigProvider<T> {
  // Get providers
  const providerClasses = (config.providers || []) as Array<
    new () => Provider
  >;

  // Instantiate providers
  const providers = providerClasses.map(
    (ProviderClass: new () => Provider) => new ProviderClass(),
  );

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
    providerConfigs as CoreConfig & T,
    config as Record<string, any>,
  ) as CoreConfig & T;

  // Create and store config
  configInstance = new ConfigProvider<T>(mergedConfig);

  return configInstance;
}
