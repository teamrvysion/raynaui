import { z } from "zod"

// Registry item file schema
export const registryItemFileSchema = z.object({
  path: z.string(),
  type: z.string(),
  content: z.string().optional(),
  target: z.string().optional(),
})

// Registry item schema
export const registryItemSchema = z.object({
  name: z.string(),
  type: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  files: z.array(registryItemFileSchema).optional(),
  categories: z.array(z.string()).optional(),
  meta: z.record(z.any()).optional(),
  $schema: z.string().optional(),
  tailwind: z.record(z.any()).optional(),
  cssVars: z.record(z.any()).optional(),
})

// Registry schema
export const registrySchema = z.object({
  name: z.string(),
  homepage: z.string(),
  items: z.array(registryItemSchema),
})

// Registry item type schema
export const registryItemTypeSchema = z.enum([
  "registry:ui",
  "registry:lib",
  "registry:hook",
  "registry:theme",
  "registry:block",
  "registry:example",
  "registry:internal",
  "registry:style",
])

// Export types
export type Registry = z.infer<typeof registrySchema>
export type RegistryItem = z.infer<typeof registryItemSchema>
export type RegistryItemFile = z.infer<typeof registryItemFileSchema>
export type RegistryItemType = z.infer<typeof registryItemTypeSchema> 