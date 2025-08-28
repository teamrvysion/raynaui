import { ComponentGeneration, ComponentTemplate } from "./types"

export const RAYNAUI_COMPONENT_TEMPLATE = `"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const {{componentName}}Variants = cva(
  "{{baseClasses}}",
  {
    {{#if hasVariants}}
    variants: {
      {{#each variants}}
      {{name}}: {
        {{#each values}}
        "{{this}}": "{{this}}-classes",
        {{/each}}
      },
      {{/each}}
    },
    defaultVariants: {
      {{#each variants}}
      {{name}}: "{{defaultValue}}",
      {{/each}}
    },
    {{/if}}
  }
)

export interface {{componentName}}Props
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof {{componentName}}Variants> {
  {{#each props}}
  /** {{description}} */
  {{name}}{{#unless required}}?{{/unless}}: {{type}}{{#if defaultValue}} = {{defaultValue}}{{/if}}
  {{/each}}
}

const {{componentName}} = React.forwardRef<HTMLDivElement, {{componentName}}Props>(
  ({ className, {{#each variants}}{{name}}, {{/each}}{{#each props}}{{name}}, {{/each}}...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn({{componentName}}Variants({ {{#each variants}}{{name}}, {{/each}}className }))}
        {{#each props}}
        {{name}}={{{name}}}
        {{/each}}
        {...props}
      />
    )
  }
)
{{componentName}}.displayName = "{{componentName}}"

export { {{componentName}}, {{componentName}}Variants }
`

export const RAYNAUI_EXAMPLE_TEMPLATE = `import { {{componentName}} } from "@/components/ui/{{componentNameLower}}"

export default function {{componentName}}Example() {
  return (
    <div className="space-y-4">
      <{{componentName}}>
        Default {{componentName}}
      </{{componentName}}>
      {{#each variants}}
      <{{../componentName}} {{name}}="{{firstValue}}">
        {{name}} variant
      </{{../componentName}}>
      {{/each}}
    </div>
  )
}
`

export const RAYNAUI_TEST_TEMPLATE = `import { render, screen } from "@testing-library/react"
import { {{componentName}} } from "@/components/ui/{{componentNameLower}}"

describe("{{componentName}}", () => {
  it("renders correctly", () => {
    render(<{{componentName}}>Test content</{{componentName}}>)
    expect(screen.getByText("Test content")).toBeInTheDocument()
  })

  {{#each variants}}
  it("applies {{name}} variant correctly", () => {
    render(<{{../componentName}} {{name}}="{{firstValue}}">Test</{{../componentName}}>)
    const element = screen.getByText("Test")
    expect(element).toHaveClass("{{firstValue}}-classes")
  })
  {{/each}}
})
`

export const RAYNAUI_DOCS_TEMPLATE = `---
title: {{componentName}}
description: {{description}}
---

The {{componentName}} component provides {{description}}.

## Usage

\`\`\`tsx
import { {{componentName}} } from "@/components/ui/{{componentNameLower}}"

export default function Example() {
  return (
    <{{componentName}}>
      {{componentName}} content
    </{{componentName}}>
  )
}
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
{{#each props}}
| {{name}} | {{type}} | {{defaultValue}} | {{description}} |
{{/each}}

## Variants

{{#each variants}}
### {{name}}

{{#each values}}
- \`{{this}}\` - {{this}} variant
{{/each}}

{{/each}}

## Examples

{{#each examples}}
{{this}}

{{/each}}
`

export function generateComponentTemplate(
  generation: ComponentGeneration,
  _options: { style?: string } = {}
): ComponentTemplate {
  const componentName = generation.name
  const componentNameLower = componentName.charAt(0).toLowerCase() + componentName.slice(1)
  
  // Generate component code manually instead of using complex templates
  let componentCode = `"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const ${componentName}Variants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
`

  // Add variants if they exist
  if (generation.variants && generation.variants.length > 0) {
    componentCode += `    variants: {
`
    generation.variants.forEach(variant => {
      componentCode += `      ${variant.name}: {
`
      variant.values.forEach(value => {
        componentCode += `        "${value}": "${value}-classes",
`
      })
      componentCode += `      },
`
    })
    componentCode += `    },
    defaultVariants: {
`
    generation.variants.forEach(variant => {
      componentCode += `      ${variant.name}: "${variant.defaultValue || variant.values[0]}",
`
    })
    componentCode += `    },
`
  }

  componentCode += `  }
)

export interface ${componentName}Props
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof ${componentName}Variants> {
`

  // Add props if they exist
  if (generation.props && generation.props.length > 0) {
    generation.props.forEach(prop => {
      const required = prop.required ? "" : "?"
      const defaultValue = prop.defaultValue ? ` = ${prop.defaultValue}` : ""
      componentCode += `  /** ${prop.description || prop.name} */
  ${prop.name}${required}: ${prop.type}${defaultValue}
`
    })
  }

  componentCode += `}

const ${componentName} = React.forwardRef<HTMLDivElement, ${componentName}Props>(
  ({ className, ${generation.variants?.map(v => v.name).join(", ") || ""}${generation.props?.map(p => p.name).join(", ") || ""}...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(${componentName}Variants({ ${generation.variants?.map(v => v.name).join(", ") || ""}className }))}
        ${generation.props?.map(p => `${p.name}={${p.name}}`).join("\n        ") || ""}
        {...props}
      />
    )
  }
)
${componentName}.displayName = "${componentName}"

export { ${componentName}, ${componentName}Variants }
`

  // Generate example
  let exampleCode = `import { ${componentName} } from "@/components/ui/${componentNameLower}"

export default function ${componentName}Example() {
  return (
    <div className="space-y-4">
      <${componentName}>
        Default ${componentName}
      </${componentName}>
`
  
  if (generation.variants && generation.variants.length > 0) {
    generation.variants.forEach(variant => {
      exampleCode += `      <${componentName} ${variant.name}="${variant.values[0]}">
        ${variant.name} variant
      </${componentName}>
`
    })
  }

  exampleCode += `    </div>
  )
}
`

  // Generate test
  let testCode = `import { render, screen } from "@testing-library/react"
import { ${componentName} } from "@/components/ui/${componentNameLower}"

describe("${componentName}", () => {
  it("renders correctly", () => {
    render(<${componentName}>Test content</${componentName}>)
    expect(screen.getByText("Test content")).toBeInTheDocument()
  })
`
  
  if (generation.variants && generation.variants.length > 0) {
    generation.variants.forEach(variant => {
      testCode += `
  it("applies ${variant.name} variant correctly", () => {
    render(<${componentName} ${variant.name}="${variant.values[0]}">Test</${componentName}>)
    const element = screen.getByText("Test")
    expect(element).toHaveClass("${variant.values[0]}-classes")
  })
`
    })
  }

  testCode += `})
`

  // Generate documentation
  let docsCode = `---
title: ${componentName}
description: ${generation.description}
---

The ${componentName} component provides ${generation.description}.

## Usage

\`\`\`tsx
import { ${componentName} } from "@/components/ui/${componentNameLower}"

export default function Example() {
  return (
    <${componentName}>
      ${componentName} content
    </${componentName}>
  )
}
\`\`\`
`

  if (generation.props && generation.props.length > 0) {
    docsCode += `
## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
`
    generation.props.forEach(prop => {
      docsCode += `| ${prop.name} | ${prop.type} | ${prop.defaultValue || "-"} | ${prop.description || prop.name} |
`
    })
  }

  if (generation.variants && generation.variants.length > 0) {
    docsCode += `
## Variants

`
    generation.variants.forEach(variant => {
      docsCode += `### ${variant.name}

`
      variant.values.forEach(value => {
        docsCode += `- \`${value}\` - ${value} variant
`
      })
      docsCode += `
`
    })
  }

  docsCode += `
## Examples

${generation.examples?.join("\n\n") || ""}
`

  return {
    component: componentCode,
    example: exampleCode,
    test: testCode,
    documentation: docsCode,
  }
} 