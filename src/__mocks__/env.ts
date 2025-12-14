/**
 * Mock for env.ts module in Jest tests
 * This allows tests to run without Vite's import.meta.env
 */

export const getEnv = (key: string, defaultValue: string = ""): string => {
  // Mock environment variables for tests
  const mockEnv: Record<string, string> = {
    VITE_API_BASE_URL: "http://localhost:3000",
  };

  return mockEnv[key] || defaultValue;
};

export const API_BASE_URL = getEnv(
  "VITE_API_BASE_URL",
  "http://localhost:3000"
);
