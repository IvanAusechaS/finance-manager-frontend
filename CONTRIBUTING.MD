# Contributing Guidelines

## Branching Strategy
This project follows **Trunk-Based Development**.
All changes must be developed in short-lived branches and merged into `main` through Pull Requests (PRs).

### Branch Naming Convention
Use the following format for your branches:
```
feature/US-XX-short-description
fix/bug-short-description
chore/task-short-description
```

Example:
```
feature/US-10-implement-dashboard
fix/navbar-responsive-issue
chore/update-dependencies
```

## Pull Request Rules
- All code changes must go through a Pull Request (PR).
- Each PR must have at least **1 approval** from the corresponding CODEOWNER.
- SonarCloud and CI/CD checks must pass before merging.
- Include the corresponding **Taiga User Story ID** in the PR title or description.

Example:
```
[US-10] Implement Dashboard Component (User Interface Epic)
```

## Code Review
- The assigned **CODEOWNERS** must review and approve the PR.
- Follow established design patterns and linting rules.
- Write unit tests for every new feature or bug fix.
- Check that your code maintains or improves test coverage (minimum 60%).

## Commit Convention
Use clear, descriptive commits:
```
feat: implement user authentication flow
fix: resolve header alignment on mobile devices
refactor: improve state management in dashboard
test: add unit tests for authentication service
```

## Workflow Example
1. Create a branch from `main`:
   ```bash
   git checkout -b feature/US-09-create-dashboard
   ```

2. Develop your feature locally.

3. Push the branch:
   ```bash
   git push origin feature/US-09-create-dashboard
   ```

4. Open a Pull Request to `main` and request a review from the designated CODEOWNER.

## Development Guidelines
- Use TypeScript for all new components and utilities.
- Follow React best practices and hooks patterns.
- Use functional components over class components.
- Ensure components are properly typed with TypeScript interfaces.
- Write meaningful component and function names.
- Keep components small and focused on a single responsibility.
