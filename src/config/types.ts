import { Provider } from "../providers/Provider.ts";

// Filter type to exclude functions for better autocomplete
type ExcludeFunctions<T> = {
  [K in keyof T as T[K] extends Function ? never : K]: T[K];
};

// Only keep numeric indices for array autocomplete (no length property)
// but include iterator for for...of loops
export type CleanArray<T> = {
  [n: number]: T;
  [Symbol.iterator]: () => IterableIterator<T>;
};

// Base config that only includes core functionality
export interface Configuration {
  providers: (new () => Provider)[];
}

// Type utility for dot notation paths
type Primitive =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | undefined
  | null;
type Builtin = Primitive | Function | Date | Error | RegExp;

// Type for dot notation paths - improved to filter out function properties
export type PathsToStringProps<T> = T extends Builtin
  ? never
  : T extends any[]
    ? // For arrays, only allow numeric indices, no methods or length
      `${number}`
    : T extends object
      ? {
          // Only include non-function keys
          [K in keyof ExcludeFunctions<T> &
            (string | number)]: K extends string
            ?
                | `${K}`
                | (T[K] extends object
                    ? `${K}.${PathsToStringProps<T[K]>}`
                    : never)
            : never;
        }[keyof ExcludeFunctions<T> & (string | number)]
      : never;

// Type inference for path resolution
export type TypeFromPath<
  T,
  Path extends string,
> = Path extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? TypeFromPath<T[Key], Rest>
    : never
  : Path extends keyof T
    ? T[Path] extends any[]
      ? CleanArray<T[Path] extends (infer U)[] ? U : never>
      : T[Path]
    : never;
