import { Container } from "../container/Container.ts";

/**
 * Base class for all service providers
 */
export abstract class Provider {
  /**
   * Register services in the container
   */
  public abstract register(container: Container): void;

  /**
   * Bootstrap the provider (runs after all providers are registered)
   */
  public abstract boot(container: Container): Promise<void>;
}
