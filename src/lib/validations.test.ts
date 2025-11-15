import { describe, it, expect } from "vitest";
import {
  validateEmail,
  validatePassword,
  validateAge,
  validateName,
  validateRequired,
  getPasswordErrors,
} from "../lib/validations";

describe("Validation Functions - Acceptance Criteria", () => {
  describe("validateEmail - HU10, HU11, HU12", () => {
    it("should accept valid email formats (RFC 5322)", () => {
      expect(validateEmail("user@example.com")).toBe(true);
      expect(validateEmail("test.user@domain.co")).toBe(true);
      expect(validateEmail("user+tag@example.com")).toBe(true);
      expect(validateEmail("user_name@domain.com")).toBe(true);
    });

    it("should reject invalid email formats", () => {
      expect(validateEmail("invalid")).toBe(false);
      expect(validateEmail("@example.com")).toBe(false);
      expect(validateEmail("user@")).toBe(false);
      expect(validateEmail("user @example.com")).toBe(false);
      expect(validateEmail("")).toBe(false);
    });

    it("should reject empty or whitespace-only emails", () => {
      expect(validateEmail("")).toBe(false);
      expect(validateEmail("   ")).toBe(false);
    });
  });

  describe("validatePassword - HU10 Acceptance Criteria", () => {
    it("should require minimum 8 characters", () => {
      expect(validatePassword("Short1!")).toBe(false);
      expect(validatePassword("Valid123!")).toBe(true);
    });

    it("should require at least one uppercase letter", () => {
      expect(validatePassword("nouppercase123!")).toBe(false);
      expect(validatePassword("Uppercase123!")).toBe(true);
    });

    it("should require at least one lowercase letter", () => {
      expect(validatePassword("NOLOWERCASE123!")).toBe(false);
      expect(validatePassword("Lowercase123!")).toBe(true);
    });

    it("should require at least one number", () => {
      expect(validatePassword("NoNumber!")).toBe(false);
      expect(validatePassword("WithNumber1!")).toBe(true);
    });

    it("should require at least one special character", () => {
      expect(validatePassword("NoSpecial123")).toBe(false);
      expect(validatePassword("WithSpecial123!")).toBe(true);
    });

    it("should accept password meeting all requirements", () => {
      expect(validatePassword("MyP@ssw0rd")).toBe(true);
      expect(validatePassword("Valid123!")).toBe(true);
      expect(validatePassword("Str0ng#Pass")).toBe(true);
    });
  });

  describe("getPasswordErrors - HU10 Real-time Validation", () => {
    it("should return all errors for weak password", () => {
      const errors = getPasswordErrors("weak");
      expect(errors).toContain("Mínimo 8 caracteres");
      expect(errors).toContain("Al menos una mayúscula");
      expect(errors).toContain("Al menos un número");
      expect(errors).toContain("Al menos un carácter especial");
    });

    it("should return no errors for strong password", () => {
      const errors = getPasswordErrors("Strong123!");
      expect(errors).toHaveLength(0);
    });

    it("should return specific missing requirement", () => {
      const errors = getPasswordErrors("NoNumber!");
      expect(errors).toContain("Al menos un número");
    });
  });

  describe("validateAge - HU10 Acceptance Criteria", () => {
    it("should require minimum age of 13 years", () => {
      expect(validateAge("12")).toBe(false);
      expect(validateAge("13")).toBe(true);
      expect(validateAge("25")).toBe(true);
    });

    it("should reject invalid age formats", () => {
      expect(validateAge("abc")).toBe(false);
      expect(validateAge("-5")).toBe(false);
      expect(validateAge("0")).toBe(false);
    });

    it("should reject empty age", () => {
      expect(validateAge("")).toBe(false);
    });

    it("should accept reasonable age range", () => {
      expect(validateAge("18")).toBe(true);
      expect(validateAge("65")).toBe(true);
      expect(validateAge("100")).toBe(true);
    });
  });

  describe("validateName - HU10 Acceptance Criteria", () => {
    it("should require minimum 2 characters", () => {
      expect(validateName("A")).toBe(false);
      expect(validateName("Jo")).toBe(true);
      expect(validateName("John")).toBe(true);
    });

    it("should only accept letters", () => {
      expect(validateName("John123")).toBe(false);
      expect(validateName("John!")).toBe(false);
      expect(validateName("John")).toBe(true);
    });

    it("should accept accented characters (Spanish names)", () => {
      expect(validateName("José")).toBe(true);
      expect(validateName("María")).toBe(true);
      expect(validateName("Ñoño")).toBe(true);
    });

    it("should accept names with spaces", () => {
      expect(validateName("Juan Carlos")).toBe(true);
      expect(validateName("Ana María")).toBe(true);
    });

    it("should reject empty names", () => {
      expect(validateName("")).toBe(false);
      expect(validateName("   ")).toBe(false);
    });
  });

  describe("validateRequired - Generic Required Field", () => {
    it("should reject empty values", () => {
      expect(validateRequired("")).toBe(false);
      expect(validateRequired("   ")).toBe(false);
    });

    it("should accept non-empty values", () => {
      expect(validateRequired("value")).toBe(true);
      expect(validateRequired("  value  ")).toBe(true);
    });
  });

  describe("Integration Tests - Complete Form Validation", () => {
    it("should validate complete signup form data (HU10)", () => {
      const validSignupData = {
        firstName: "Juan",
        lastName: "Pérez",
        age: "25",
        email: "juan.perez@example.com",
        password: "SecureP@ss123",
        confirmPassword: "SecureP@ss123",
      };

      expect(validateName(validSignupData.firstName)).toBe(true);
      expect(validateName(validSignupData.lastName)).toBe(true);
      expect(validateAge(validSignupData.age)).toBe(true);
      expect(validateEmail(validSignupData.email)).toBe(true);
      expect(validatePassword(validSignupData.password)).toBe(true);
      expect(validSignupData.password === validSignupData.confirmPassword).toBe(true);
    });

    it("should validate complete login form data (HU11)", () => {
      const validLoginData = {
        email: "user@example.com",
        password: "ValidPass123!",
      };

      expect(validateEmail(validLoginData.email)).toBe(true);
      expect(validateRequired(validLoginData.password)).toBe(true);
    });

    it("should validate password recovery form data (HU12)", () => {
      const validRecoveryData = {
        email: "user@example.com",
      };

      expect(validateEmail(validRecoveryData.email)).toBe(true);
    });
  });
});
