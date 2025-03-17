import { Provider } from "../providers/Provider.ts";

// Base config that only includes core functionality
export interface Configuration {
  providers: (new () => Provider)[];
}
