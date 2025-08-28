#!/usr/bin/env node

import { Command } from "commander"
import prompts from "prompts"
import ora from "ora"
import kleur from "kleur"
import { AIGeneratorEngine } from "./ai-engine"
import { FileSystemManager } from "./file-system"

const program = new Command()

program
  .name("raynaui-ai")
  .description("AI-powered component generator for RaynaUI")
  .version("1.0.0")

// Generate a single component
program
  .command("generate")
  .description("Generate a RaynaUI component using AI")
  .argument("[prompt]", "Description of the component to generate")
  .option("-s, --style <style>", "Component style (new-york, default)", "new-york")
  .option("-o, --output <dir>", "Output directory", ".")
  .option("--no-example", "Skip generating example")
  .option("--no-docs", "Skip generating documentation")
  .option("--test", "Include test file")
  .option("--overwrite", "Overwrite existing files")
  .option("--api-key <key>", "AI API key")
  .option("--model <model>", "AI model to use", "claude-3-5-sonnet-20241022")
  .action(async (prompt, options) => {
    try {
      // Get API key
      let apiKey = options.apiKey || process.env.ANTHROPIC_API_KEY
      if (!apiKey) {
        const response = await prompts({
          type: "password",
          name: "apiKey",
          message: "Enter your Anthropic API key:",
        })
        apiKey = response.apiKey
      }

      if (!apiKey) {
        console.error(kleur.red("❌ API key is required"))
        process.exit(1)
      }

      // Get prompt if not provided
      let componentPrompt = prompt
      if (!componentPrompt) {
        const response = await prompts({
          type: "text",
          name: "prompt",
          message: "Describe the component you want to generate:",
          validate: (value) => value.length > 0 ? true : "Description is required",
        })
        componentPrompt = response.prompt
      }

      if (!componentPrompt) {
        console.error(kleur.red("❌ Component description is required"))
        process.exit(1)
      }

      // Initialize AI engine
      const engine = new AIGeneratorEngine({
        apiKey,
        model: options.model,
      })

      // Initialize file system manager
      const fsManager = new FileSystemManager(options.output)

      // Validate project structure
      const validation = await fsManager.validateProjectStructure(options.output)
      if (!validation.valid) {
        console.log(kleur.yellow("⚠️  Missing project structure:"))
        validation.missing.forEach(item => console.log(`   - ${item}`))
        
        const response = await prompts({
          type: "confirm",
          name: "create",
          message: "Create missing project structure?",
          initial: true,
        })

        if (response.create) {
          await fsManager.createProjectStructure(options.output)
          console.log(kleur.green("✅ Project structure created"))
        } else {
          console.error(kleur.red("❌ Cannot proceed without proper project structure"))
          process.exit(1)
        }
      }

      // Generate component
      const spinner = ora("Generating component...").start()
      
      const result = await engine.generateComponent(componentPrompt, {
        style: options.style,
        includeExample: options.example !== false,
        includeTest: options.test,
        includeDocumentation: options.docs !== false,
      })

      if (!result.success) {
        spinner.fail("Failed to generate component")
        console.error(kleur.red(`❌ ${result.error}`))
        process.exit(1)
      }

      spinner.succeed("Component generated successfully")

      // Write files
      const writeResult = await fsManager.writeGeneratedComponent(result, {
        outputDir: options.output,
        overwrite: options.overwrite,
      })

      if (!writeResult.success) {
        console.error(kleur.red("❌ Failed to write some files:"))
        writeResult.errors.forEach(error => console.error(`   - ${error}`))
        process.exit(1)
      }

      console.log(kleur.green(`\n✅ Generated ${writeResult.files.length} files:`))
      writeResult.files.forEach(file => console.log(`   - ${file}`))

      // Show next steps
      console.log(kleur.cyan("\n🎉 Component generated successfully!"))
      console.log(kleur.cyan("Next steps:"))
      console.log("   1. Review the generated component")
      console.log("   2. Install any missing dependencies")
      console.log("   3. Test the component in your app")
      console.log("   4. Customize as needed")

    } catch (error) {
      console.error(kleur.red("❌ An error occurred:"))
      console.error(error instanceof Error ? error.message : error)
      process.exit(1)
    }
  })

// Generate multiple components
program
  .command("generate-multiple")
  .description("Generate multiple RaynaUI components using AI")
  .option("-f, --file <file>", "File containing component descriptions (one per line)")
  .option("-s, --style <style>", "Component style (new-york, default)", "new-york")
  .option("-o, --output <dir>", "Output directory", ".")
  .option("--no-example", "Skip generating examples")
  .option("--no-docs", "Skip generating documentation")
  .option("--test", "Include test files")
  .option("--overwrite", "Overwrite existing files")
  .option("--api-key <key>", "AI API key")
  .option("--model <model>", "AI model to use", "claude-3-5-sonnet-20241022")
  .action(async (options) => {
    try {
      // Get API key
      let apiKey = options.apiKey || process.env.ANTHROPIC_API_KEY
      if (!apiKey) {
        const response = await prompts({
          type: "password",
          name: "apiKey",
          message: "Enter your Anthropic API key:",
        })
        apiKey = response.apiKey
      }

      if (!apiKey) {
        console.error(kleur.red("❌ API key is required"))
        process.exit(1)
      }

      // Get prompts
      let componentPrompts: string[] = []
      if (options.file) {
        const fs = await import("fs-extra")
        const content = await fs.readFile(options.file, "utf-8")
        componentPrompts = content.split("\n").filter((line: string) => line.trim().length > 0)
      } else {
        const response = await prompts({
          type: "text",
          name: "prompts",
          message: "Enter component descriptions (separated by semicolons):",
          validate: (value: string) => value.length > 0 ? true : "At least one description is required",
        })
        componentPrompts = response.prompts.split(";").map((p: string) => p.trim()).filter((p: string) => p.length > 0)
      }

      if (componentPrompts.length === 0) {
        console.error(kleur.red("❌ No component descriptions provided"))
        process.exit(1)
      }

      // Initialize AI engine
      const engine = new AIGeneratorEngine({
        apiKey,
        model: options.model,
      })

      // Initialize file system manager
      const fsManager = new FileSystemManager(options.output)

      // Validate project structure
      const validation = await fsManager.validateProjectStructure(options.output)
      if (!validation.valid) {
        console.log(kleur.yellow("⚠️  Missing project structure:"))
        validation.missing.forEach(item => console.log(`   - ${item}`))
        
        const response = await prompts({
          type: "confirm",
          name: "create",
          message: "Create missing project structure?",
          initial: true,
        })

        if (response.create) {
          await fsManager.createProjectStructure(options.output)
          console.log(kleur.green("✅ Project structure created"))
        } else {
          console.error(kleur.red("❌ Cannot proceed without proper project structure"))
          process.exit(1)
        }
      }

      // Generate components
      const spinner = ora(`Generating ${componentPrompts.length} components...`).start()
      
      const results = await engine.generateMultipleComponents(componentPrompts, {
        style: options.style,
        includeExample: options.example !== false,
        includeTest: options.test,
        includeDocumentation: options.docs !== false,
      })

      const successfulResults = results.filter(r => r.success)
      const failedResults = results.filter(r => !r.success)

      if (failedResults.length > 0) {
        spinner.warn(`Generated ${successfulResults.length}/${componentPrompts.length} components`)
        console.error(kleur.red(`❌ Failed to generate ${failedResults.length} components:`))
        failedResults.forEach((result, index) => {
          console.error(`   - ${componentPrompts[index]}: ${result.error}`)
        })
      } else {
        spinner.succeed(`Generated ${successfulResults.length} components successfully`)
      }

      // Write files
      const writeResult = await fsManager.writeMultipleComponents(successfulResults, {
        outputDir: options.output,
        overwrite: options.overwrite,
      })

      if (!writeResult.success) {
        console.error(kleur.red("❌ Failed to write some files:"))
        writeResult.errors.forEach(error => console.error(`   - ${error}`))
        process.exit(1)
      }

      console.log(kleur.green(`\n✅ Generated ${writeResult.totalFiles} files total`))

    } catch (error) {
      console.error(kleur.red("❌ An error occurred:"))
      console.error(error instanceof Error ? error.message : error)
      process.exit(1)
    }
  })

// Initialize project structure
program
  .command("init")
  .description("Initialize RaynaUI project structure")
  .option("-o, --output <dir>", "Output directory", ".")
  .action(async (options) => {
    try {
      const fsManager = new FileSystemManager(options.output)
      
      const spinner = ora("Creating project structure...").start()
      await fsManager.createProjectStructure(options.output)
      spinner.succeed("Project structure created successfully")

      console.log(kleur.green("\n✅ RaynaUI project structure initialized!"))
      console.log(kleur.cyan("Created directories:"))
      console.log("   - components/ui")
      console.log("   - app/(app)/examples")
      console.log("   - __tests__")
      console.log("   - content/docs/components")
      console.log("   - lib")
      console.log("   - lib/utils.ts")

    } catch (error) {
      console.error(kleur.red("❌ An error occurred:"))
      console.error(error instanceof Error ? error.message : error)
      process.exit(1)
    }
  })

// Show help if no command provided
if (process.argv.length === 2) {
  program.help()
}

program.parse() 