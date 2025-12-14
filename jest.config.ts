import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/src/__mocks__/fileMock.ts",
    "^@/(.*)$": "<rootDir>/src/$1",
    "^.*/lib/env$": "<rootDir>/src/__mocks__/env.ts",
    "\\./lib/env$": "<rootDir>/src/__mocks__/env.ts",
    "^.*/env$": "<rootDir>/src/__mocks__/env.ts",
  },
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/main.tsx", // Exclude entry point
    "!src/vite-env.d.ts", // Exclude Vite types
    "!src/**/*.d.ts", // Exclude type definitions
    "!src/**/__mocks__/**", // Exclude mocks
    "!src/**/*.test.{ts,tsx}", // Exclude test files
    "!src/**/*.spec.{ts,tsx}", // Exclude spec files
    "!src/lib/env.ts", // Exclude env file (uses import.meta)
  ],
  coverageReporters: ["text", "lcov", "html"],
  coverageDirectory: "coverage",
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  testMatch: ["**/__tests__/**/*.{ts,tsx}", "**/*.{test,spec}.{ts,tsx}"],
  transformIgnorePatterns: [
    "node_modules/",
    "src/lib/env\\.ts$" // Don't transform env.ts - it will be mocked
  ],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "./tsconfig.test.json",
      },
    ],
  },
};

export default config;
