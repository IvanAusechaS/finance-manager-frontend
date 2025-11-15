# 🚀 Quick Vercel Setup - 5 Minutes

## Step 1: Get Your Vercel IDs (2 minutes)

### Option 1: From Vercel Dashboard (Easiest) ✅

1. **Go to your project settings**:
   https://vercel.com/ivan-ausechas-projects/finance-manager-frontend/settings

2. **Copy Project ID**:
   - Scroll down to find **"Project ID"**
   - Click the copy icon 📋
   - Save it somewhere (e.g., notepad)
   - Example: `prj_xxxxxxxxxxxxx`

3. **Copy Organization/Team ID**:
   - On the same settings page
   - Look for **"Team ID"** or in the URL: `ivan-ausechas-projects` is your team slug
   - You can find the actual ID in: https://vercel.com/teams/settings
   - Or in your project's `.vercel/project.json` if you have it locally

### Option 2: From Browser DevTools (Alternative)

1. Go to: https://vercel.com/ivan-ausechas-projects/finance-manager-frontend
2. Open DevTools (F12)
3. Go to Network tab
4. Look for API calls
5. Find calls with `projectId` or `teamId` in the response

### Option 3: Check Local Files (If project was linked before)

```bash
# If you have linked the project before
cat .vercel/project.json
```

The file will contain:
```json
{
  "orgId": "team_xxxxxxxxxxxx",
  "projectId": "prj_xxxxxxxxxxxx"
}
```

---

## Step 2: Create Vercel Token (1 minute)

1. **Go to Vercel tokens page**:
   https://vercel.com/account/tokens

2. **Create new token**:
   - Click **"Create Token"**
   - Name: `GitHub Actions - finance-manager-frontend`
   - Scope: **Full Account**
   - Expiration: **No Expiration** (or 1 year)
   - Click **"Create"**

3. **Copy the token** ⚠️ You won't see it again!
   - Example: `vercel_xxxxxxxxxxxxxxxxxxxxx`

---

## Step 3: Add Secrets to GitHub (2 minutes)

1. **Go to GitHub Secrets**:
   https://github.com/IvanAusechaS/finance-manager-frontend/settings/secrets/actions

2. **Add 3 secrets**:

   Click **"New repository secret"** for each:

   **Secret 1:**
   - Name: `VERCEL_TOKEN`
   - Value: [Paste the token from Step 2]
   - Click "Add secret"

   **Secret 2:**
   - Name: `VERCEL_PROJECT_ID`
   - Value: [Paste Project ID from Step 1]
   - Click "Add secret"

   **Secret 3:**
   - Name: `VERCEL_ORG_ID`
   - Value: [Paste Organization/Team ID from Step 1]
   - Click "Add secret"

---

## Step 4: Test Deployment (1 minute)

### Option A: Automatic (Recommended)

Just push to develop branch:

```bash
git add .
git commit -m "ci: configure Vercel deployment"
git push origin feature/authentication

# Then merge to develop
git checkout develop
git merge feature/authentication
git push origin develop
```

GitHub Actions will automatically deploy to:
https://finance-manager-frontend-ivan-ausechas-projects.vercel.app

### Option B: Manual Trigger

1. Go to: https://github.com/IvanAusechaS/finance-manager-frontend/actions/workflows/deploy-develop.yml
2. Click **"Run workflow"**
3. Select branch: `develop`
4. Click **"Run workflow"**

---

## ✅ Verification Checklist

- [ ] Got Project ID from Vercel
- [ ] Got Organization/Team ID from Vercel  
- [ ] Created Vercel token
- [ ] Added `VERCEL_TOKEN` to GitHub Secrets
- [ ] Added `VERCEL_PROJECT_ID` to GitHub Secrets
- [ ] Added `VERCEL_ORG_ID` to GitHub Secrets
- [ ] Pushed to develop branch
- [ ] Checked GitHub Actions tab for deployment
- [ ] Verified site is live at preview URL

---

## 🔗 Quick Links

- **Vercel Project**: https://vercel.com/ivan-ausechas-projects/finance-manager-frontend
- **Project Settings**: https://vercel.com/ivan-ausechas-projects/finance-manager-frontend/settings
- **Create Token**: https://vercel.com/account/tokens
- **GitHub Secrets**: https://github.com/IvanAusechaS/finance-manager-frontend/settings/secrets/actions
- **GitHub Actions**: https://github.com/IvanAusechaS/finance-manager-frontend/actions

---

## 📊 Expected URLs

After setup:

- **Develop (Preview)**: https://finance-manager-frontend-ivan-ausechas-projects.vercel.app
- **Main (Production)**: https://finance-manager-frontend.vercel.app
- **Feature branches**: Auto-generated preview URLs

---

## 🆘 Troubleshooting

### Can't find Project ID?
- Check: https://vercel.com/ivan-ausechas-projects/finance-manager-frontend/settings
- Scroll to "General" section
- Look for "Project ID"

### Can't find Organization ID?
- Check: https://vercel.com/teams/settings
- Or extract from URL: `/ivan-ausechas-projects/` → that's your team slug
- For actual ID, check project settings or DevTools

### Deployment fails?
- Verify all 3 secrets are added correctly
- Check GitHub Actions logs
- Ensure Vercel project is linked to the correct GitHub repo

---

**Need help?** Check the detailed guide: [VERCEL_SETUP.md](VERCEL_SETUP.md)
