# RaynaUI AI Generator

An AI-powered component generator for RaynaUI that creates high-quality, accessible React components using natural language descriptions.

## Features

- 🤖 **AI-Powered Generation**: Generate components using natural language descriptions
- 🎨 **RaynaUI Patterns**: Follows RaynaUI design patterns and conventions
- 📝 **Complete Output**: Generates components, examples, tests, and documentation
- 🔧 **CLI Interface**: Easy-to-use command-line interface
- 📦 **Project Structure**: Automatically creates proper project structure
- 🎯 **TypeScript Support**: Full TypeScript support with proper types
- ♿ **Accessibility**: Built-in accessibility features and ARIA support

## Installation

```bash
npm install @raynaui/ai-generator
```

## Quick Start

### 1. Initialize Project Structure

```bash
npx raynaui-ai init
```

This creates the necessary directory structure:
```
components/ui/
app/(app)/examples/
__tests__/
content/docs/components/
lib/
lib/utils.ts
```

### 2. Generate Your First Component

```bash
npx raynaui-ai generate "A button component with different variants and sizes"
```

### 3. Set Up API Key

You'll need an Anthropic API key. You can:

- Set it as an environment variable: `export ANTHROPIC_API_KEY=your_key_here`
- Pass it via command line: `--api-key your_key_here`
- Enter it when prompted

## CLI Usage

### Generate a Single Component

```bash
npx raynaui-ai generate "description" [options]
```

**Options:**
- `-s, --style <style>` - Component style (new-york, default)
- `-o, --output <dir>` - Output directory
- `--no-example` - Skip generating example
- `--no-docs` - Skip generating documentation
- `--test` - Include test file
- `--overwrite` - Overwrite existing files
- `--api-key <key>` - AI API key
- `--model <model>` - AI model to use

**Examples:**

```bash
# Generate a simple button
npx raynaui-ai generate "A button component with primary and secondary variants"

# Generate with custom options
npx raynaui-ai generate "A card component with header, body, and footer" \
  --style new-york \
  --test \
  --output ./src/components

# Generate without examples
npx raynaui-ai generate "A modal component" --no-example --no-docs
```

### Generate Multiple Components

```bash
npx raynaui-ai generate-multiple [options]
```

**Options:**
- `-f, --file <file>` - File containing component descriptions (one per line)
- `-s, --style <style>` - Component style
- `-o, --output <dir>` - Output directory
- `--no-example` - Skip generating examples
- `--no-docs` - Skip generating documentation
- `--test` - Include test files
- `--overwrite` - Overwrite existing files

**Examples:**

```bash
# Generate from file
echo "A button component
A card component
A modal component" > components.txt
npx raynaui-ai generate-multiple --file components.txt

# Generate interactively
npx raynaui-ai generate-multiple
# Then enter: "A button component; A card component; A modal component"
```

### Initialize Project Structure

```bash
npx raynaui-ai init [options]
```

**Options:**
- `-o, --output <dir>` - Output directory

## Programmatic Usage

### Basic Usage

```typescript
import { RaynaUIAIGenerator } from '@raynaui/ai-generator'

const generator = new RaynaUIAIGenerator({
  apiKey: 'your-anthropic-api-key'
})

// Generate a component
const result = await generator.generateComponent(
  'A button component with different variants',
  {
    style: 'new-york',
    includeExample: true,
    includeTest: true,
    includeDocumentation: true
  }
)

if (result.success) {
  console.log('Component generated:', result.component)
}
```

### Generate and Write to File System

```typescript
import { RaynaUIAIGenerator } from '@raynaui/ai-generator'

const generator = new RaynaUIAIGenerator({
  apiKey: 'your-anthropic-api-key'
})

// Generate and write component
const result = await generator.generateAndWriteComponent(
  'A card component with header and body',
  {
    outputDir: './src',
    overwrite: false
  }
)

console.log('Files created:', result.files)
console.log('Errors:', result.errors)
```

### Convenience Functions

```typescript
import { 
  generateRaynaUIComponent,
  generateAndWriteRaynaUIComponent 
} from '@raynaui/ai-generator'

// Quick generation
const result = await generateRaynaUIComponent(
  'A modal component',
  { apiKey: 'your-key' },
  { style: 'new-york' }
)

// Quick generation and writing
const writeResult = await generateAndWriteRaynaUIComponent(
  'A form component',
  { apiKey: 'your-key' },
  { outputDir: './src' }
)
```

## Generated Component Structure

The AI generator creates components following RaynaUI patterns:

```tsx
"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const ButtonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-md px-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof ButtonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(ButtonVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, ButtonVariants }
```

## Generated Files

For each component, the generator can create:

1. **Component File** (`components/ui/component-name.tsx`)
   - Main component implementation
   - TypeScript interfaces
   - Variants using class-variance-authority

2. **Example File** (`app/(app)/examples/component-name/page.tsx`)
   - Usage examples
   - Different variant demonstrations
   - Interactive examples

3. **Test File** (`__tests__/component-name.test.tsx`)
   - Unit tests
   - Variant testing
   - Accessibility testing

4. **Documentation** (`content/docs/components/component-name.mdx`)
   - Component documentation
   - Props table
   - Usage examples
   - Best practices

## Configuration

### Environment Variables

- `ANTHROPIC_API_KEY` - Your Anthropic API key

### AI Configuration

```typescript
const config = {
  apiKey: 'your-api-key',
  model: 'claude-3-5-sonnet-20241022', // Default model
  temperature: 0.7, // Creativity level (0-1)
  maxTokens: 4000, // Maximum response length
  baseUrl: 'https://api.anthropic.com' // Custom API endpoint
}
```

### Generation Options

```typescript
const options = {
  style: 'new-york', // Component style
  includeExample: true, // Generate example file
  includeTest: false, // Generate test file
  includeDocumentation: true, // Generate documentation
  outputDir: './src', // Output directory
  overwrite: false // Overwrite existing files
}
```

## Best Practices

### Writing Good Prompts

1. **Be Specific**: Describe the component's purpose and behavior
   ```
   ✅ "A button component with primary, secondary, and destructive variants"
   ❌ "A button"
   ```

2. **Include Variants**: Specify the different states or styles
   ```
   ✅ "A card component with header, body, and footer sections, plus different color themes"
   ❌ "A card"
   ```

3. **Mention Interactions**: Describe how the component should behave
   ```
   ✅ "A modal component that opens/closes with animations and supports different sizes"
   ❌ "A modal"
   ```

4. **Specify Props**: Mention important props or features
   ```
   ✅ "A form input component with validation states, error messages, and different input types"
   ❌ "An input"
   ```

### Project Structure

The generator expects this structure:
```
your-project/
├── components/ui/          # Generated components
├── app/(app)/examples/     # Component examples
├── __tests__/             # Test files
├── content/docs/components/ # Documentation
├── lib/
│   └── utils.ts           # Utility functions
└── package.json
```

## Troubleshooting

### Common Issues

1. **API Key Error**
   ```
   ❌ API key is required
   ```
   Solution: Set your Anthropic API key via environment variable or command line

2. **Project Structure Error**
   ```
   ❌ Cannot proceed without proper project structure
   ```
   Solution: Run `npx raynaui-ai init` to create the required structure

3. **File Already Exists**
   ```
   ❌ File already exists: components/ui/button.tsx
   ```
   Solution: Use `--overwrite` flag or rename the existing file

4. **AI Generation Failed**
   ```
   ❌ Failed to parse AI response
   ```
   Solution: Try a more specific prompt or check your API key

### Getting Help

- Check the [RaynaUI documentation](https://raynaui.com)
- Open an issue on GitHub
- Join our Discord community

## Contributing

We welcome contributions! Please see our [Contributing Guide](../../CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](../../LICENSE.md) for details. 