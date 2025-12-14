/**
 * Environment configuration module
 * Provides safe access to Vite environment variables
 * Note: In Jest tests, this module is mocked in setupTests.ts
 */

export const getEnv = (key: string, defaultValue: string = ""): string => {
  // @ts-ignore - import.meta is not available in Jest, but this file is mocked in tests
  return import.meta.env[key] || defaultValue;
};

export const API_BASE_URL = getEnv(
  "VITE_API_BASE_URL",
  "http://localhost:3000"
);
