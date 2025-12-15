# 🚀 Vercel Deployment Quick Guide

## Current Status
✅ **Build passing:** The project compiles successfully with 0 TypeScript errors
✅ **Optimized:** Code splitting with chunks optimized for production
✅ **Ready:** Fully configured for Vercel deployment

## Deploy URL
Your project is deployed at: **afk-gtvi-dha.vercel.app**

## Environment Variables Required

In Vercel Dashboard → Settings → Environment Variables, add:

```bash
VITE_API_BASE_URL=http://localhost:3000
```

**Important:** Change `http://localhost:3000` to your actual backend API URL when you have it deployed.

## Automatic Deployments

Every push to branch `new-branch` will trigger an automatic deployment to Vercel.

## Manual Deployment

If you need to trigger a manual deployment:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `finance-manager-frontend`
3. Click "Deployments" tab
4. Click "Redeploy" on the latest deployment

## Viewing Logs

To check deployment logs:
1. Go to your project in Vercel
2. Click on a deployment
3. View the "Building" and "Functions" logs

## Build Command

The project uses:
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

## Common Issues & Solutions

### Issue: Build fails with TypeScript errors
**Solution:** All TypeScript errors have been fixed. If you see new errors:
```bash
npm run build
```
This will show you the exact errors locally.

### Issue: Environment variables not working
**Solution:** 
- Make sure variables are prefixed with `VITE_`
- Redeploy after adding/changing variables
- Check the environment variables are set for "Production"

### Issue: 404 on routes
**Solution:** Already fixed with `vercel.json` rewrites configuration.

### Issue: API connection fails
**Solution:** 
- Verify `VITE_API_BASE_URL` is correct
- Ensure your backend accepts requests from your Vercel domain
- Check CORS configuration on your backend

## Local Development

```bash
# Install dependencies
npm install

# Start dev server (runs on port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Tech Stack
- React 19
- TypeScript 5.9
- Vite 7.2
- Tailwind CSS
- Radix UI components
- React Router
- Recharts

## Support
For issues with this deployment, contact the development team or check the [GitHub repository](https://github.com/IvanAusechaS/finance-manager-frontend).
