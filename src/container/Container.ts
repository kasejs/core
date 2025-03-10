import {
  Container as BaseContainer,
  inject as injectFunction,
} from "@needle-di/core";

/**
 * Use this function to inject dependencies into a class constructor.
 *
 * @example
 * ```ts
 * class Service {
 *   constructor(private logger = inject(LoggerContract)) {}
 * }
 * ```
 */
export const inject = injectFunction;

/**
 * Type for a class constructor
 */
export type Class<T> = new (...args: any[]) => T;

/**
 * Type for an abstract class
 */
export type AbstractClass<T> = {
  prototype: T;
  name: string;
};

/**
 * Type for a factory function
 */
export type Factory<T> = () => T;

/**
 * Target can be either an instance,
 * a class constructor, or a factory function.
 */
export type Target<T> = T | Class<T> | Factory<T>;

/**
 * Interface for the binding builder which allows fluent API.
 */
export interface BindingBuilder<T> {
  /**
   * Binds a type to a specific implementation.
   * @param target The class constructor, instance, or factory function to bind to
   */
  to(target: Target<T>): void;
}

/**
 * The dependency injection container.
 *
 * @example
 * ```ts
 * // Define a contract for the logger
 * abstract class LoggerContract {
 *   abstract log(message: string): void;
 * }
 *
 * // Implement the contract
 * class ConsoleLogger extends LoggerContract {
 *   log(message: string) {
 *     console.log(message);
 *   }
 * }
 *
 * // Create a container
 * const container = new Container();
 *
 * // Bind the contract to the implementation
 * container.bind(LoggerContract).to(ConsoleLogger);
 *
 * // Resolve the instance from the container
 * const logger = container.get(LoggerContract);
 *
 * // Use the resolved instance
 * logger.log("Hello, world!");
 * ```
 */
export class Container {
  private container = new BaseContainer();

  /**
   * Start binding a type to an implementation using a fluent API.
   * @param type The type to bind, usually an abstract class.
   * @returns A binding builder.
   */
  public bind<T>(
    type: AbstractClass<T> | Class<T>,
  ): BindingBuilder<T> {
    return {
      to: (target: Target<T>) => {
        if (this.container.has(type)) {
          return;
        }

        if (typeof target === "function") {
          if (target.prototype) {
            this.container.bind({
              provide: type,
              useClass: target as Class<T>,
            });
          } else {
            this.container.bind({
              provide: type,
              useFactory: target as Factory<T>,
            });
          }
        } else {
          this.container.bind({
            provide: type,
            useValue: target,
          });
        }
      },
    };
  }

  /**
   * Get an instance from the container.
   * @param type The type to resolve
   * @returns The resolved instance
   */
  public get<T>(type: AbstractClass<T> | Class<T>): T {
    // Always return the first instance.
    // This avoids the error when the class
    // is bound using @injectable() decorator.
    return this.container.get(type, { multi: true })[0];
  }
}
