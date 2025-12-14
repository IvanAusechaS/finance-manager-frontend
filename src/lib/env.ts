/**
 * Environment configuration module
 * Provides safe access to Vite environment variables
 */

export const getEnv = (key: string, defaultValue: string = ""): string => {
  // Use eval to avoid TypeScript compilation issues with import.meta in Jest
  try {
    // eslint-disable-next-line no-eval
    const importMeta = eval("import.meta");
    return importMeta?.env?.[key] || defaultValue;
  } catch {
    // Fallback for test environment or when import.meta is not available
    return defaultValue;
  }
};

export const API_BASE_URL = getEnv(
  "VITE_API_BASE_URL",
  "http://localhost:3000"
);
