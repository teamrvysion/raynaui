#!/usr/bin/env node
import { Command } from 'commander';
import prompts from 'prompts';
import ora from 'ora';
import kleur from 'kleur';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs-extra';
import path from 'path';

// src/templates.ts
function generateComponentTemplate(generation, _options = {}) {
  const componentName = generation.name;
  const componentNameLower = componentName.charAt(0).toLowerCase() + componentName.slice(1);
  let componentCode = `"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const ${componentName}Variants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
`;
  if (generation.variants && generation.variants.length > 0) {
    componentCode += `    variants: {
`;
    generation.variants.forEach((variant) => {
      componentCode += `      ${variant.name}: {
`;
      variant.values.forEach((value) => {
        componentCode += `        "${value}": "${value}-classes",
`;
      });
      componentCode += `      },
`;
    });
    componentCode += `    },
    defaultVariants: {
`;
    generation.variants.forEach((variant) => {
      componentCode += `      ${variant.name}: "${variant.defaultValue || variant.values[0]}",
`;
    });
    componentCode += `    },
`;
  }
  componentCode += `  }
)

export interface ${componentName}Props
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof ${componentName}Variants> {
`;
  if (generation.props && generation.props.length > 0) {
    generation.props.forEach((prop) => {
      const required = prop.required ? "" : "?";
      const defaultValue = prop.defaultValue ? ` = ${prop.defaultValue}` : "";
      componentCode += `  /** ${prop.description || prop.name} */
  ${prop.name}${required}: ${prop.type}${defaultValue}
`;
    });
  }
  componentCode += `}

const ${componentName} = React.forwardRef<HTMLDivElement, ${componentName}Props>(
  ({ className, ${generation.variants?.map((v) => v.name).join(", ") || ""}${generation.props?.map((p) => p.name).join(", ") || ""}...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(${componentName}Variants({ ${generation.variants?.map((v) => v.name).join(", ") || ""}className }))}
        ${generation.props?.map((p) => `${p.name}={${p.name}}`).join("\n        ") || ""}
        {...props}
      />
    )
  }
)
${componentName}.displayName = "${componentName}"

export { ${componentName}, ${componentName}Variants }
`;
  let exampleCode = `import { ${componentName} } from "@/components/ui/${componentNameLower}"

export default function ${componentName}Example() {
  return (
    <div className="space-y-4">
      <${componentName}>
        Default ${componentName}
      </${componentName}>
`;
  if (generation.variants && generation.variants.length > 0) {
    generation.variants.forEach((variant) => {
      exampleCode += `      <${componentName} ${variant.name}="${variant.values[0]}">
        ${variant.name} variant
      </${componentName}>
`;
    });
  }
  exampleCode += `    </div>
  )
}
`;
  let testCode = `import { render, screen } from "@testing-library/react"
import { ${componentName} } from "@/components/ui/${componentNameLower}"

describe("${componentName}", () => {
  it("renders correctly", () => {
    render(<${componentName}>Test content</${componentName}>)
    expect(screen.getByText("Test content")).toBeInTheDocument()
  })
`;
  if (generation.variants && generation.variants.length > 0) {
    generation.variants.forEach((variant) => {
      testCode += `
  it("applies ${variant.name} variant correctly", () => {
    render(<${componentName} ${variant.name}="${variant.values[0]}">Test</${componentName}>)
    const element = screen.getByText("Test")
    expect(element).toHaveClass("${variant.values[0]}-classes")
  })
`;
    });
  }
  testCode += `})
`;
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
`;
  if (generation.props && generation.props.length > 0) {
    docsCode += `
## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
`;
    generation.props.forEach((prop) => {
      docsCode += `| ${prop.name} | ${prop.type} | ${prop.defaultValue || "-"} | ${prop.description || prop.name} |
`;
    });
  }
  if (generation.variants && generation.variants.length > 0) {
    docsCode += `
## Variants

`;
    generation.variants.forEach((variant) => {
      docsCode += `### ${variant.name}

`;
      variant.values.forEach((value) => {
        docsCode += `- \`${value}\` - ${value} variant
`;
      });
      docsCode += `
`;
    });
  }
  docsCode += `
## Examples

${generation.examples?.join("\n\n") || ""}
`;
  return {
    component: componentCode,
    example: exampleCode,
    test: testCode,
    documentation: docsCode
  };
}

// src/ai-engine.ts
var AIGeneratorEngine = class {
  constructor(config = {}) {
    this.config = {
      model: "claude-3-5-sonnet-20241022",
      temperature: 0.7,
      maxTokens: 4e3,
      ...config
    };
    if (this.config.apiKey) {
      this.client = new Anthropic({
        apiKey: this.config.apiKey,
        baseURL: this.config.baseUrl
      });
    } else {
      throw new Error("API key is required for AI generation");
    }
  }
  async generateComponent(prompt, options = {}) {
    try {
      const systemPrompt = this.buildSystemPrompt(options.style);
      const userPrompt = this.buildUserPrompt(prompt, options);
      const response = await this.client.messages.create({
        model: this.config.model,
        max_tokens: this.config.maxTokens || 4e3,
        temperature: this.config.temperature,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: userPrompt
          }
        ]
      });
      const content = response.content[0];
      if (content.type !== "text") {
        throw new Error("Unexpected response type from AI");
      }
      const generation = this.parseAIResponse(content.text);
      const template = generateComponentTemplate(generation, { style: options.style });
      const component = {
        name: generation.name,
        description: generation.description,
        type: "components:ui",
        files: [
          {
            path: `components/ui/${generation.name.toLowerCase()}.tsx`,
            content: template.component,
            type: "registry:component"
          }
        ],
        dependencies: generation.dependencies || [],
        registryDependencies: generation.registryDependencies || ["utils"]
      };
      if (options.includeExample && template.example) {
        component.files.push({
          path: `app/(app)/examples/${generation.name.toLowerCase()}/page.tsx`,
          content: template.example,
          type: "registry:page"
        });
      }
      if (options.includeTest && template.test) {
        component.files.push({
          path: `__tests__/${generation.name.toLowerCase()}.test.tsx`,
          content: template.test,
          type: "registry:file"
        });
      }
      if (options.includeDocumentation && template.documentation) {
        component.files.push({
          path: `content/docs/components/${generation.name.toLowerCase()}.mdx`,
          content: template.documentation,
          type: "registry:file"
        });
      }
      return {
        success: true,
        component,
        files: component.files.map((file) => ({
          path: file.path,
          content: file.content
        }))
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      };
    }
  }
  buildSystemPrompt(_style = "new-york") {
    return `You are an expert React component generator specializing in RaynaUI components. You understand RaynaUI's design patterns, component structure, and best practices.

Your task is to generate RaynaUI-style components based on user descriptions. You must follow these guidelines:

1. **Component Structure**: Use the standard RaynaUI component pattern with:
   - "use client" directive
   - React.forwardRef for proper ref forwarding
   - class-variance-authority (cva) for variants
   - TypeScript interfaces extending HTMLAttributes
   - Proper displayName

2. **Styling**: Use Tailwind CSS classes following RaynaUI conventions:
   - Consistent spacing and sizing
   - Proper color schemes
   - Accessibility-focused design
   - Responsive design patterns

3. **Variants**: Use class-variance-authority for component variants:
   - Common variants: variant (default, secondary, destructive, outline, ghost, link)
   - Size variants: size (default, sm, lg, xl)
   - State variants: disabled, loading, etc.

4. **Props**: Include relevant props with proper TypeScript types:
   - children for content
   - className for custom styling
   - Event handlers (onClick, onChange, etc.)
   - Component-specific props

5. **Accessibility**: Ensure components are accessible:
   - Proper ARIA attributes
   - Keyboard navigation support
   - Focus management
   - Screen reader compatibility

6. **Dependencies**: Include necessary dependencies:
   - class-variance-authority
   - lucide-react (for icons)
   - framer-motion (for animations, if needed)

Respond with a JSON object containing the component specification in this format:
{
  "name": "ComponentName",
  "description": "Brief description of the component",
  "props": [
    {
      "name": "propName",
      "type": "string | number | boolean",
      "required": true/false,
      "description": "Prop description",
      "defaultValue": "default value if any"
    }
  ],
  "variants": [
    {
      "name": "variantName",
      "values": ["value1", "value2"],
      "defaultValue": "value1"
    }
  ],
  "dependencies": ["dependency1", "dependency2"],
  "registryDependencies": ["utils", "button"]
}`;
  }
  buildUserPrompt(prompt, options) {
    return `Generate a RaynaUI component based on this description:

${prompt}

Please provide the component specification in JSON format as described in the system prompt.

Additional requirements:
- Style: ${options.style || "new-york"}
- Include example: ${options.includeExample || false}
- Include test: ${options.includeTest || false}
- Include documentation: ${options.includeDocumentation || false}

Respond only with the JSON specification, no additional text.`;
  }
  parseAIResponse(response) {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in AI response");
      }
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        name: parsed.name,
        description: parsed.description,
        props: parsed.props || [],
        variants: parsed.variants || [],
        dependencies: parsed.dependencies || [],
        registryDependencies: parsed.registryDependencies || ["utils"]
      };
    } catch (error) {
      throw new Error(`Failed to parse AI response: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
  async generateMultipleComponents(prompts2, options = {}) {
    const results = [];
    for (const prompt of prompts2) {
      const result = await this.generateComponent(prompt, options);
      results.push(result);
    }
    return results;
  }
};
var FileSystemManager = class {
  constructor(baseDir = process.cwd()) {
    this.baseDir = baseDir;
  }
  async writeGeneratedComponent(result, options = {}) {
    const outputDir = options.outputDir || this.baseDir;
    const files = [];
    const errors = [];
    if (!result.success || !result.files) {
      return {
        success: false,
        files: [],
        errors: ["No files to write"]
      };
    }
    for (const file of result.files) {
      try {
        const filePath = path.join(outputDir, file.path);
        const dirPath = path.dirname(filePath);
        await fs.ensureDir(dirPath);
        if (await fs.pathExists(filePath) && !options.overwrite) {
          errors.push(`File already exists: ${file.path} (use --overwrite to overwrite)`);
          continue;
        }
        await fs.writeFile(filePath, file.content, "utf-8");
        files.push(file.path);
        console.log(`\u2705 Created: ${file.path}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        errors.push(`Failed to write ${file.path}: ${errorMessage}`);
      }
    }
    return {
      success: errors.length === 0,
      files,
      errors
    };
  }
  async writeMultipleComponents(results, options = {}) {
    let totalFiles = 0;
    const allErrors = [];
    for (const result of results) {
      const writeResult = await this.writeGeneratedComponent(result, options);
      totalFiles += writeResult.files.length;
      allErrors.push(...writeResult.errors);
    }
    return {
      success: allErrors.length === 0,
      totalFiles,
      errors: allErrors
    };
  }
  async createProjectStructure(baseDir) {
    const structure = [
      "components/ui",
      "app/(app)/examples",
      "__tests__",
      "content/docs/components",
      "lib"
    ];
    for (const dir of structure) {
      await fs.ensureDir(path.join(baseDir, dir));
    }
    const utilsPath = path.join(baseDir, "lib/utils.ts");
    if (!await fs.pathExists(utilsPath)) {
      const utilsContent = `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`;
      await fs.writeFile(utilsPath, utilsContent, "utf-8");
    }
  }
  async validateProjectStructure(baseDir) {
    const requiredDirs = [
      "components/ui",
      "lib"
    ];
    const missing = [];
    for (const dir of requiredDirs) {
      const dirPath = path.join(baseDir, dir);
      if (!await fs.pathExists(dirPath)) {
        missing.push(dir);
      }
    }
    const utilsPath = path.join(baseDir, "lib/utils.ts");
    if (!await fs.pathExists(utilsPath)) {
      missing.push("lib/utils.ts");
    }
    return {
      valid: missing.length === 0,
      missing
    };
  }
  async readExistingComponent(componentName, baseDir) {
    const componentPath = path.join(baseDir, "components/ui", `${componentName.toLowerCase()}.tsx`);
    try {
      if (await fs.pathExists(componentPath)) {
        return await fs.readFile(componentPath, "utf-8");
      }
    } catch (error) {
      console.warn(`Failed to read existing component: ${error}`);
    }
    return null;
  }
  async backupExistingFile(filePath) {
    try {
      if (await fs.pathExists(filePath)) {
        const backupPath = `${filePath}.backup.${Date.now()}`;
        await fs.copy(filePath, backupPath);
        return backupPath;
      }
    } catch (error) {
      console.warn(`Failed to backup file: ${error}`);
    }
    return null;
  }
  async cleanupBackups(baseDir) {
    try {
      const files = await fs.readdir(baseDir, { recursive: true });
      const backupFiles = files.filter(
        (file) => typeof file === "string" && file.includes(".backup.")
      );
      for (const backupFile of backupFiles) {
        const backupPath = path.join(baseDir, backupFile);
        await fs.remove(backupPath);
        console.log(`\u{1F5D1}\uFE0F  Removed backup: ${backupFile}`);
      }
    } catch (error) {
      console.warn(`Failed to cleanup backups: ${error}`);
    }
  }
};

// src/cli.ts
var program = new Command();
program.name("raynaui-ai").description("AI-powered component generator for RaynaUI").version("1.0.0");
program.command("generate").description("Generate a RaynaUI component using AI").argument("[prompt]", "Description of the component to generate").option("-s, --style <style>", "Component style (new-york, default)", "new-york").option("-o, --output <dir>", "Output directory", ".").option("--no-example", "Skip generating example").option("--no-docs", "Skip generating documentation").option("--test", "Include test file").option("--overwrite", "Overwrite existing files").option("--api-key <key>", "AI API key").option("--model <model>", "AI model to use", "claude-3-5-sonnet-20241022").action(async (prompt, options) => {
  try {
    let apiKey = options.apiKey || process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      const response = await prompts({
        type: "password",
        name: "apiKey",
        message: "Enter your Anthropic API key:"
      });
      apiKey = response.apiKey;
    }
    if (!apiKey) {
      console.error(kleur.red("\u274C API key is required"));
      process.exit(1);
    }
    let componentPrompt = prompt;
    if (!componentPrompt) {
      const response = await prompts({
        type: "text",
        name: "prompt",
        message: "Describe the component you want to generate:",
        validate: (value) => value.length > 0 ? true : "Description is required"
      });
      componentPrompt = response.prompt;
    }
    if (!componentPrompt) {
      console.error(kleur.red("\u274C Component description is required"));
      process.exit(1);
    }
    const engine = new AIGeneratorEngine({
      apiKey,
      model: options.model
    });
    const fsManager = new FileSystemManager(options.output);
    const validation = await fsManager.validateProjectStructure(options.output);
    if (!validation.valid) {
      console.log(kleur.yellow("\u26A0\uFE0F  Missing project structure:"));
      validation.missing.forEach((item) => console.log(`   - ${item}`));
      const response = await prompts({
        type: "confirm",
        name: "create",
        message: "Create missing project structure?",
        initial: true
      });
      if (response.create) {
        await fsManager.createProjectStructure(options.output);
        console.log(kleur.green("\u2705 Project structure created"));
      } else {
        console.error(kleur.red("\u274C Cannot proceed without proper project structure"));
        process.exit(1);
      }
    }
    const spinner = ora("Generating component...").start();
    const result = await engine.generateComponent(componentPrompt, {
      style: options.style,
      includeExample: options.example !== false,
      includeTest: options.test,
      includeDocumentation: options.docs !== false
    });
    if (!result.success) {
      spinner.fail("Failed to generate component");
      console.error(kleur.red(`\u274C ${result.error}`));
      process.exit(1);
    }
    spinner.succeed("Component generated successfully");
    const writeResult = await fsManager.writeGeneratedComponent(result, {
      outputDir: options.output,
      overwrite: options.overwrite
    });
    if (!writeResult.success) {
      console.error(kleur.red("\u274C Failed to write some files:"));
      writeResult.errors.forEach((error) => console.error(`   - ${error}`));
      process.exit(1);
    }
    console.log(kleur.green(`
\u2705 Generated ${writeResult.files.length} files:`));
    writeResult.files.forEach((file) => console.log(`   - ${file}`));
    console.log(kleur.cyan("\n\u{1F389} Component generated successfully!"));
    console.log(kleur.cyan("Next steps:"));
    console.log("   1. Review the generated component");
    console.log("   2. Install any missing dependencies");
    console.log("   3. Test the component in your app");
    console.log("   4. Customize as needed");
  } catch (error) {
    console.error(kleur.red("\u274C An error occurred:"));
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
});
program.command("generate-multiple").description("Generate multiple RaynaUI components using AI").option("-f, --file <file>", "File containing component descriptions (one per line)").option("-s, --style <style>", "Component style (new-york, default)", "new-york").option("-o, --output <dir>", "Output directory", ".").option("--no-example", "Skip generating examples").option("--no-docs", "Skip generating documentation").option("--test", "Include test files").option("--overwrite", "Overwrite existing files").option("--api-key <key>", "AI API key").option("--model <model>", "AI model to use", "claude-3-5-sonnet-20241022").action(async (options) => {
  try {
    let apiKey = options.apiKey || process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      const response = await prompts({
        type: "password",
        name: "apiKey",
        message: "Enter your Anthropic API key:"
      });
      apiKey = response.apiKey;
    }
    if (!apiKey) {
      console.error(kleur.red("\u274C API key is required"));
      process.exit(1);
    }
    let componentPrompts = [];
    if (options.file) {
      const fs2 = await import('fs-extra');
      const content = await fs2.readFile(options.file, "utf-8");
      componentPrompts = content.split("\n").filter((line) => line.trim().length > 0);
    } else {
      const response = await prompts({
        type: "text",
        name: "prompts",
        message: "Enter component descriptions (separated by semicolons):",
        validate: (value) => value.length > 0 ? true : "At least one description is required"
      });
      componentPrompts = response.prompts.split(";").map((p) => p.trim()).filter((p) => p.length > 0);
    }
    if (componentPrompts.length === 0) {
      console.error(kleur.red("\u274C No component descriptions provided"));
      process.exit(1);
    }
    const engine = new AIGeneratorEngine({
      apiKey,
      model: options.model
    });
    const fsManager = new FileSystemManager(options.output);
    const validation = await fsManager.validateProjectStructure(options.output);
    if (!validation.valid) {
      console.log(kleur.yellow("\u26A0\uFE0F  Missing project structure:"));
      validation.missing.forEach((item) => console.log(`   - ${item}`));
      const response = await prompts({
        type: "confirm",
        name: "create",
        message: "Create missing project structure?",
        initial: true
      });
      if (response.create) {
        await fsManager.createProjectStructure(options.output);
        console.log(kleur.green("\u2705 Project structure created"));
      } else {
        console.error(kleur.red("\u274C Cannot proceed without proper project structure"));
        process.exit(1);
      }
    }
    const spinner = ora(`Generating ${componentPrompts.length} components...`).start();
    const results = await engine.generateMultipleComponents(componentPrompts, {
      style: options.style,
      includeExample: options.example !== false,
      includeTest: options.test,
      includeDocumentation: options.docs !== false
    });
    const successfulResults = results.filter((r) => r.success);
    const failedResults = results.filter((r) => !r.success);
    if (failedResults.length > 0) {
      spinner.warn(`Generated ${successfulResults.length}/${componentPrompts.length} components`);
      console.error(kleur.red(`\u274C Failed to generate ${failedResults.length} components:`));
      failedResults.forEach((result, index) => {
        console.error(`   - ${componentPrompts[index]}: ${result.error}`);
      });
    } else {
      spinner.succeed(`Generated ${successfulResults.length} components successfully`);
    }
    const writeResult = await fsManager.writeMultipleComponents(successfulResults, {
      outputDir: options.output,
      overwrite: options.overwrite
    });
    if (!writeResult.success) {
      console.error(kleur.red("\u274C Failed to write some files:"));
      writeResult.errors.forEach((error) => console.error(`   - ${error}`));
      process.exit(1);
    }
    console.log(kleur.green(`
\u2705 Generated ${writeResult.totalFiles} files total`));
  } catch (error) {
    console.error(kleur.red("\u274C An error occurred:"));
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
});
program.command("init").description("Initialize RaynaUI project structure").option("-o, --output <dir>", "Output directory", ".").action(async (options) => {
  try {
    const fsManager = new FileSystemManager(options.output);
    const spinner = ora("Creating project structure...").start();
    await fsManager.createProjectStructure(options.output);
    spinner.succeed("Project structure created successfully");
    console.log(kleur.green("\n\u2705 RaynaUI project structure initialized!"));
    console.log(kleur.cyan("Created directories:"));
    console.log("   - components/ui");
    console.log("   - app/(app)/examples");
    console.log("   - __tests__");
    console.log("   - content/docs/components");
    console.log("   - lib");
    console.log("   - lib/utils.ts");
  } catch (error) {
    console.error(kleur.red("\u274C An error occurred:"));
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
});
if (process.argv.length === 2) {
  program.help();
}
program.parse();
//# sourceMappingURL=cli.mjs.map
//# sourceMappingURL=cli.mjs.map