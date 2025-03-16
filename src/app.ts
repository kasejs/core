import { Container } from "./container/Container.ts";

export class Application {
  /**
   * The application's dependency injection container.
   */
  private container: Container;

  /**
   * Create a new application instance.
   */
  constructor() {
    this.container = new Container();
  }

  /**
   * Run the application.
   */
  public async run(): Promise<void> {
    // TODO: Bootstrap the application
  }
}
