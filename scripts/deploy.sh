#!/bin/bash

# RaynaUI Deployment Script

echo "🚀 Starting RaynaUI deployment..."

# Build all packages
echo "📦 Building packages..."
pnpm build

# Build registry
echo "🏗️ Building registry..."
pnpm registry:build

# Build documentation
echo "📚 Building documentation..."
pnpm docs:build

# Build CLI
echo "🔧 Building CLI..."
pnpm build:cli

echo "✅ Build complete!"

# Deploy to Vercel (if using Vercel)
if [ "$DEPLOY_TO_VERCEL" = "true" ]; then
    echo "🚀 Deploying to Vercel..."
    vercel --prod
fi

# Deploy to Netlify (if using Netlify)
if [ "$DEPLOY_TO_NETLIFY" = "true" ]; then
    echo "🚀 Deploying to Netlify..."
    netlify deploy --prod --dir=apps/www/out
fi

echo "🎉 Deployment complete!" 