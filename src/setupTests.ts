// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Polyfills for jsdom environment
import { TextEncoder, TextDecoder } from "node:util";

globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder as typeof globalThis.TextDecoder;

// Mock the env module to avoid import.meta issues in Jest
jest.mock("./lib/env", () => ({
  getEnv: (key: string, defaultValue: string = ""): string => {
    const mockEnv: Record<string, string> = {
      VITE_API_BASE_URL: "http://localhost:3000",
    };
    return mockEnv[key] || defaultValue;
  },
  API_BASE_URL: "http://localhost:3000",
}));
