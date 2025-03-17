import { Provider } from "../providers/provider.ts";

// Base config that only includes core functionality
export interface Configuration {
  providers: (new () => Provider)[];
}
