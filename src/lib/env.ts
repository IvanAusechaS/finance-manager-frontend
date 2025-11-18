/**
 * Environment configuration module
 * Provides safe access to Vite environment variables
 */

export const getEnv = (key: string, defaultValue: string = ""): string => {
  // In Vite runtime, import.meta.env is available
  // In Jest tests, this file will be mocked
  return import.meta.env[key] || defaultValue;
};

export const API_BASE_URL = getEnv(
  "VITE_API_BASE_URL",
  "http://localhost:3000"
);
