# 🚀 RaynaUI Deployment Guide

This guide will help you deploy RaynaUI for public use.

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (v8 or higher)
- [Git](https://git-scm.com/)
- A GitHub account
- A domain name (optional but recommended)

## 🏗️ Step 1: Repository Setup

### 1.1 Create GitHub Repository

```bash
# Create a new repository on GitHub
# Name it: raynaui
# Make it public
# Don't initialize with README (we already have one)
```

### 1.2 Update Remote Origin

```bash
# Remove the current origin
git remote remove origin

# Add your new repository as origin
git remote add origin https://github.com/yourusername/raynaui.git

# Push to your repository
git add .
git commit -m "Initial RaynaUI setup"
git push -u origin main
```

## 🌐 Step 2: Domain & DNS Setup

### 2.1 Purchase Domain (Optional)

- Purchase a domain like `raynaui.com` or `raynaui.dev`
- Set up DNS records

### 2.2 Update Environment Variables

Create a `.env.local` file in the root:

```bash
# App URLs
NEXT_PUBLIC_APP_URL=https://raynaui.com
NEXT_PUBLIC_REGISTRY_URL=https://raynaui.com/r

# Analytics (optional)
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=your-ga-id
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-vercel-analytics-id
```

## 🚀 Step 3: Deploy to Vercel (Recommended)

### 3.1 Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your `raynaui` repository

### 3.2 Configure Build Settings

**Root Directory:** `apps/www`
**Build Command:** `pnpm build`
**Output Directory:** `.next`
**Install Command:** `pnpm install`

### 3.3 Environment Variables

Add these in Vercel dashboard:

```
NEXT_PUBLIC_APP_URL=https://raynaui.com
NEXT_PUBLIC_REGISTRY_URL=https://raynaui.com/r
```

### 3.4 Deploy

Click "Deploy" and wait for the build to complete.

## 📦 Step 4: Deploy CLI Package

### 4.1 Build CLI

```bash
# Build the CLI package
cd packages/raynaui
pnpm build
```

### 4.2 Publish to npm

```bash
# Login to npm
npm login

# Publish the package
npm publish --access public
```

### 4.3 Test CLI Installation

```bash
# Test the CLI
npx raynaui@latest init
```

## 🔧 Step 5: Registry Deployment

### 5.1 Build Registry

```bash
# Build the registry
pnpm registry:build
```

### 5.2 Deploy Registry API

The registry is served from your main Vercel deployment at `/r`.

## 📚 Step 6: Documentation Deployment

### 6.1 Build Documentation

```bash
# Build documentation
pnpm docs:build
```

### 6.2 Deploy Documentation

Documentation is automatically deployed with your main Vercel deployment.

## 🎨 Step 7: Customization

### 7.1 Add Custom Components

1. Create components in `apps/v4/components/ui/`
2. Add them to `apps/v4/registry/registry-custom.ts`
3. Update `apps/v4/registry/index.ts`

### 7.2 Add Custom Icons

1. Create icons in `apps/v4/components/ui/icons/`
2. Add them to `apps/v4/registry/registry-custom-icons.ts`
3. Update `apps/v4/registry/index.ts`

### 7.3 Custom Themes

1. Create themes in `apps/v4/registry/new-york-v4/themes/`
2. Add them to `apps/v4/registry/registry-themes.ts`

## 🔄 Step 8: Continuous Deployment

### 8.1 GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy RaynaUI

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - run: pnpm install
      - run: pnpm build
      - run: pnpm registry:build
      - run: pnpm docs:build
```

## 📊 Step 9: Analytics & Monitoring

### 9.1 Google Analytics

1. Create a Google Analytics account
2. Add tracking ID to environment variables
3. Update `apps/v4/components/analytics.tsx`

### 9.2 Vercel Analytics

1. Enable Vercel Analytics in dashboard
2. Add tracking ID to environment variables

## 🔍 Step 10: Testing

### 10.1 Test Website

```bash
# Test locally
pnpm www:dev
# Visit http://localhost:3333
```

### 10.2 Test CLI

```bash
# Test CLI locally
cd packages/raynaui
pnpm start:dev
```

### 10.3 Test Registry

```bash
# Test registry locally
pnpm v4:dev
# Visit http://localhost:4000
```

## 🚀 Step 11: Go Live!

### 11.1 Final Checklist

- [ ] Website deployed and accessible
- [ ] CLI package published to npm
- [ ] Registry API working
- [ ] Documentation complete
- [ ] Custom components added
- [ ] Analytics configured
- [ ] Domain configured (if applicable)

### 11.2 Announcement

- Share on social media
- Write a blog post
- Submit to relevant directories
- Create GitHub discussions

## 🔧 Troubleshooting

### Common Issues

1. **Build fails**: Check Node.js version and dependencies
2. **CLI not working**: Verify npm package is published
3. **Registry not loading**: Check environment variables
4. **Styling issues**: Verify Tailwind CSS configuration

### Support

- Create GitHub issues for bugs
- Use GitHub discussions for questions
- Join community Discord/Slack

## 📈 Next Steps

1. **Add more components** based on community feedback
2. **Create tutorials** and examples
3. **Build community** around RaynaUI
4. **Add premium features** (optional)
5. **Create integrations** with popular frameworks

---

🎉 **Congratulations!** Your RaynaUI library is now live and ready for the world! 