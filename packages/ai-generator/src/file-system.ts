import fs from "fs-extra"
import path from "path"
import { GenerationResult } from "./types"

export class FileSystemManager {
  private baseDir: string

  constructor(baseDir: string = process.cwd()) {
    this.baseDir = baseDir
  }

  async writeGeneratedComponent(result: GenerationResult, options: {
    outputDir?: string
    overwrite?: boolean
  } = {}): Promise<{
    success: boolean
    files: string[]
    errors: string[]
  }> {
    const outputDir = options.outputDir || this.baseDir
    const files: string[] = []
    const errors: string[] = []

    if (!result.success || !result.files) {
      return {
        success: false,
        files: [],
        errors: ["No files to write"],
      }
    }

    for (const file of result.files) {
      try {
        const filePath = path.join(outputDir, file.path)
        const dirPath = path.dirname(filePath)

        // Create directory if it doesn't exist
        await fs.ensureDir(dirPath)

        // Check if file exists and handle overwrite
        if (await fs.pathExists(filePath) && !options.overwrite) {
          errors.push(`File already exists: ${file.path} (use --overwrite to overwrite)`)
          continue
        }

        // Write the file
        await fs.writeFile(filePath, file.content, "utf-8")
        files.push(file.path)

        console.log(`✅ Created: ${file.path}`)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error"
        errors.push(`Failed to write ${file.path}: ${errorMessage}`)
      }
    }

    return {
      success: errors.length === 0,
      files,
      errors,
    }
  }

  async writeMultipleComponents(
    results: GenerationResult[],
    options: {
      outputDir?: string
      overwrite?: boolean
    } = {}
  ): Promise<{
    success: boolean
    totalFiles: number
    errors: string[]
  }> {
    let totalFiles = 0
    const allErrors: string[] = []

    for (const result of results) {
      const writeResult = await this.writeGeneratedComponent(result, options)
      totalFiles += writeResult.files.length
      allErrors.push(...writeResult.errors)
    }

    return {
      success: allErrors.length === 0,
      totalFiles,
      errors: allErrors,
    }
  }

  async createProjectStructure(baseDir: string): Promise<void> {
    const structure = [
      "components/ui",
      "app/(app)/examples",
      "__tests__",
      "content/docs/components",
      "lib",
    ]

    for (const dir of structure) {
      await fs.ensureDir(path.join(baseDir, dir))
    }

    // Create utils.ts if it doesn't exist
    const utilsPath = path.join(baseDir, "lib/utils.ts")
    if (!(await fs.pathExists(utilsPath))) {
      const utilsContent = `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`
      await fs.writeFile(utilsPath, utilsContent, "utf-8")
    }
  }

  async validateProjectStructure(baseDir: string): Promise<{
    valid: boolean
    missing: string[]
  }> {
    const requiredDirs = [
      "components/ui",
      "lib",
    ]

    const missing: string[] = []

    for (const dir of requiredDirs) {
      const dirPath = path.join(baseDir, dir)
      if (!(await fs.pathExists(dirPath))) {
        missing.push(dir)
      }
    }

    // Check for utils.ts
    const utilsPath = path.join(baseDir, "lib/utils.ts")
    if (!(await fs.pathExists(utilsPath))) {
      missing.push("lib/utils.ts")
    }

    return {
      valid: missing.length === 0,
      missing,
    }
  }

  async readExistingComponent(componentName: string, baseDir: string): Promise<string | null> {
    const componentPath = path.join(baseDir, "components/ui", `${componentName.toLowerCase()}.tsx`)
    
    try {
      if (await fs.pathExists(componentPath)) {
        return await fs.readFile(componentPath, "utf-8")
      }
    } catch (error) {
      console.warn(`Failed to read existing component: ${error}`)
    }

    return null
  }

  async backupExistingFile(filePath: string): Promise<string | null> {
    try {
      if (await fs.pathExists(filePath)) {
        const backupPath = `${filePath}.backup.${Date.now()}`
        await fs.copy(filePath, backupPath)
        return backupPath
      }
    } catch (error) {
      console.warn(`Failed to backup file: ${error}`)
    }

    return null
  }

  async cleanupBackups(baseDir: string): Promise<void> {
    try {
      const files = await fs.readdir(baseDir, { recursive: true })
      const backupFiles = files.filter((file: string | Buffer) => 
        typeof file === "string" && file.includes(".backup.")
      ) as string[]

      for (const backupFile of backupFiles) {
        const backupPath = path.join(baseDir, backupFile)
        await fs.remove(backupPath)
        console.log(`🗑️  Removed backup: ${backupFile}`)
      }
    } catch (error) {
      console.warn(`Failed to cleanup backups: ${error}`)
    }
  }
} 