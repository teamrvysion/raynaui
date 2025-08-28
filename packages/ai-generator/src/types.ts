import { z } from "zod"

export const ComponentGenerationSchema = z.object({
  name: z.string().describe("The name of the component"),
  description: z.string().describe("A brief description of what the component does"),
  props: z.array(z.object({
    name: z.string(),
    type: z.string(),
    required: z.boolean().default(false),
    description: z.string().optional(),
    defaultValue: z.string().optional(),
  })).optional(),
  variants: z.array(z.object({
    name: z.string(),
    values: z.array(z.string()),
    defaultValue: z.string().optional(),
  })).optional(),
  examples: z.array(z.string()).optional(),
  dependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
})

export const ComponentTemplateSchema = z.object({
  component: z.string(),
  types: z.string().optional(),
  styles: z.string().optional(),
  example: z.string().optional(),
  test: z.string().optional(),
  documentation: z.string().optional(),
})

export const GenerationOptions = z.object({
  style: z.enum(["new-york", "default"]).optional().default("new-york"),
  includeTypes: z.boolean().optional().default(true),
  includeStyles: z.boolean().optional().default(true),
  includeExample: z.boolean().optional().default(true),
  includeTest: z.boolean().optional().default(false),
  includeDocumentation: z.boolean().optional().default(true),
  outputDir: z.string().optional(),
  overwrite: z.boolean().optional().default(false),
})

export type ComponentGeneration = z.infer<typeof ComponentGenerationSchema>
export type ComponentTemplate = z.infer<typeof ComponentTemplateSchema>
export type GenerationOptions = z.infer<typeof GenerationOptions>

export interface RaynaUIComponent {
  name: string
  description: string
  type: string
  files: Array<{
    path: string
    content: string
    type: string
  }>
  dependencies: string[]
  registryDependencies: string[]
}

export interface AIGeneratorConfig {
  apiKey?: string
  model?: string
  temperature?: number
  maxTokens?: number
  baseUrl?: string
}

export interface GenerationResult {
  success: boolean
  component?: RaynaUIComponent
  error?: string
  files?: Array<{
    path: string
    content: string
  }>
} 