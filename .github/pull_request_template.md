## 📋 Description

<!-- Provide a brief description of the changes in this PR -->

## 🎯 Related Issue

<!-- Link to the related issue (e.g., Closes #123, Fixes #456) -->

Closes #

## 🚀 Type of Change

<!-- Mark the relevant option with an "x" -->

- [ ] 🐛 Bug fix (non-breaking change that fixes an issue)
- [ ] ✨ New feature (non-breaking change that adds functionality)
- [ ] 💥 Breaking change (fix or feature that causes existing functionality to not work as expected)
- [ ] 📝 Documentation update
- [ ] 🎨 Style/UI update (changes that don't affect functionality)
- [ ] ♻️ Code refactoring (no functional changes)
- [ ] ⚡ Performance improvement
- [ ] ✅ Test updates

## 📸 Screenshots

<!-- If applicable, add screenshots to help explain your changes -->

## ✅ Acceptance Criteria Checklist

### HU10 - Sign-up básico (US-1)
- [ ] Nombres: Validación solo letras, mínimo 2 caracteres
- [ ] Apellidos: Validación solo letras, mínimo 2 caracteres
- [ ] Edad: Validación ≥ 13 años
- [ ] Email: Formato RFC 5322
- [ ] Contraseña: ≥ 8 caracteres, mayúscula, minúscula, número, carácter especial
- [ ] Confirmar contraseña: Debe coincidir
- [ ] Validación en tiempo real de todos los campos
- [ ] Mensaje de éxito al registrarse

### HU11 - Login / Logout (US-2)
- [ ] Email: Formato RFC 5322
- [ ] Contraseña: Campo requerido
- [ ] Mensaje de error para credenciales inválidas
- [ ] Redirección a dashboard tras login exitoso
- [ ] Funcionalidad de logout operativa

### HU12 - Recuperar contraseña (US-3)
- [ ] Solicitud de recuperación con email válido
- [ ] Mensaje confirmando envío de correo
- [ ] Token de recuperación válido por 1 hora
- [ ] Formulario de restablecimiento con nueva contraseña
- [ ] Validación de contraseña en reset (mismos criterios que signup)
- [ ] Confirmación de contraseña restablecida

## 🧪 Testing

<!-- Describe the tests you ran and how to reproduce them -->

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] All tests pass locally (`npm test`)
- [ ] No TypeScript errors (`npm run lint`)
- [ ] Build completes successfully (`npm run build`)

## 📋 Code Quality Checklist

- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings or errors
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published

## 🔒 Security Checklist

- [ ] No sensitive data (passwords, tokens, API keys) exposed
- [ ] Input validation implemented for all user inputs
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] Authentication/Authorization properly implemented
- [ ] HTTPS enforced for production

## 📝 Additional Notes

<!-- Add any additional context, notes, or considerations for reviewers -->

## 👥 Reviewers

<!-- @mention the team members who should review this PR -->

/cc @reviewers

---

**By submitting this pull request, I confirm that:**
- [ ] I have read and understood the contributing guidelines
- [ ] My code is ready for review and meets all acceptance criteria
- [ ] I am prepared to make changes based on code review feedback
