import { config } from "./config.ts";
import { Container } from "./container/Container.js";
import { Provider } from "./providers/Provider.ts";

export class Application {
  /**
   * The application's dependency injection container.
   */
  private container: Container;

  /**
   * The service providers that have been registered.
   */
  private providers: Provider[] = [];

  /**
   * Create a new application instance.
   */
  constructor() {
    this.container = new Container();
  }

  /**
   * Register service providers defined in the config.
   */
  private registerProviders(): void {
    for (const ProviderClass of config.get("providers")) {
      const provider = new ProviderClass();

      // Register the provider's services with the container
      provider.register(this.container);

      // Add the provider to the providers array
      this.providers.push(provider);
    }
  }

  /**
   * Boot all of the registered providers.
   */
  private async bootProviders(): Promise<void> {
    for (const provider of this.providers) {
      await provider.boot(this.container);
    }
  }

  /**
   * Run the application.
   */
  public async run(): Promise<void> {
    // Register service providers defined in the config
    this.registerProviders();

    // Boot all registered service providers
    await this.bootProviders();
  }
}
