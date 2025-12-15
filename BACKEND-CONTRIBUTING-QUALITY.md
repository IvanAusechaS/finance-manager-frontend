# Contribución y Calidad de Código - Backend

## 📋 Checklist Obligatorio Antes de Push/PR

Antes de hacer **push** o abrir un **Pull Request**, cada integrante **DEBE** ejecutar:

### 1. ✅ Verificar Linting
```bash
npm run lint
```
- Corrige **todos** los errores de ESLint.
- No se permiten warnings en el código a mergear.
- Usa `npm run lint:fix` para correcciones automáticas.

### 2. ✅ Ejecutar Tests con Cobertura
```bash
npm run test:coverage
```
- Verifica que **todos los tests pasen**.
- Confirma que se genera el archivo `coverage/lcov.info`.
- Revisa el reporte de cobertura en terminal.

### 3. ✅ Compilar el Proyecto
```bash
npm run build
```
- Confirma que el proyecto compila sin errores TypeScript.
- Verifica que se genera la carpeta `dist/` correctamente.

### 4. ✅ Validar Cobertura Mínima
- **Cobertura en nuevo código: ≥ 80%**
- Verifica los porcentajes en:
  - **Statements**: ≥ 80%
  - **Branches**: ≥ 80%
  - **Functions**: ≥ 80%
  - **Lines**: ≥ 80%

### 5. ✅ Quality Gate de SonarCloud
- Una vez abierto el PR, espera a que **SonarCloud** complete el análisis.
- El PR **NO** se puede mergear si:
  - ❌ Quality Gate falla
  - ❌ Cobertura en nuevo código < 80%
  - ❌ Existen code smells críticos sin resolver
  - ❌ Hay vulnerabilidades de seguridad

---

## 🧪 Configuración de Tests

### Stack de Testing
- **Jest**: Framework de testing
- **ts-jest**: TypeScript support para Jest
- **@types/jest**: Tipos de TypeScript

### Comandos Disponibles
```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch (desarrollo)
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage
```

---

## 📝 Estándares para Escribir Tests

### Tests Obligatorios por Componente

#### 1. **Controllers**
Testear:
- ✅ Respuestas exitosas (200, 201)
- ✅ Manejo de errores (400, 404, 500)
- ✅ Validación de request body
- ✅ Llamadas correctas a servicios

```typescript
describe('UserController', () => {
  it('should return users list', async () => {
    const result = await controller.getUsers(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.any(Array));
  });

  it('should handle database errors', async () => {
    service.findAll.mockRejectedValue(new Error('DB Error'));
    await controller.getUsers(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
```

#### 2. **Services**
Testear:
- ✅ Lógica de negocio
- ✅ Interacción con repositorios/modelos
- ✅ Transformación de datos
- ✅ Manejo de excepciones

```typescript
describe('UserService', () => {
  it('should create user with hashed password', async () => {
    const user = await service.create({ email, password });
    expect(user.password).not.toBe(password);
    expect(bcrypt.hash).toHaveBeenCalled();
  });

  it('should throw error if email exists', async () => {
    repository.findByEmail.mockResolvedValue(existingUser);
    await expect(service.create(data)).rejects.toThrow();
  });
});
```

#### 3. **Middlewares**
Testear:
- ✅ Llamada a `next()` cuando es exitoso
- ✅ Respuestas de error cuando falla
- ✅ Modificación de request object
- ✅ Validaciones

```typescript
describe('authMiddleware', () => {
  it('should call next() with valid token', () => {
    req.headers.authorization = 'Bearer valid-token';
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 if no token', () => {
    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});
```

#### 4. **Utils/Helpers**
Testear:
- ✅ Diferentes inputs
- ✅ Edge cases
- ✅ Valores null/undefined
- ✅ Excepciones

```typescript
describe('formatCurrency', () => {
  it('should format number as currency', () => {
    expect(formatCurrency(1000)).toBe('$1,000.00');
  });

  it('should handle zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('should handle null', () => {
    expect(formatCurrency(null)).toBe('$0.00');
  });
});
```

---

## 🔧 Mocking en Backend

### Mock de Repositorios/Modelos

```typescript
import { UserRepository } from '../repositories/userRepository';

jest.mock('../repositories/userRepository');

const mockRepository = new UserRepository() as jest.Mocked<UserRepository>;
```

### Mock de Base de Datos

```typescript
jest.mock('../database/connection', () => ({
  query: jest.fn(),
  connect: jest.fn(),
  disconnect: jest.fn(),
}));
```

### Mock de Express Request/Response

```typescript
import { Request, Response } from 'express';

const mockRequest = {
  body: {},
  params: {},
  query: {},
  headers: {},
} as Request;

const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  send: jest.fn(),
} as unknown as Response;
```

### Mock de Servicios Externos

```typescript
jest.mock('../services/emailService', () => ({
  sendEmail: jest.fn().mockResolvedValue(true),
}));
```

---

## 🚫 Archivos Excluidos de Cobertura

Los siguientes archivos están **excluidos automáticamente**:

- ✅ `src/server.ts` - Entry point del servidor
- ✅ `src/index.ts` - Entry point principal
- ✅ `src/config/**` - Archivos de configuración
- ✅ `src/database/migrations/**` - Migraciones de DB
- ✅ `**/*.d.ts` - Archivos de definición de tipos
- ✅ `**/*.test.{ts,js}` - Archivos de test
- ✅ `**/*.spec.{ts,js}` - Archivos de spec

> **Nota**: Configurar en `collectCoverageFrom` en `jest.config.ts`.

---

## 📊 Visualizar Reporte de Cobertura

Después de ejecutar `npm run test:coverage`:

```bash
# Ver reporte HTML en el navegador (Linux)
xdg-open coverage/lcov-report/index.html

# O abrir manualmente
firefox coverage/lcov-report/index.html
```

---

## 🧹 Buenas Prácticas de Testing

### ✅ DO (Hacer)
- ✅ Usar nombres descriptivos: `should return error when email is invalid`
- ✅ Testear comportamiento, no implementación
- ✅ Usar `beforeEach()` para setup común
- ✅ Limpiar mocks después de cada test
- ✅ Testear casos happy path y error paths
- ✅ Mockear dependencias externas (DB, APIs, etc.)
- ✅ Un concepto por test

### ❌ DON'T (No hacer)
- ❌ Testear librerías de terceros
- ❌ Tests que dependen de orden de ejecución
- ❌ Tests que dependen de datos reales de DB
- ❌ Tests con sleeps/timeouts
- ❌ Tests que testean múltiples cosas a la vez
- ❌ Ignorar warnings de cobertura

---

## 🔄 Workflow de Desarrollo

```bash
# 1. Crear rama feature
git checkout -b feature/new-endpoint

# 2. Desarrollar + escribir tests
# Regla: Escribir test primero (TDD recomendado)

# 3. Ejecutar tests en watch mode durante desarrollo
npm run test:watch

# 4. Antes de commit, ejecutar checklist completo:
npm run lint
npm run test:coverage
npm run build

# 5. Verificar cobertura ≥ 80%

# 6. Commit y push
git add .
git commit -m "feat: add new endpoint"
git push origin feature/new-endpoint

# 7. Crear PR
# 8. Esperar Quality Gate ✅
# 9. Mergear cuando todo esté verde
```

---

## ⚠️ Políticas de Calidad

### ❌ NO se aceptarán PRs que:
- No pasen todos los tests
- Tengan cobertura < 80% en código nuevo
- Fallen el Quality Gate de SonarCloud
- Contengan code smells críticos sin resolver
- Tengan vulnerabilidades de seguridad
- No pasen el linting

### ✅ Requerimientos para Mergear:
- ✅ Todos los tests pasan
- ✅ Cobertura ≥ 80% en código nuevo
- ✅ Linting sin errores
- ✅ Build exitoso
- ✅ Quality Gate de SonarCloud verde
- ✅ Code review aprobado por al menos 1 reviewer

---

## 🎯 Estructura de Tests Recomendada

```
backend/
├── src/
│   ├── controllers/
│   │   ├── userController.ts
│   │   └── userController.test.ts
│   ├── services/
│   │   ├── userService.ts
│   │   └── userService.test.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── auth.test.ts
│   └── utils/
│       ├── validator.ts
│       └── validator.test.ts
└── tests/
    ├── integration/
    │   └── user.integration.test.ts
    └── e2e/
        └── user.e2e.test.ts
```

---

## 📚 Recursos Adicionales

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Express.js](https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [SonarCloud Quality Gate](https://docs.sonarcloud.io/improving/quality-gates/)

---

## 🆘 Troubleshooting

### Tests fallan localmente pero pasan en CI
- Verificar versión de Node.js
- Limpiar `node_modules` y reinstalar
- Verificar variables de entorno

### Cobertura no se genera
- Verificar que `jest.config.ts` tiene `coverageReporters: ['lcov']`
- Verificar que los tests se ejecutan con `--coverage`

### SonarCloud no detecta cobertura
- Verificar que existe `coverage/lcov.info`
- Verificar `sonar.javascript.lcov.reportPaths` en `sonar-project.properties`

---

**Recuerda**: La calidad del código es responsabilidad de **todo el equipo**.  
Los tests no son opcionales, son parte integral del desarrollo.

---

## 🎓 Ejemplo Completo: CRUD de Usuario

Ver ejemplo completo en: `BACKEND-SETUP-GUIDE.md`
