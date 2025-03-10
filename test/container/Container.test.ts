import { Container, inject } from "../../src/container/index.ts";

import { describe, expect, it } from "vitest";

abstract class TestServiceContract {
  abstract increment(): void;
  abstract getCount(): number;
}

class TestService extends TestServiceContract {
  private count = 0;

  public increment() {
    this.count++;
  }
  public getCount() {
    return this.count;
  }
}

describe("Container", () => {
  it("should bind constructor", () => {
    const container = new Container();

    container.bind(TestServiceContract).to(TestService);

    const instance = container.get(TestServiceContract);

    instance.increment();

    expect(instance).toBeInstanceOf(TestService);
    expect(instance.getCount()).toBe(1);
  });

  it("should bind instance", () => {
    const container = new Container();

    container.bind(TestServiceContract).to(new TestService());

    const instance = container.get(TestServiceContract);

    instance.increment();

    expect(instance).toBeInstanceOf(TestService);
    expect(instance.getCount()).toBe(1);
  });

  it("should bind factory", () => {
    const container = new Container();

    container.bind(TestServiceContract).to(() => new TestService());

    const instance = container.get(TestServiceContract);

    instance.increment();

    expect(instance).toBeInstanceOf(TestService);
    expect(instance.getCount()).toBe(1);
  });

  it("should resolve with dependencies", () => {
    abstract class LoggerContract {
      abstract log(message: string): void;
    }

    class ConsoleLogger extends LoggerContract {
      log(message: string) {
        console.log(message);
      }
    }

    abstract class ServiceContract {
      abstract log(message: string): void;
    }

    class Service extends ServiceContract {
      constructor(private logger = inject(LoggerContract)) {
        super();
      }

      log(message: string) {
        this.logger.log(message);
      }
    }

    const container = new Container();

    container.bind(LoggerContract).to(ConsoleLogger);
    container.bind(ServiceContract).to(Service);

    const instance = container.get(ServiceContract);

    instance.log("Hello, world!");

    expect(console.log).toHaveBeenCalledWith("Hello, world!");
  });
});
