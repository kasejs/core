import dotenv from "dotenv";

dotenv.config();

/**
 * Utility function to read environment variables with type safety
 * @param key The environment variable key
 * @param defaultValue Default value to use if environment variable is not set
 * @returns The environment variable value cast to type T, or the default value
 */
export function env<T>(key: string, defaultValue: T): T {
  const value = process.env[key];

  if (value === undefined) {
    return defaultValue;
  }

  // Handle different types based on the default value
  if (typeof defaultValue === "number") {
    return Number(value) as unknown as T;
  } else if (typeof defaultValue === "boolean") {
    // Handle various boolean formats
    const normalizedValue = value.toLowerCase();
    if (["true", "t", "1", "yes", "y"].includes(normalizedValue)) {
      return true as unknown as T;
    } else if (
      ["false", "f", "0", "no", "n"].includes(normalizedValue)
    ) {
      return false as unknown as T;
    } else {
      // If the value doesn't match any known boolean format, return the default
      return defaultValue;
    }
  } else {
    return value as unknown as T;
  }
}
