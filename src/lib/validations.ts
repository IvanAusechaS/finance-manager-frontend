/**
 * Validation utilities for form inputs
 */

export const validateEmail = (email: string): string | null => {
  if (!email) {
    return "El email es requerido";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Email inválido";
  }
  return null;
};

export const validateRequired = (value: string, fieldName: string = "Este campo"): string | null => {
  if (!value || value.trim() === "") {
    return `${fieldName} es requerido`;
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return "La contraseña es requerida";
  }
  if (password.length < 6) {
    return "La contraseña debe tener al menos 6 caracteres";
  }
  return null;
};

export const validatePasswordMatch = (password: string, confirmPassword: string): string | null => {
  if (password !== confirmPassword) {
    return "Las contraseñas no coinciden";
  }
  return null;
};

export const validateNickname = (nickname: string): string | null => {
  if (!nickname) {
    return "El nombre de usuario es requerido";
  }
  if (nickname.length < 3) {
    return "El nombre de usuario debe tener al menos 3 caracteres";
  }
  return null;
};

// Alias for compatibility
export const validateName = validateNickname;

export const getPasswordErrors = (password: string): string[] => {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push("Debe tener al menos 6 caracteres");
  }
  
  return errors;
};
