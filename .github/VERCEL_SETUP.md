# 🚀 Vercel Deployment Setup Guide

## Prerequisites
- Vercel account (https://vercel.com)
- Project already linked to Vercel: https://vercel.com/ivan-ausechas-projects/finance-manager-frontend

## 📋 Step-by-Step Configuration

### Step 1: Install Vercel CLI (Optional, for testing)

```bash
npm i -g vercel
```

### Step 2: Get Required Tokens and IDs

#### 2.1 Get Vercel Token

1. Go to: https://vercel.com/account/tokens
2. Click **"Create Token"**
3. Name: `GitHub Actions - finance-manager-frontend`
4. Scope: **Full Account**
5. Expiration: **No Expiration** (or set to 1 year)
6. Click **"Create"**
7. **Copy the token** (you won't see it again!)

#### 2.2 Get Vercel Organization ID

**Option A - From Vercel Dashboard:**
1. Go to: https://vercel.com/ivan-ausechas-projects/finance-manager-frontend/settings
2. Scroll down to **"Project ID"** section
3. Copy the **Team ID** (this is your ORG_ID)

**Option B - Using Vercel CLI:**
```bash
vercel whoami
# Look for "id" in the output
```

**Option C - From Project Settings:**
1. Go to project settings: https://vercel.com/ivan-ausechas-projects/finance-manager-frontend/settings
2. Open browser DevTools (F12)
3. Look for API calls containing `teamId` or `ownerId`

#### 2.3 Get Vercel Project ID

**Option A - From Project Settings:**
1. Go to: https://vercel.com/ivan-ausechas-projects/finance-manager-frontend/settings
2. Scroll to **"General"** section
3. Find **"Project ID"**
4. Copy the ID (e.g., `prj_xxxxxxxxxxxxx`)

**Option B - Using Vercel CLI:**
```bash
cd /home/ivanausecha/Documentos/finance-manager-frontend
vercel link  # If not already linked
vercel inspect
# Look for "id" field
```

**Option C - From .vercel folder:**
```bash
cat .vercel/project.json
# Copy the "projectId" value
```

### Step 3: Add Secrets to GitHub Repository

1. Go to: https://github.com/IvanAusechaS/finance-manager-frontend/settings/secrets/actions

2. Click **"New repository secret"**

3. Add the following secrets one by one:

   **Secret 1: VERCEL_TOKEN**
   - Name: `VERCEL_TOKEN`
   - Value: `[The token from Step 2.1]`
   - Click "Add secret"

   **Secret 2: VERCEL_ORG_ID**
   - Name: `VERCEL_ORG_ID`
   - Value: `[Your Team/Organization ID from Step 2.2]`
   - Click "Add secret"

   **Secret 3: VERCEL_PROJECT_ID**
   - Name: `VERCEL_PROJECT_ID`
   - Value: `[Your Project ID from Step 2.3]`
   - Click "Add secret"

### Step 4: Configure Vercel Project Settings

1. Go to: https://vercel.com/ivan-ausechas-projects/finance-manager-frontend/settings

2. **Git Configuration**:
   - Connected Git Repository: ✅ `IvanAusechaS/finance-manager-frontend`
   - Production Branch: `main`
   - Preview Branches: `develop`, `feature/*`

3. **Build & Development Settings**:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm ci`

4. **Environment Variables** (if needed):
   - Add any required env vars
   - Example: `VITE_API_URL`, `VITE_APP_NAME`, etc.

5. **Deployment Protection**:
   - Enable **"Deployment Protection"** for production
   - This ensures only authorized deployments

### Step 5: Test the Deployment

#### Option A - Push to develop branch

```bash
cd /home/ivanausecha/Documentos/finance-manager-frontend
git checkout develop
git merge feature/authentication
git push origin develop
```

Then watch the GitHub Actions tab:
https://github.com/IvanAusechaS/finance-manager-frontend/actions

#### Option B - Manual trigger

1. Go to: https://github.com/IvanAusechaS/finance-manager-frontend/actions/workflows/deploy-develop.yml
2. Click **"Run workflow"**
3. Select branch: `develop`
4. Click **"Run workflow"**

### Step 6: Verify Deployment

1. Check GitHub Actions logs for successful deployment
2. Visit your Vercel project: https://vercel.com/ivan-ausechas-projects/finance-manager-frontend
3. Check the deployment URL: https://finance-manager-frontend-ivan-ausechas-projects.vercel.app
4. Verify the app loads correctly

---

## 🔄 Deployment Workflow

### Automatic Deployments

**Develop Branch (Preview/Staging)**:
- **Trigger**: Push to `develop` branch
- **URL**: https://finance-manager-frontend-ivan-ausechas-projects.vercel.app
- **Workflow**: `.github/workflows/deploy-develop.yml`
- **Steps**:
  1. Run tests
  2. Build project
  3. Deploy to Vercel preview
  4. Update preview URL

**Main Branch (Production)**:
- **Trigger**: Push to `main` branch
- **URL**: https://finance-manager-frontend.vercel.app (or custom domain)
- **Workflow**: `.github/workflows/cd.yml`
- **Steps**:
  1. Run full CI pipeline
  2. Build production bundle
  3. Deploy to Vercel production
  4. Run health checks

**Feature Branches**:
- Vercel automatically creates preview deployments
- URL: `https://finance-manager-frontend-git-[branch-name]-ivan-ausechas-projects.vercel.app`

---

## 🛠️ Alternative: Using Vercel CLI in GitHub Actions

If you prefer more control, you can use Vercel CLI directly:

```yaml
- name: Deploy to Vercel
  env:
    VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
    VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
    VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
  run: |
    npm i -g vercel
    vercel pull --yes --environment=preview --token=$VERCEL_TOKEN
    vercel build --token=$VERCEL_TOKEN
    vercel deploy --prebuilt --token=$VERCEL_TOKEN
```

---

## 📊 Monitoring Deployments

### In Vercel Dashboard
- **Deployments**: https://vercel.com/ivan-ausechas-projects/finance-manager-frontend
- **Analytics**: https://vercel.com/ivan-ausechas-projects/finance-manager-frontend/analytics
- **Logs**: Click on any deployment → "View Function Logs"

### In GitHub Actions
- **All workflows**: https://github.com/IvanAusechaS/finance-manager-frontend/actions
- **Deploy workflow**: https://github.com/IvanAusechas-projects/finance-manager-frontend/actions/workflows/deploy-develop.yml

---

## 🔧 Troubleshooting

### Deployment fails with "Invalid token"
- Verify `VERCEL_TOKEN` is correctly added to GitHub Secrets
- Check token hasn't expired
- Regenerate token if needed

### "Project not found" error
- Verify `VERCEL_PROJECT_ID` matches the project ID in Vercel
- Check `VERCEL_ORG_ID` is correct
- Ensure the project is linked: `vercel link`

### Build fails
- Check build logs in GitHub Actions
- Verify build command: `npm run build`
- Test build locally: `npm run build`
- Check for missing environment variables

### Preview URL not working
- Wait 1-2 minutes for deployment to complete
- Check Vercel dashboard for deployment status
- Verify DNS settings (if using custom domain)

---

## 🎯 Best Practices

1. **Branch Strategy**:
   - `develop` → Preview/Staging URL
   - `main` → Production URL
   - Feature branches → Temporary preview URLs

2. **Environment Variables**:
   - Use Vercel environment variables for sensitive data
   - Never commit secrets to repository
   - Use different values for preview vs production

3. **Deployment Protection**:
   - Enable deployment protection for production
   - Require review before production deploy
   - Use staging URL for QA testing

4. **Monitoring**:
   - Set up Vercel Analytics
   - Monitor deployment logs
   - Configure alerts for failed deployments

---

## 📚 Quick Reference

### URLs
- **Vercel Project**: https://vercel.com/ivan-ausechas-projects/finance-manager-frontend
- **Preview (develop)**: https://finance-manager-frontend-ivan-ausechas-projects.vercel.app
- **Production (main)**: https://finance-manager-frontend.vercel.app
- **GitHub Secrets**: https://github.com/IvanAusechaS/finance-manager-frontend/settings/secrets/actions
- **Vercel Tokens**: https://vercel.com/account/tokens

### Commands
```bash
# Link project locally
vercel link

# Deploy manually
vercel --prod  # Production
vercel         # Preview

# Get project info
vercel inspect

# View logs
vercel logs [deployment-url]
```

---

## ✅ Verification Checklist

- [ ] Vercel token created
- [ ] Organization ID obtained
- [ ] Project ID obtained
- [ ] All 3 secrets added to GitHub
- [ ] Vercel project settings configured
- [ ] Git repository linked in Vercel
- [ ] Build settings verified (Vite, dist folder)
- [ ] Test deployment triggered
- [ ] Preview URL accessible
- [ ] GitHub Actions workflow passing

---

**Last Updated**: November 2025  
**Maintained By**: @IvanAusechaS
