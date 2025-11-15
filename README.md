# Finance Manager – Frontend

This repository contains the frontend application for the Finance Manager project, developed with **React**, **TypeScript**, **TailwindCSS**, and **Vite**.  
The frontend provides the user interface for authentication, transaction management, account tracking, reporting, and data visualization.

## Branching strategy (Git Flow)
- `main`: stable production-ready code
- `develop`: integration branch for upcoming features
- `feature/*`: branches for new features
- `release/*`: branches for release preparation
- `hotfix/*`: branches for urgent production fixes

## Tech stack
- React 18.3
- TypeScript
- TailwindCSS
- React Router DOM (routing)
- Radix UI (component library)
- Lucide React (icons)
- Sonner (toast notifications)
- Zod (validation schemas)
- Recharts (data visualization)
- Vite (build tool)

## Implemented Features

### 🔐 Authentication System (HU10, HU11, HU12)
The application includes a complete authentication system with the following pages:

#### 1. Sign Up (`/signup`) - HU10
- Full registration form with real-time validation
- Required fields:
  - First Name (letters only, min 2 characters)
  - Last Name (letters only, min 2 characters)
  - Age (numeric, ≥ 13 years)
  - Email (RFC 5322 format)
  - Password (≥ 8 chars, uppercase, lowercase, number, special char)
  - Confirm Password (must match)
- Register button disabled until all validations pass
- Error messages with ARIA live regions for accessibility
- Success toast and redirect to login after registration

#### 2. Login (`/login`) - HU11
- Login form with real-time validation
- Required fields:
  - Email (RFC 5322 format)
  - Password
- "Forgot password?" link
- Login button disabled until validations pass
- Welcome message and redirect to dashboard after successful login
- Error handling for invalid credentials

#### 3. Forgot Password (`/forgot-password`) - HU12
- Single email field to request password reset
- Sends reset link valid for 1 hour
- Success message with instructions
- Option to resend to different email
- Generic response for security (doesn't reveal if email exists)

#### 4. Reset Password (`/reset?token=xyz`) - HU12
- Token validation on page load
- New password form with real-time validation
- Password requirements helper text
- Invalid/expired token error handling
- Success message and redirect to login after reset

#### 5. Dashboard (`/dashboard`) - Placeholder
- Welcome message after successful login
- Logout functionality
- Placeholder cards for future features
- Navigation to home page

## Available Routes

- `/` - Landing page with features and CTAs
- `/login` - Login page
- `/signup` - Registration page
- `/forgot-password` - Password recovery request
- `/reset?token=xyz` - Password reset form
- `/dashboard` - User dashboard (placeholder)

## Validation Rules

### Password
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (!@#$%^&*()_+-=[]{};':"\\|,.<>/?)

### Email
- RFC 5322 format validation
- Basic format: `user@domain.com`

### Age
- Numeric only
- Minimum 13 years
- Maximum 120 years

### Names
- Letters only (including accented characters: á, é, í, ó, ú, ñ, ü)
- Minimum 2 characters
- Spaces allowed

## Backend Integration (TODO)

The authentication pages are ready for backend integration. Update the following endpoints when available:

```typescript
// Signup
POST /api/auth/signup
Body: { firstName, lastName, age, email, password }
Response: { id, message }

// Login
POST /api/auth/login
Body: { email, password }
Response: { token, user: { id, name, email } }

// Forgot Password
POST /api/auth/forgot-password
Body: { email }
Response: { message }

// Reset Password
POST /api/auth/reset-password
Body: { token, password }
Response: { message }

// Validate Reset Token
GET /api/auth/validate-reset-token?token=xyz
Response: { valid: boolean }
```

## Development

### Install dependencies
```bash
npm install
```

### Run development server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for production
```bash
npm run build
```

## 🚀 CI/CD Pipeline

This project implements a complete CI/CD pipeline using GitHub Actions, following production-level best practices.

### Continuous Integration (CI)

Every push and pull request triggers automated checks:

#### 📋 Quality Gates

1. **Lint & Format Check**
   ```bash
   npm run lint          # TypeScript compilation check
   npm run format:check  # Prettier formatting verification
   ```

2. **Type Check**
   ```bash
   npm run type-check    # Full TypeScript validation
   ```

3. **Unit Tests**
   ```bash
   npm test              # Run all tests
   npm run test:coverage # Generate coverage report
   ```
   - 26+ tests covering all validation functions
   - Tests based on acceptance criteria from HU10, HU11, HU12
   - Automatic coverage upload to Codecov

4. **Build Verification**
   ```bash
   npm run build
   ```
   - Ensures production build succeeds
   - Uploads build artifacts for deployment
   - Verifies dist/ directory exists

5. **Security Audit**
   ```bash
   npm audit --audit-level=moderate
   ```
   - Scans for vulnerable dependencies
   - Checks for known security issues

6. **Acceptance Criteria Validation**
   - Validates HU10 (Signup) structure
   - Validates HU11 (Login/Dashboard) structure
   - Validates HU12 (Password Recovery) structure

### Continuous Deployment (CD)

Automatic deployment to Vercel:

**Develop Branch (Preview/Staging)**:
```yaml
Workflow: Deploy to Vercel (Develop)
Trigger: Push to develop branch
URL: https://finance-manager-frontend-ivan-ausechas-projects.vercel.app
Steps:
  1. Run tests
  2. Build project  
  3. Deploy to Vercel preview
```

**Main Branch (Production)**:
```yaml
Workflow: CD Pipeline
Trigger: Push to main branch
URL: https://finance-manager-frontend.vercel.app
Steps:
  1. Build production bundle
  2. Create deployment package
  3. Deploy to Vercel production
  4. Run health checks
  5. Send deployment notifications
```

**Configuration**: See [`.github/VERCEL_SETUP.md`](.github/VERCEL_SETUP.md) for detailed setup instructions.

### 🔒 Branch Protection Rules

The `main` branch is protected with the following rules:

- ✅ Require pull request reviews (2 approvals minimum)
- ✅ Require all CI checks to pass
- ✅ Require conversation resolution
- ✅ Require linear history (no merge commits)
- ❌ No direct pushes allowed
- ❌ No force pushes allowed

See [`.github/BRANCH_PROTECTION.md`](.github/BRANCH_PROTECTION.md) for detailed configuration.

### 📝 Pull Request Process

1. Create feature branch from `develop`
2. Implement changes with tests
3. Push branch and create PR
4. Fill out PR template with checklist
5. Wait for CI checks to pass
6. Request reviews from team
7. Address review feedback
8. Squash and merge after approval

Use the PR template at [`.github/pull_request_template.md`](.github/pull_request_template.md)

### 🧪 Testing Strategy

**Framework**: Vitest + React Testing Library

**Test Coverage**:
- ✅ Validation functions (26 tests)
- ✅ Email format validation (RFC 5322)
- ✅ Password strength validation (8+ chars, uppercase, lowercase, number, special)
- ✅ Age validation (≥ 13 years)
- ✅ Name validation (letters only, 2+ chars)
- ✅ Integration tests for complete form validation

**Run Tests Locally**:
```bash
npm test              # Run tests once
npm run test:watch    # Run in watch mode
npm run test:coverage # Generate coverage report
```

### 📊 Code Quality Metrics

[![CI Status](https://github.com/IvanAusechaS/finance-manager-frontend/workflows/CI%20Pipeline/badge.svg)](https://github.com/IvanAusechaS/finance-manager-frontend/actions)

**Quality Standards**:
- TypeScript strict mode enabled
- Prettier for code formatting
- 100% test pass rate required
- No TypeScript errors allowed
- Build must succeed before merge

## Project Structure

```
src/
├── components/
│   ├── ui/          # Reusable UI components (buttons, cards, inputs, etc.)
│   ├── Navbar.tsx   # Navigation component
│   ├── Benefits.tsx
│   ├── CTA.tsx
│   ├── Features.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   └── HowItWorks.tsx
├── lib/
│   ├── validations.ts      # Validation helper functions
│   └── validations.test.ts # Unit tests for validations
├── pages/
│   ├── Dashboard.tsx       # Post-login dashboard
│   ├── ForgotPassword.tsx  # Password recovery request
│   ├── Login.tsx           # User login
│   ├── ResetPassword.tsx   # Password reset with token
│   └── Signup.tsx          # User registration
├── test/
│   └── setup.ts            # Test environment setup
├── App.tsx                 # Main app component with routing
├── main.tsx                # Application entry point
└── index.css               # Global styles
```

## 🤝 Contributing

### Development Workflow

1. **Clone the repository**
   ```bash
   git clone https://github.com/IvanAusechaS/finance-manager-frontend.git
   cd finance-manager-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make changes and test**
   ```bash
   npm run dev           # Start dev server
   npm test              # Run tests
   npm run lint          # Check types
   npm run format:check  # Check formatting
   ```

5. **Commit with conventional commits**
   ```bash
   git commit -m "feat: add new feature"
   git commit -m "fix: resolve bug"
   git commit -m "docs: update README"
   ```

6. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

## DevOps focus
- Continuous Integration with GitHub Actions
- Continuous Deployment with Vercel/Render
- Monitoring with UptimeRobot/Healthchecks.io

## Accessibility

All forms include:
- ARIA labels for screen readers
- `aria-live` regions for error announcements
- `aria-invalid` for invalid fields
- `aria-describedby` linking fields to error messages
- Proper keyboard navigation
- Focus management

## Notes

- All authentication flows are currently mocked (no backend integration yet)
- Tokens are not yet persisted (localStorage or HttpOnly cookies)
- Protected routes are not yet implemented
- Form submissions simulate API calls with timeouts
- Success/error messages are shown via Sonner toast notifications
