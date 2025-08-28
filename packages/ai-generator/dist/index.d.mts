import { z } from 'zod';

declare const ComponentGenerationSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    props: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        type: z.ZodString;
        required: z.ZodDefault<z.ZodBoolean>;
        description: z.ZodOptional<z.ZodString>;
        defaultValue: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: string;
        name: string;
        required: boolean;
        description?: string | undefined;
        defaultValue?: string | undefined;
    }, {
        type: string;
        name: string;
        description?: string | undefined;
        required?: boolean | undefined;
        defaultValue?: string | undefined;
    }>, "many">>;
    variants: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        values: z.ZodArray<z.ZodString, "many">;
        defaultValue: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        values: string[];
        defaultValue?: string | undefined;
    }, {
        name: string;
        values: string[];
        defaultValue?: string | undefined;
    }>, "many">>;
    examples: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    dependencies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    registryDependencies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    props?: {
        type: string;
        name: string;
        required: boolean;
        description?: string | undefined;
        defaultValue?: string | undefined;
    }[] | undefined;
    variants?: {
        name: string;
        values: string[];
        defaultValue?: string | undefined;
    }[] | undefined;
    examples?: string[] | undefined;
    dependencies?: string[] | undefined;
    registryDependencies?: string[] | undefined;
}, {
    name: string;
    description: string;
    props?: {
        type: string;
        name: string;
        description?: string | undefined;
        required?: boolean | undefined;
        defaultValue?: string | undefined;
    }[] | undefined;
    variants?: {
        name: string;
        values: string[];
        defaultValue?: string | undefined;
    }[] | undefined;
    examples?: string[] | undefined;
    dependencies?: string[] | undefined;
    registryDependencies?: string[] | undefined;
}>;
declare const ComponentTemplateSchema: z.ZodObject<{
    component: z.ZodString;
    types: z.ZodOptional<z.ZodString>;
    styles: z.ZodOptional<z.ZodString>;
    example: z.ZodOptional<z.ZodString>;
    test: z.ZodOptional<z.ZodString>;
    documentation: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    component: string;
    types?: string | undefined;
    styles?: string | undefined;
    example?: string | undefined;
    test?: string | undefined;
    documentation?: string | undefined;
}, {
    component: string;
    types?: string | undefined;
    styles?: string | undefined;
    example?: string | undefined;
    test?: string | undefined;
    documentation?: string | undefined;
}>;
type ComponentGeneration = z.infer<typeof ComponentGenerationSchema>;
type ComponentTemplate = z.infer<typeof ComponentTemplateSchema>;
declare const GenerationOptions: z.ZodObject<{
    style: z.ZodDefault<z.ZodOptional<z.ZodEnum<["new-york", "default"]>>>;
    includeTypes: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    includeStyles: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    includeExample: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    includeTest: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    includeDocumentation: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    outputDir: z.ZodOptional<z.ZodString>;
    overwrite: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    style: "new-york" | "default";
    includeTest: boolean;
    overwrite: boolean;
    includeTypes: boolean;
    includeStyles: boolean;
    includeExample: boolean;
    includeDocumentation: boolean;
    outputDir?: string | undefined;
}, {
    style?: "new-york" | "default" | undefined;
    includeTest?: boolean | undefined;
    outputDir?: string | undefined;
    overwrite?: boolean | undefined;
    includeTypes?: boolean | undefined;
    includeStyles?: boolean | undefined;
    includeExample?: boolean | undefined;
    includeDocumentation?: boolean | undefined;
}>;
type GenerationOptions = z.infer<typeof GenerationOptions>;
interface RaynaUIComponent {
    name: string;
    description: string;
    type: string;
    files: Array<{
        path: string;
        content: string;
        type: string;
    }>;
    dependencies: string[];
    registryDependencies: string[];
}
interface AIGeneratorConfig {
    apiKey?: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
    baseUrl?: string;
}
interface GenerationResult {
    success: boolean;
    component?: RaynaUIComponent;
    error?: string;
    files?: Array<{
        path: string;
        content: string;
    }>;
}

declare class AIGeneratorEngine {
    private client;
    private config;
    constructor(config?: AIGeneratorConfig);
    generateComponent(prompt: string, options?: {
        style?: string;
        includeExample?: boolean;
        includeTest?: boolean;
        includeDocumentation?: boolean;
    }): Promise<GenerationResult>;
    private buildSystemPrompt;
    private buildUserPrompt;
    private parseAIResponse;
    generateMultipleComponents(prompts: string[], options?: any): Promise<GenerationResult[]>;
}

declare class FileSystemManager {
    private baseDir;
    constructor(baseDir?: string);
    writeGeneratedComponent(result: GenerationResult, options?: {
        outputDir?: string;
        overwrite?: boolean;
    }): Promise<{
        success: boolean;
        files: string[];
        errors: string[];
    }>;
    writeMultipleComponents(results: GenerationResult[], options?: {
        outputDir?: string;
        overwrite?: boolean;
    }): Promise<{
        success: boolean;
        totalFiles: number;
        errors: string[];
    }>;
    createProjectStructure(baseDir: string): Promise<void>;
    validateProjectStructure(baseDir: string): Promise<{
        valid: boolean;
        missing: string[];
    }>;
    readExistingComponent(componentName: string, baseDir: string): Promise<string | null>;
    backupExistingFile(filePath: string): Promise<string | null>;
    cleanupBackups(baseDir: string): Promise<void>;
}

declare function generateComponentTemplate(generation: ComponentGeneration, _options?: {
    style?: string;
}): ComponentTemplate;

declare class RaynaUIAIGenerator {
    private engine;
    private fsManager;
    constructor(config?: AIGeneratorConfig);
    generateComponent(prompt: string, options?: GenerationOptions): Promise<GenerationResult>;
    generateAndWriteComponent(prompt: string, options?: GenerationOptions): Promise<{
        generation: GenerationResult;
        files: string[];
        errors: string[];
    }>;
    generateMultipleComponents(prompts: string[], options?: GenerationOptions): Promise<GenerationResult[]>;
    generateAndWriteMultipleComponents(prompts: string[], options?: GenerationOptions): Promise<{
        generations: GenerationResult[];
        totalFiles: number;
        errors: string[];
    }>;
    initializeProject(outputDir?: string): Promise<void>;
    validateProject(outputDir?: string): Promise<{
        valid: boolean;
        missing: string[];
    }>;
}
declare function generateRaynaUIComponent(prompt: string, config?: AIGeneratorConfig, options?: GenerationOptions): Promise<GenerationResult>;
declare function generateAndWriteRaynaUIComponent(prompt: string, config?: AIGeneratorConfig, options?: GenerationOptions): Promise<{
    generation: GenerationResult;
    files: string[];
    errors: string[];
}>;

export { type AIGeneratorConfig, AIGeneratorEngine, type ComponentGeneration, type ComponentTemplate, FileSystemManager, GenerationOptions, type GenerationResult, RaynaUIAIGenerator, type RaynaUIComponent, generateAndWriteRaynaUIComponent, generateComponentTemplate, generateRaynaUIComponent };
