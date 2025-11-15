# SonarCloud Configuration Instructions

## Important: Manual Setup Required

This project uses SonarCloud for code quality analysis. The following steps must be completed manually:

## 1. Configure GitHub Repository Secrets

Go to: `https://github.com/IvanAusechaS/finance-manager-frontend/settings/secrets/actions`

Add the following secret:
- **Name**: `SONAR_TOKEN`
- **Value**: Your SonarCloud token (request from project administrator)

## 2. Verify SonarCloud Project Configuration

1. Go to: `https://sonarcloud.io/projects`
2. Verify project exists with key: `IvanAusechaS_finance-manager-frontend`
3. Verify organization: `ivanausechas`
4. Check that the project is bound to the GitHub repository

## 3. Current Configuration

The project is configured to analyze:
- **Sources**: `src/lib`, `src/pages` (business logic and UI)
- **Tests**: All `*.test.ts` and `*.test.tsx` files
- **Coverage**: `coverage/lcov.info`

Excluded from analysis:
- UI components (`src/components/**`)
- Configuration files
- Styles
- Test files (from source analysis)

## 4. Quality Metrics

Current project status:
- **Tests**: 54 passing (26 validation + 28 page tests)
- **Coverage**: 96.15% on `src/lib/validations.ts`
- **Node.js Version**: 20.x (required for Vitest 4.x)
- **Build**: Vite 6.4.1 (security patches applied)

## 5. Common Issues

### "Project not found" Error

**Cause**: Missing or incorrect `SONAR_TOKEN` secret in GitHub

**Solution**:
1. Verify the token is valid in SonarCloud
2. Check the token has the correct permissions
3. Ensure the secret name is exactly `SONAR_TOKEN` (case-sensitive)

### Security Hotspots

**Common causes**:
- `console.log` or `console.error` in production code
- `Math.random()` for security-sensitive operations
- TODO comments with sensitive information

**Solution**: Review and address each hotspot in SonarCloud dashboard

### Coverage Below Threshold

**Note**: Coverage is only measured on `src/lib/validations.ts` (business logic)

UI pages are excluded from coverage requirements as they are presentation layer.

## 6. CI/CD Integration

The CI pipeline includes SonarCloud scan with `continue-on-error: true` to prevent blocking deployments if SonarCloud is temporarily unavailable.

All other quality checks (tests, build, security audit) must pass.

## 7. Next Steps

1. Configure `SONAR_TOKEN` secret in GitHub
2. Push changes to trigger new CI run
3. Review SonarCloud dashboard for issues
4. Address any security hotspots or code smells
5. Verify quality gate passes

## Support

For SonarCloud access or token issues, contact the project administrator.
