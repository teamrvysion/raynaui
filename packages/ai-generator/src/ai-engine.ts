import Anthropic from "@anthropic-ai/sdk"
import { ComponentGeneration, AIGeneratorConfig, GenerationResult } from "./types"
import { generateComponentTemplate } from "./templates"

export class AIGeneratorEngine {
  private client: Anthropic
  private config: AIGeneratorConfig

  constructor(config: AIGeneratorConfig = {}) {
    this.config = {
      model: "claude-3-5-sonnet-20241022",
      temperature: 0.7,
      maxTokens: 4000,
      ...config,
    }

    if (this.config.apiKey) {
      this.client = new Anthropic({
        apiKey: this.config.apiKey,
        baseURL: this.config.baseUrl,
      })
    } else {
      throw new Error("API key is required for AI generation")
    }
  }

  async generateComponent(
    prompt: string,
    options: {
      style?: string
      includeExample?: boolean
      includeTest?: boolean
      includeDocumentation?: boolean
    } = {}
  ): Promise<GenerationResult> {
    try {
      const systemPrompt = this.buildSystemPrompt(options.style)
      const userPrompt = this.buildUserPrompt(prompt, options)

      const response = await this.client.messages.create({
        model: this.config.model!,
        max_tokens: this.config.maxTokens || 4000,
        temperature: this.config.temperature,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: userPrompt,
          },
        ],
      })

      const content = response.content[0]
      if (content.type !== "text") {
        throw new Error("Unexpected response type from AI")
      }

      // Parse the AI response to extract component generation data
      const generation = this.parseAIResponse(content.text)
      
      // Generate the component template
      const template = generateComponentTemplate(generation, { style: options.style })

      // Create the component structure
      const component = {
        name: generation.name,
        description: generation.description,
        type: "components:ui",
        files: [
          {
            path: `components/ui/${generation.name.toLowerCase()}.tsx`,
            content: template.component,
            type: "registry:component",
          },
        ],
        dependencies: generation.dependencies || [],
        registryDependencies: generation.registryDependencies || ["utils"],
      }

      // Add additional files based on options
      if (options.includeExample && template.example) {
        component.files.push({
          path: `app/(app)/examples/${generation.name.toLowerCase()}/page.tsx`,
          content: template.example,
          type: "registry:page",
        })
      }

      if (options.includeTest && template.test) {
        component.files.push({
          path: `__tests__/${generation.name.toLowerCase()}.test.tsx`,
          content: template.test,
          type: "registry:file",
        })
      }

      if (options.includeDocumentation && template.documentation) {
        component.files.push({
          path: `content/docs/components/${generation.name.toLowerCase()}.mdx`,
          content: template.documentation,
          type: "registry:file",
        })
      }

      return {
        success: true,
        component,
        files: component.files.map(file => ({
          path: file.path,
          content: file.content,
        })),
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  private buildSystemPrompt(_style: string = "new-york"): string {
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
}`
  }

  private buildUserPrompt(prompt: string, options: any): string {
    return `Generate a RaynaUI component based on this description:

${prompt}

Please provide the component specification in JSON format as described in the system prompt.

Additional requirements:
- Style: ${options.style || "new-york"}
- Include example: ${options.includeExample || false}
- Include test: ${options.includeTest || false}
- Include documentation: ${options.includeDocumentation || false}

Respond only with the JSON specification, no additional text.`
  }

  private parseAIResponse(response: string): ComponentGeneration {
    try {
      // Extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("No JSON found in AI response")
      }

      const parsed = JSON.parse(jsonMatch[0])
      
      // Validate and transform the response
      return {
        name: parsed.name,
        description: parsed.description,
        props: parsed.props || [],
        variants: parsed.variants || [],
        dependencies: parsed.dependencies || [],
        registryDependencies: parsed.registryDependencies || ["utils"],
      }
    } catch (error) {
      throw new Error(`Failed to parse AI response: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async generateMultipleComponents(
    prompts: string[],
    options: any = {}
  ): Promise<GenerationResult[]> {
    const results: GenerationResult[] = []
    
    for (const prompt of prompts) {
      const result = await this.generateComponent(prompt, options)
      results.push(result)
    }
    
    return results
  }
} 