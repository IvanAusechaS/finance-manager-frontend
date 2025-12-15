# Guía de Configuración CI/CD y Testing para Backend

## 📋 Blueprint basado en finance-manager-frontend

Esta guía documenta los pasos para replicar la configuración de CI/CD, SonarCloud y testing del frontend en el repositorio backend.

---

## 🎯 Objetivos

1. ✅ Configurar SonarCloud para análisis de código
2. ✅ Implementar workflows de CI/CD con GitHub Actions
3. ✅ Configurar framework de testing con cobertura ≥80%
4. ✅ Establecer Quality Gate automático
5. ✅ Documentar estándares de calidad para el equipo

---

## 🔧 Configuración de SonarCloud

### 1. Crear archivo `sonar-project.properties`

```properties
# Información del proyecto en SonarCloud
sonar.projectKey=IvanAusechaS_finance-manager-backend
sonar.organization=ivanausechas

# Nombre y versión del proyecto
sonar.projectName=finance-manager-backend
sonar.projectVersion=1.0

# Rutas del código fuente (ajustar según estructura del backend)
sonar.sources=src
sonar.tests=tests

# Exclusiones comunes para backend
sonar.exclusions=**/node_modules/**,**/dist/**,**/build/**,**/coverage/**,**/*.test.js,**/*.test.ts,**/*.spec.js,**/*.spec.ts

# Para proyectos Node.js/TypeScript
sonar.sourceEncoding=UTF-8

# Reporte de cobertura (ajustar según framework de testing)
# Para Jest:
# sonar.javascript.lcov.reportPaths=coverage/lcov.info
# Para otros frameworks, consultar documentación
```

### 2. Configurar Secrets en GitHub

Ve a: **Settings → Secrets and variables → Actions**

Agregar:
- `SONAR_TOKEN`: Token de autenticación de SonarCloud
  - Obtener en: https://sonarcloud.io/account/security

---

## 🚀 Workflows de GitHub Actions

### Archivo 1: `.github/workflows/ci-deploy.yml`

**Propósito**: CI/CD para pushes a `main`

```yaml
name: CI/CD - Deploy on main

on:
  push:
    branches:
      - main

jobs:
  build-and-test:
    name: Build and Test
    runs-on: ubuntu-latest
    steps:
      # Checkout con historial completo para SonarCloud
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      # Configurar Node.js (ajustar versión según proyecto)
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      # Instalar dependencias
      - name: Install dependencies
        if: hashFiles('package-lock.json') != ''
        run: npm ci

      # Linting
      - name: Lint
        if: hashFiles('package.json') != ''
        run: npm run lint

      # Tests con cobertura
      - name: Run tests with coverage
        if: hashFiles('package.json') != ''
        run: npm run test:coverage

      # Build
      - name: Build
        if: hashFiles('package.json') != ''
        run: npm run build

      # SonarCloud Scan
      - name: SonarCloud Scan
        if: hashFiles('package.json') != ''
        uses: SonarSource/sonarcloud-github-action@v2
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  # deploy:
  #   name: Deploy
  #   runs-on: ubuntu-latest
  #   needs: build-and-test
  #   if: needs.build-and-test.result == 'success'
  #   steps:
  #     # Agregar pasos de deployment según plataforma
  #     # (Railway, Heroku, AWS, etc.)
```

### Archivo 2: `.github/workflows/ci-pr.yml`

**Propósito**: CI para Pull Requests

```yaml
name: CI - Pull Request Checks

on:
  pull_request:
    types: [opened, synchronize, reopened]
    branches:
      - main

jobs:
  lint-and-build:
    name: Lint and Build
    runs-on: ubuntu-latest
    steps:
      - name: Checkout source
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        if: hashFiles('package-lock.json') != ''
        run: npm ci

      - name: Run linter
        if: hashFiles('package.json') != ''
        run: npm run lint

      - name: Build project
        if: hashFiles('package.json') != ''
        run: npm run build

      - name: Run unit tests with coverage
        if: hashFiles('package.json') != ''
        run: npm run test:coverage

  sonarcloud-analysis:
    name: SonarCloud Analysis
    runs-on: ubuntu-latest
    needs: [lint-and-build]
    if: ${{ github.event_name == 'pull_request' && github.base_ref == 'main' }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Check if Node.js project exists
        id: check_project
        run: |
          if [ -f "package.json" ]; then
            echo "exists=true" >> $GITHUB_OUTPUT
          else
            echo "exists=false" >> $GITHUB_OUTPUT
          fi

      - name: Setup Node.js
        if: steps.check_project.outputs.exists == 'true'
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        if: steps.check_project.outputs.exists == 'true'
        run: npm ci

      - name: Run tests to generate coverage
        if: steps.check_project.outputs.exists == 'true'
        run: npm run test:coverage

      - name: SonarCloud Scan
        if: steps.check_project.outputs.exists == 'true'
        uses: SonarSource/sonarcloud-github-action@v2
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## 🧪 Configuración de Testing

### Para Backend Node.js/TypeScript con Jest

#### 1. Instalar dependencias

```bash
npm install --save-dev jest @types/jest ts-jest ts-node
npm install --save-dev @jest/globals  # Si usas import en vez de require
```

#### 2. Crear `jest.config.ts`

```typescript
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: './tsconfig.test.json',
    }],
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/server.ts',           // Excluir entry point
    '!src/index.ts',            // Excluir entry point
    '!src/**/*.d.ts',           // Excluir definiciones de tipos
    '!src/**/__tests__/**',     // Excluir tests
    '!src/**/*.test.{ts,tsx}',  // Excluir archivos de test
    '!src/**/*.spec.{ts,tsx}',  // Excluir archivos de spec
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',  // Alias de imports
  },
};

export default config;
```

#### 3. Crear `tsconfig.test.json`

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "module": "commonjs",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "types": ["jest", "node"]
  },
  "include": [
    "src/**/*",
    "tests/**/*",
    "**/*.test.ts",
    "**/*.spec.ts"
  ]
}
```

#### 4. Actualizar `package.json`

```json
{
  "scripts": {
    "test": "jest --passWithNoTests",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage --passWithNoTests",
    "lint": "eslint src --ext .ts",
    "build": "tsc"
  }
}
```

---

## 📝 Ejemplos de Tests para Backend

### Ejemplo 1: Test de Controller

```typescript
// src/controllers/userController.test.ts
import { Request, Response } from 'express';
import { UserController } from './userController';
import { UserService } from '../services/userService';

// Mock del servicio
jest.mock('../services/userService');

describe('UserController', () => {
  let userController: UserController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockUserService: jest.Mocked<UserService>;

  beforeEach(() => {
    mockUserService = new UserService() as jest.Mocked<UserService>;
    userController = new UserController(mockUserService);
    
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  describe('getUsers', () => {
    it('should return list of users', async () => {
      const mockUsers = [{ id: 1, name: 'Test User' }];
      mockUserService.findAll.mockResolvedValue(mockUsers);

      await userController.getUsers(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.json).toHaveBeenCalledWith(mockUsers);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should handle errors', async () => {
      mockUserService.findAll.mockRejectedValue(new Error('Database error'));

      await userController.getUsers(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Database error',
      });
    });
  });
});
```

### Ejemplo 2: Test de Service

```typescript
// src/services/userService.test.ts
import { UserService } from './userService';
import { UserRepository } from '../repositories/userRepository';

jest.mock('../repositories/userRepository');

describe('UserService', () => {
  let userService: UserService;
  let mockRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepository = new UserRepository() as jest.Mocked<UserRepository>;
    userService = new UserService(mockRepository);
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: 1, name: 'User 1', email: 'user1@test.com' },
        { id: 2, name: 'User 2', email: 'user2@test.com' },
      ];
      mockRepository.findAll.mockResolvedValue(mockUsers);

      const result = await userService.findAll();

      expect(result).toEqual(mockUsers);
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const newUser = { name: 'New User', email: 'new@test.com' };
      const savedUser = { id: 1, ...newUser };
      mockRepository.create.mockResolvedValue(savedUser);

      const result = await userService.create(newUser);

      expect(result).toEqual(savedUser);
      expect(mockRepository.create).toHaveBeenCalledWith(newUser);
    });

    it('should throw error if email already exists', async () => {
      const newUser = { name: 'User', email: 'existing@test.com' };
      mockRepository.create.mockRejectedValue(
        new Error('Email already exists')
      );

      await expect(userService.create(newUser)).rejects.toThrow(
        'Email already exists'
      );
    });
  });
});
```

### Ejemplo 3: Test de Middleware

```typescript
// src/middleware/auth.test.ts
import { Request, Response, NextFunction } from 'express';
import { authMiddleware } from './auth';
import { verifyToken } from '../utils/jwt';

jest.mock('../utils/jwt');

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  it('should call next() if token is valid', () => {
    mockRequest.headers = { authorization: 'Bearer valid-token' };
    (verifyToken as jest.Mock).mockReturnValue({ userId: 1 });

    authMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.user).toEqual({ userId: 1 });
  });

  it('should return 401 if no token provided', () => {
    authMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'No token provided',
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', () => {
    mockRequest.headers = { authorization: 'Bearer invalid-token' };
    (verifyToken as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    authMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(nextFunction).not.toHaveBeenCalled();
  });
});
```

---

## 📋 Checklist de Configuración

### Paso 1: Configurar SonarCloud
- [ ] Crear cuenta en SonarCloud (si no existe)
- [ ] Crear proyecto en SonarCloud para el backend
- [ ] Obtener `SONAR_TOKEN`
- [ ] Crear `sonar-project.properties`
- [ ] Agregar secret `SONAR_TOKEN` en GitHub

### Paso 2: Crear Workflows
- [ ] Crear directorio `.github/workflows/`
- [ ] Crear `ci-deploy.yml`
- [ ] Crear `ci-pr.yml`
- [ ] Ajustar versión de Node.js según proyecto
- [ ] Ajustar comandos de build/test según proyecto

### Paso 3: Configurar Testing
- [ ] Instalar Jest y dependencias
- [ ] Crear `jest.config.ts`
- [ ] Crear `tsconfig.test.json`
- [ ] Actualizar scripts en `package.json`
- [ ] Verificar que genera `coverage/lcov.info`

### Paso 4: Escribir Tests
- [ ] Crear tests para controllers (≥80% cobertura)
- [ ] Crear tests para services (≥80% cobertura)
- [ ] Crear tests para middlewares (≥80% cobertura)
- [ ] Crear tests para utils/helpers (≥80% cobertura)
- [ ] Verificar cobertura global ≥80%

### Paso 5: Configurar Git
- [ ] Actualizar `.gitignore` para excluir `coverage/`
- [ ] Actualizar `.eslintignore` para excluir `coverage/`
- [ ] Commitear configuración inicial

### Paso 6: Documentación
- [ ] Crear `CONTRIBUTING-QUALITY.md` (adaptar del frontend)
- [ ] Documentar estructura de tests
- [ ] Documentar comandos del proyecto
- [ ] Crear ejemplos de tests

### Paso 7: Validación
- [ ] Ejecutar `npm run lint` → Sin errores
- [ ] Ejecutar `npm run build` → Build exitoso
- [ ] Ejecutar `npm run test:coverage` → ≥80% cobertura
- [ ] Crear PR de prueba → Verificar workflows
- [ ] Verificar Quality Gate en SonarCloud

---

## 🎯 Quality Gate de SonarCloud

### Métricas Requeridas:
- **Cobertura en nuevo código**: ≥ 80%
- **Duplicaciones**: < 3%
- **Maintainability Rating**: A
- **Reliability Rating**: A
- **Security Rating**: A

### Configuración Recomendada:
```properties
# En sonar-project.properties
sonar.qualitygate.wait=true
sonar.coverage.exclusions=**/*.test.ts,**/*.spec.ts,**/tests/**
```

---

## 🔄 Workflow Completo para el Equipo

### Antes de cada Push/PR:

```bash
# 1. Linting
npm run lint

# 2. Tests con cobertura
npm run test:coverage

# 3. Build
npm run build

# 4. Verificar cobertura ≥ 80% en terminal

# 5. Commit y push
git add .
git commit -m "feat: your feature"
git push origin your-branch

# 6. Crear PR y esperar Quality Gate ✅
```

---

## 📊 Scripts NPM Requeridos

```json
{
  "scripts": {
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix",
    "test": "jest --passWithNoTests",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage --passWithNoTests"
  }
}
```

---

## 🚨 Exclusiones Comunes

### Archivos a excluir de cobertura:
- `src/server.ts` - Entry point
- `src/index.ts` - Entry point
- `src/config/**` - Configuración
- `src/database/migrations/**` - Migraciones
- `src/**/*.d.ts` - Tipos
- `tests/**` - Tests

### Agregar en `jest.config.ts`:
```typescript
collectCoverageFrom: [
  'src/**/*.{ts,tsx}',
  '!src/server.ts',
  '!src/index.ts',
  '!src/config/**',
  '!src/database/migrations/**',
  '!src/**/*.d.ts',
  '!src/**/*.test.{ts,tsx}',
],
```

---

## 📚 Recursos

- **SonarCloud**: https://sonarcloud.io
- **Jest Documentation**: https://jestjs.io
- **GitHub Actions**: https://docs.github.com/actions
- **Frontend Reference**: `finance-manager-frontend` repository

---

## ✅ Validación Final

Antes de considerar la configuración completa, verificar:

1. ✅ `npm run lint` pasa sin errores
2. ✅ `npm run build` compila exitosamente
3. ✅ `npm run test:coverage` genera `coverage/lcov.info`
4. ✅ Cobertura global ≥ 80%
5. ✅ Workflows de GitHub Actions pasan
6. ✅ SonarCloud Quality Gate pasa
7. ✅ Documentación creada para el equipo

---

**Autor**: Configuración basada en finance-manager-frontend  
**Fecha**: Noviembre 2025  
**Versión**: 1.0
