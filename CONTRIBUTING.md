# Contributing to RaynaUI

Thank you for your interest in contributing to RaynaUI! This guide will help you get started.

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- pnpm 8 or higher
- Git

### Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/yourusername/raynaui.git
   cd raynaui
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development servers**
   ```bash
   # Start the main app
   pnpm v4:dev
   
   # Start the website
   pnpm www:dev
   ```

## 🎨 Adding New Components

### 1. Create the Component

Create your component in `apps/v4/components/ui/`:

```tsx
// apps/v4/components/ui/my-component.tsx
"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const myComponentVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "default-classes",
        secondary: "secondary-classes",
      },
      size: {
        default: "default-size",
        sm: "small-size",
        lg: "large-size",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface MyComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof myComponentVariants> {}

const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(myComponentVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)
MyComponent.displayName = "MyComponent"

export { MyComponent, myComponentVariants }
```

### 2. Add to Registry

Add your component to `apps/v4/registry/registry-custom.ts`:

```tsx
export const customComponents = [
  // ... existing components
  {
    name: "my-component",
    type: "components:ui",
    registryDependencies: [], // Add dependencies if needed
    files: ["components/ui/my-component.tsx"],
    dependencies: [], // Add npm dependencies if needed
    description: "A brief description of your component",
  },
]
```

### 3. Create Example

Create an example in `apps/v4/app/(app)/examples/my-component/page.tsx`:

```tsx
import { MyComponent } from "@/components/ui/my-component"

export default function MyComponentExample() {
  return (
    <div className="space-y-4">
      <MyComponent>Default variant</MyComponent>
      <MyComponent variant="secondary">Secondary variant</MyComponent>
    </div>
  )
}
```

### 4. Add to Navigation

Update `apps/v4/lib/config.ts` to add your component to the navigation:

```tsx
export const siteConfig = {
  // ... existing config
  navItems: [
    // ... existing items
    {
      href: "/examples/my-component",
      label: "My Component",
    },
  ],
}
```

## 🎯 Adding New Icons

### 1. Create the Icon

Create your icon in `apps/v4/components/ui/icons/`:

```tsx
// apps/v4/components/ui/icons/my-icon.tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const myIconVariants = cva(
  "inline-block",
  {
    variants: {
      size: {
        sm: "h-4 w-4",
        md: "h-6 w-6",
        lg: "h-8 w-8",
        xl: "h-12 w-12",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

export interface MyIconProps
  extends React.SVGProps<SVGSVGElement>,
    VariantProps<typeof myIconVariants> {}

const MyIcon = React.forwardRef<SVGSVGElement, MyIconProps>(
  ({ className, size, ...props }, ref) => (
    <svg
      ref={ref}
      className={cn(myIconVariants({ size }), className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Add your SVG paths here */}
      <path
        d="M12 2L2 7L12 12L22 7L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
)
MyIcon.displayName = "MyIcon"

export { MyIcon, myIconVariants }
```

### 2. Add to Registry

Add your icon to `apps/v4/registry/registry-custom-icons.ts`:

```tsx
export const customIcons = [
  // ... existing icons
  {
    name: "my-icon",
    type: "components:ui",
    files: ["components/ui/icons/my-icon.tsx"],
    dependencies: [],
    description: "A brief description of your icon",
  },
]
```

## 🎨 Adding New Themes

### 1. Create the Theme

Create your theme in `apps/v4/registry/new-york-v4/themes/`:

```tsx
// apps/v4/registry/new-york-v4/themes/my-theme.tsx
export const myTheme = {
  name: "my-theme",
  label: "My Theme",
  activeColor: "240 5.9% 10%",
  cssVars: {
    "--background": "0 0% 100%",
    "--foreground": "240 10% 3.9%",
    "--card": "0 0% 100%",
    "--card-foreground": "240 10% 3.9%",
    // ... add all CSS variables
  },
}
```

### 2. Add to Registry

Add your theme to `apps/v4/registry/registry-themes.ts`:

```tsx
export const themes = [
  // ... existing themes
  {
    name: "my-theme",
    type: "registry:theme",
    registryDependencies: ["utils"],
    files: ["registry/new-york-v4/themes/my-theme.tsx"],
    dependencies: [],
    description: "A brief description of your theme",
  },
]
```

## 🧪 Testing

### Run Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:dev
```

### Build and Test

```bash
# Build everything
pnpm build

# Test the build
pnpm preview
```

## 📝 Documentation

### Update Documentation

1. Add component documentation in `apps/v4/content/docs/`
2. Update examples in `apps/v4/app/(app)/examples/`
3. Add to the navigation in `apps/v4/lib/config.ts`

### Build Documentation

```bash
pnpm docs:build
```

## 🔄 Submitting Changes

### 1. Create a Branch

```bash
git checkout -b feature/my-new-component
```

### 2. Make Changes

- Add your component/icon/theme
- Update registry files
- Add examples and documentation
- Test everything works

### 3. Commit and Push

```bash
git add .
git commit -m "feat: add my new component"
git push origin feature/my-new-component
```

### 4. Create Pull Request

1. Go to GitHub and create a PR
2. Fill out the PR template
3. Request review from maintainers

## 📋 PR Checklist

Before submitting a PR, ensure:

- [ ] Component follows RaynaUI patterns
- [ ] Component is accessible
- [ ] Component is responsive
- [ ] Component has TypeScript types
- [ ] Component has examples
- [ ] Component is documented
- [ ] Tests pass
- [ ] Build succeeds
- [ ] No console errors
- [ ] Follows code style guidelines

## 🎯 Guidelines

### Component Guidelines

- **Accessibility**: All components must be accessible
- **Responsive**: Components should work on all screen sizes
- **Customizable**: Use `class-variance-authority` for variants
- **TypeScript**: Full TypeScript support required
- **Performance**: Components should be performant

### Code Style

- Use TypeScript
- Follow existing patterns
- Use meaningful names
- Add JSDoc comments
- Keep components simple and focused

### File Structure

```
apps/v4/
├── components/ui/           # UI components
├── components/ui/icons/     # Icon components
├── registry/               # Registry files
├── app/(app)/examples/     # Component examples
└── content/docs/           # Documentation
```

## 🤝 Community

- Join our [Discord](https://discord.gg/raynaui)
- Follow us on [Twitter](https://twitter.com/raynaui)
- Star the repository
- Share your creations

## 📄 License

By contributing to RaynaUI, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to RaynaUI! 🎉
