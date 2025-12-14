/**
 * Validación de contraseñas según los requisitos de las HU
 * @param password - La contraseña a validar
 * @returns true si la contraseña es válida
 *
 * Requisitos:
 * - Mínimo 8 caracteres
 * - Al menos una letra mayúscula
 * - Al menos una letra minúscula
 * - Al menos un número
 * - Al menos un carácter especial
 */
export function validatePassword(password: string): boolean {
  if (password.length < 8) return false;

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
}

/**
 * Obtiene los mensajes de error específicos para una contraseña
 * @param password - La contraseña a validar
 * @returns Array de mensajes de error
 */
export function getPasswordErrors(password: string): string[] {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Mínimo 8 caracteres");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Al menos una mayúscula");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Al menos una minúscula");
  }
  if (!/\d/.test(password)) {
    errors.push("Al menos un número");
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push("Al menos un carácter especial");
  }

  return errors;
}

/**
 * Validación de correo electrónico según RFC 5322 simplificado
 * @param email - El correo a validar
 * @returns true si el correo es válido
 */
export function validateEmail(email: string): boolean {
  // Regex seguro sin riesgo de ReDoS - limitado a 254 caracteres
  if (email.length > 254) return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Validación de edad
 * @param age - La edad a validar
 * @returns true si la edad es válida (≥ 13 años)
 */
export function validateAge(age: string | number): boolean {
  const ageNum = typeof age === "string" ? Number.parseInt(age, 10) : age;
  return !Number.isNaN(ageNum) && ageNum >= 13 && ageNum <= 120;
}

/**
 * Validación de que un campo no esté vacío
 * @param value - El valor a validar
 * @returns true si el campo tiene contenido
 */
export function validateRequired(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Validación de que un campo contenga solo letras y espacios
 * @param value - El valor a validar
 * @returns true si el campo contiene solo letras
 */
export function validateName(value: string): boolean {
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
  return nameRegex.test(value) && value.trim().length >= 2;
}
