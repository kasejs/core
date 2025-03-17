import { Configuration } from "../config/types.ts";
import { Container } from "../container/index.ts";

/**
 * Base class for all service providers
 */
export abstract class Provider {
  /**
   * Get provider's default configuration
   */
  public abstract config(): Partial<Record<keyof Configuration, any>>;

  /**
   * Register services in the container
   */
  public abstract register(container: Container): void;

  /**
   * Bootstrap the provider (runs after all providers are registered)
   */
  public abstract boot(container: Container): Promise<void>;
}
