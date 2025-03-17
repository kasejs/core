import dotenv from "dotenv";

dotenv.config();

/**
 * Gets type-safe environment variable with fallback
 */
export function env<T>(key: string, defaultValue: T): T {
  const value = process.env[key];

  if (value === undefined) {
    return defaultValue;
  }

  // Convert to appropriate type
  if (typeof defaultValue === "number") {
    return Number(value) as unknown as T;
  } else if (typeof defaultValue === "boolean") {
    const normalizedValue = value.toLowerCase();
    if (["true", "t", "1", "yes", "y"].includes(normalizedValue)) {
      return true as unknown as T;
    } else if (
      ["false", "f", "0", "no", "n"].includes(normalizedValue)
    ) {
      return false as unknown as T;
    } else {
      return defaultValue;
    }
  } else {
    return value as unknown as T;
  }
}
