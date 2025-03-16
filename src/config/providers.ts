import { LoggerProvider } from "../providers/LoggerProvider.ts";
import { Provider } from "../providers/Provider.ts";

export type Providers = (new () => Provider)[];

export const providers: Providers = [
  // Core services
  LoggerProvider,
];
