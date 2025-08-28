// Import types first
import type {
  GenerationOptions,
  AIGeneratorConfig,
  GenerationResult,
} from "./types"

// Import classes
import { AIGeneratorEngine } from "./ai-engine"
import { FileSystemManager } from "./file-system"

// Main exports
export { AIGeneratorEngine } from "./ai-engine"
export { FileSystemManager } from "./file-system"
export { generateComponentTemplate } from "./templates"

// Types
export type {
  ComponentGeneration,
  ComponentTemplate,
  GenerationOptions,
  RaynaUIComponent,
  AIGeneratorConfig,
  GenerationResult,
} from "./types"

// Main generator class that combines everything
export class RaynaUIAIGenerator {
  private engine: AIGeneratorEngine
  private fsManager: FileSystemManager

  constructor(config: AIGeneratorConfig = {}) {
    this.engine = new AIGeneratorEngine(config)
    this.fsManager = new FileSystemManager()
  }

  async generateComponent(
    prompt: string,
    options: GenerationOptions = {
      style: "new-york",
      includeTypes: true,
      includeStyles: true,
      includeExample: true,
      includeTest: false,
      includeDocumentation: true,
      overwrite: false,
    }
  ): Promise<GenerationResult> {
    return this.engine.generateComponent(prompt, options)
  }

  async generateAndWriteComponent(
    prompt: string,
    options: GenerationOptions = {
      style: "new-york",
      includeTypes: true,
      includeStyles: true,
      includeExample: true,
      includeTest: false,
      includeDocumentation: true,
      overwrite: false,
    }
  ): Promise<{
    generation: GenerationResult
    files: string[]
    errors: string[]
  }> {
    const generation = await this.generateComponent(prompt, options)
    const writeResult = await this.fsManager.writeGeneratedComponent(generation, {
      outputDir: options.outputDir,
      overwrite: options.overwrite,
    })

    return {
      generation,
      files: writeResult.files,
      errors: writeResult.errors,
    }
  }

  async generateMultipleComponents(
    prompts: string[],
    options: GenerationOptions = {
      style: "new-york",
      includeTypes: true,
      includeStyles: true,
      includeExample: true,
      includeTest: false,
      includeDocumentation: true,
      overwrite: false,
    }
  ): Promise<GenerationResult[]> {
    return this.engine.generateMultipleComponents(prompts, options)
  }

  async generateAndWriteMultipleComponents(
    prompts: string[],
    options: GenerationOptions = {
      style: "new-york",
      includeTypes: true,
      includeStyles: true,
      includeExample: true,
      includeTest: false,
      includeDocumentation: true,
      overwrite: false,
    }
  ): Promise<{
    generations: GenerationResult[]
    totalFiles: number
    errors: string[]
  }> {
    const generations = await this.generateMultipleComponents(prompts, options)
    const writeResult = await this.fsManager.writeMultipleComponents(generations, {
      outputDir: options.outputDir,
      overwrite: options.overwrite,
    })

    return {
      generations,
      totalFiles: writeResult.totalFiles,
      errors: writeResult.errors,
    }
  }

  async initializeProject(outputDir: string = "."): Promise<void> {
    await this.fsManager.createProjectStructure(outputDir)
  }

  async validateProject(outputDir: string = "."): Promise<{
    valid: boolean
    missing: string[]
  }> {
    return this.fsManager.validateProjectStructure(outputDir)
  }
}

// Convenience function for quick generation
export async function generateRaynaUIComponent(
  prompt: string,
  config: AIGeneratorConfig = {},
  options: GenerationOptions = {
    style: "new-york",
    includeTypes: true,
    includeStyles: true,
    includeExample: true,
    includeTest: false,
    includeDocumentation: true,
    overwrite: false,
  }
): Promise<GenerationResult> {
  const generator = new RaynaUIAIGenerator(config)
  return generator.generateComponent(prompt, options)
}

// Convenience function for quick generation and writing
export async function generateAndWriteRaynaUIComponent(
  prompt: string,
  config: AIGeneratorConfig = {},
  options: GenerationOptions = {
    style: "new-york",
    includeTypes: true,
    includeStyles: true,
    includeExample: true,
    includeTest: false,
    includeDocumentation: true,
    overwrite: false,
  }
): Promise<{
  generation: GenerationResult
  files: string[]
  errors: string[]
}> {
  const generator = new RaynaUIAIGenerator(config)
  return generator.generateAndWriteComponent(prompt, options)
} 