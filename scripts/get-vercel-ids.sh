#!/bin/bash

# Vercel Setup Helper Script
# This script helps you get the required Vercel IDs for GitHub Actions

echo "🚀 Vercel Setup Helper for GitHub Actions"
echo "=========================================="
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "⚠️  Vercel CLI is not installed."
    echo "📦 Installing Vercel CLI..."
    npm i -g vercel
    echo "✅ Vercel CLI installed!"
    echo ""
fi

# Check if project is linked
if [ ! -d ".vercel" ]; then
    echo "🔗 Linking project to Vercel..."
    vercel link
    echo ""
fi

echo "📋 Getting Vercel Project Information..."
echo ""

# Get project ID from .vercel/project.json
if [ -f ".vercel/project.json" ]; then
    PROJECT_ID=$(cat .vercel/project.json | grep -o '"projectId":"[^"]*"' | cut -d'"' -f4)
    ORG_ID=$(cat .vercel/project.json | grep -o '"orgId":"[^"]*"' | cut -d'"' -f4)
    
    echo "✅ Found project configuration!"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📝 GitHub Secrets Configuration"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Add these secrets to GitHub:"
    echo "https://github.com/IvanAusechaS/finance-manager-frontend/settings/secrets/actions"
    echo ""
    echo "1️⃣  VERCEL_PROJECT_ID"
    echo "   Value: $PROJECT_ID"
    echo ""
    echo "2️⃣  VERCEL_ORG_ID"
    echo "   Value: $ORG_ID"
    echo ""
    echo "3️⃣  VERCEL_TOKEN"
    echo "   Get token from: https://vercel.com/account/tokens"
    echo "   - Click 'Create Token'"
    echo "   - Name: GitHub Actions - finance-manager-frontend"
    echo "   - Scope: Full Account"
    echo "   - Copy the token and add it to GitHub Secrets"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "📦 Project Details:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    vercel inspect
    echo ""
    echo "✅ Setup information ready!"
    echo ""
    echo "Next steps:"
    echo "1. Create Vercel token: https://vercel.com/account/tokens"
    echo "2. Add all 3 secrets to GitHub"
    echo "3. Push to develop branch to test deployment"
    echo ""
else
    echo "❌ Project not linked to Vercel"
    echo "Run: vercel link"
fi
