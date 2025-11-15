# Branch Protection Rules Configuration

This document describes the required branch protection rules for the `main` and `develop` branches to ensure code quality and prevent direct pushes to production.

## 🔒 Protection Rules for `main` Branch

### Required Settings

1. **Require a pull request before merging**
   - ✅ Require approvals: **2**
   - ✅ Dismiss stale pull request approvals when new commits are pushed
   - ✅ Require review from Code Owners (if CODEOWNERS file is present)

2. **Require status checks to pass before merging**
   - ✅ Require branches to be up to date before merging
   - Required status checks:
     - `Lint & Format Check`
     - `TypeScript Type Check`
     - `Unit Tests`
     - `Build Application`
     - `Security Audit`
     - `Validate Acceptance Criteria`

3. **Require conversation resolution before merging**
   - ✅ All conversations must be resolved

4. **Require signed commits**
   - ⚠️ Optional but recommended for production

5. **Require linear history**
   - ✅ Prevent merge commits, enforce rebase or squash

6. **Require deployments to succeed before merging**
   - ✅ Staging environment (if applicable)

7. **Lock branch**
   - ❌ Do not lock (allow emergency fixes)

8. **Do not allow bypassing the above settings**
   - ✅ Administrators included
   - ⚠️ Exception: Only repository owner can bypass in emergency

9. **Restrict who can push to matching branches**
   - ✅ Restrict direct pushes
   - Allowed: Only CI/CD automation
   - Administrators: Require pull request

### Additional Configurations

- **Automatically delete head branches**: ✅ Enabled
- **Allow force pushes**: ❌ Disabled
- **Allow deletions**: ❌ Disabled

---

## 🔀 Protection Rules for `develop` Branch

### Required Settings

1. **Require a pull request before merging**
   - ✅ Require approvals: **1**
   - ✅ Dismiss stale pull request approvals when new commits are pushed

2. **Require status checks to pass before merging**
   - ✅ Require branches to be up to date before merging
   - Required status checks:
     - `Lint & Format Check`
     - `TypeScript Type Check`
     - `Unit Tests`
     - `Build Application`

3. **Require conversation resolution before merging**
   - ✅ All conversations must be resolved

4. **Allow force pushes**: ❌ Disabled

---

## 📝 How to Configure in GitHub

### Via GitHub Web Interface

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Branches**
3. Click **Add rule** under "Branch protection rules"
4. Enter branch name pattern: `main`
5. Configure the settings as described above
6. Click **Create** or **Save changes**
7. Repeat for `develop` branch

### Via GitHub CLI (gh)

```bash
# Install GitHub CLI if not already installed
# https://cli.github.com/

# Configure main branch protection
gh api repos/IvanAusechaS/finance-manager-frontend/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["Lint & Format Check","TypeScript Type Check","Unit Tests","Build Application","Security Audit","Validate Acceptance Criteria"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":2,"dismiss_stale_reviews":true}' \
  --field restrictions=null \
  --field required_linear_history=true \
  --field allow_force_pushes=false \
  --field allow_deletions=false

# Configure develop branch protection
gh api repos/IvanAusechaS/finance-manager-frontend/branches/develop/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["Lint & Format Check","TypeScript Type Check","Unit Tests","Build Application"]}' \
  --field enforce_admins=false \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
  --field restrictions=null \
  --field allow_force_pushes=false
```

---

## 🔐 CODEOWNERS Configuration

Create a `.github/CODEOWNERS` file to automatically request reviews from specific people or teams:

```
# Default owners for everything in the repo
* @IvanAusechaS

# Frontend components
/src/components/ @frontend-team @IvanAusechaS

# Authentication pages
/src/pages/Login.tsx @security-team @IvanAusechaS
/src/pages/Signup.tsx @security-team @IvanAusechaS
/src/pages/ForgotPassword.tsx @security-team @IvanAusechaS
/src/pages/ResetPassword.tsx @security-team @IvanAusechaS

# CI/CD workflows
/.github/workflows/ @devops-team @IvanAusechaS

# Critical configuration files
package.json @IvanAusechaS
tsconfig.json @IvanAusechaS
vite.config.ts @IvanAusechaS
```

---

## 🚨 Emergency Bypass Procedure

In case of critical production issues requiring immediate hotfix:

1. **Document the emergency** in a GitHub issue
2. **Create emergency branch** from `main`: `hotfix/critical-issue-name`
3. **Implement minimal fix** with clear commit message
4. **Request emergency review** from at least one senior developer
5. **Override protection** (only repository owner)
6. **Create retrospective issue** to prevent similar emergencies
7. **Backport fix** to `develop` branch

---

## 📊 Monitoring and Compliance

### Weekly Review Checklist

- [ ] All PRs have passed required checks before merge
- [ ] No direct commits to protected branches
- [ ] All merged PRs have required approvals
- [ ] Security audit findings addressed
- [ ] Test coverage maintained or improved

### Monthly Audit

- [ ] Review branch protection settings
- [ ] Update required status checks if new workflows added
- [ ] Review and update CODEOWNERS file
- [ ] Verify emergency bypass logs
- [ ] Update this documentation if rules changed

---

## 📚 Additional Resources

- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub Required Status Checks](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/about-status-checks)
- [CODEOWNERS File Syntax](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)

---

**Last Updated**: November 2025  
**Maintained By**: @IvanAusechaS
