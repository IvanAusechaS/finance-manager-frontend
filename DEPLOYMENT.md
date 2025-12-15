# Finance Manager Frontend - Deployment Guide

## 📦 Deployment to Vercel

This project is configured and ready for deployment to Vercel.

### Prerequisites

- Node.js 18.x or later
- npm or yarn package manager
- Vercel account (free tier works)

### Quick Deploy

#### Option 1: Deploy via Vercel Dashboard

1. Visit [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository: `IvanAusechaS/finance-manager-frontend`
4. Vercel will auto-detect the Vite configuration
5. Add environment variables:
   - `VITE_API_BASE_URL` - Your backend API URL
6. Click "Deploy"

#### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Environment Variables

Configure these in Vercel Dashboard → Settings → Environment Variables:

```env
VITE_API_BASE_URL=https://your-backend-api.com
VITE_APP_NAME=Finance Manager
VITE_APP_VERSION=1.0.0
VITE_ENV=production
```

### Build Configuration

The project uses the following build settings (configured in `vercel.json`):

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Framework**: Vite
- **Node Version**: 18.x

### Project Structure

```
finance-manager-frontend/
├── src/
│   ├── components/     # Reusable components
│   ├── pages/         # Page components
│   ├── lib/           # API and utilities
│   ├── hooks/         # Custom React hooks
│   ├── types/         # TypeScript type definitions
│   └── utils/         # Helper functions
├── public/            # Static assets
├── dist/              # Build output (generated)
└── vercel.json        # Vercel configuration
```

### Features

- ✅ React 19 + TypeScript
- ✅ Vite for fast builds
- ✅ Tailwind CSS for styling
- ✅ Radix UI components
- ✅ React Router for navigation
- ✅ Date-fns for date handling
- ✅ Recharts for data visualization
- ✅ Jest + Testing Library for tests

### Build Optimization

The build is optimized with code splitting:

- React ecosystem → `react-vendor`
- UI components → `ui-vendor`
- Charts → `charts`
- Date utilities → `date-utils`
- Icons → `icons`

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Troubleshooting

#### Build fails with TypeScript errors

```bash
# Check TypeScript configuration
npx tsc --noEmit

# Clean and rebuild
rm -rf node_modules dist
npm install
npm run build
```

#### Environment variables not working

Make sure your variables are prefixed with `VITE_` and restart the dev server.

#### API connection issues

Check that `VITE_API_BASE_URL` is correctly set and your backend allows CORS from your Vercel domain.

### Support

For issues, please check:
- [Vercel Documentation](https://vercel.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [Project Issues](https://github.com/IvanAusechaS/finance-manager-frontend/issues)
