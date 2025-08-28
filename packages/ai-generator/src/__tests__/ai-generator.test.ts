import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AIGeneratorEngine } from '../ai-engine'
import { FileSystemManager } from '../file-system'
import { generateComponentTemplate } from '../templates'
import { ComponentGeneration } from '../types'

// Mock Anthropic SDK
vi.mock('@anthropic-ai/sdk', () => ({
  default: vi.fn().mockImplementation(() => ({
    messages: {
      create: vi.fn().mockResolvedValue({
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              name: 'TestButton',
              description: 'A test button component',
              props: [
                {
                  name: 'children',
                  type: 'React.ReactNode',
                  required: true,
                  description: 'Button content'
                }
              ],
              variants: [
                {
                  name: 'variant',
                  values: ['default', 'secondary'],
                  defaultValue: 'default'
                }
              ],
              dependencies: ['class-variance-authority'],
              registryDependencies: ['utils']
            })
          }
        ]
      })
    }
  }))
}))

// Mock fs-extra
vi.mock('fs-extra', () => ({
  default: {
    ensureDir: vi.fn().mockResolvedValue(undefined),
    writeFile: vi.fn().mockResolvedValue(undefined),
    pathExists: vi.fn().mockResolvedValue(false),
    readdir: vi.fn().mockResolvedValue([]),
    remove: vi.fn().mockResolvedValue(undefined),
    copy: vi.fn().mockResolvedValue(undefined),
    readFile: vi.fn().mockResolvedValue('')
  }
}))

describe('AI Generator', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('AIGeneratorEngine', () => {
    it('should initialize with config', () => {
      const engine = new AIGeneratorEngine({
        apiKey: 'test-key',
        model: 'test-model',
        temperature: 0.5
      })

      expect(engine).toBeInstanceOf(AIGeneratorEngine)
    })

    it('should throw error without API key', () => {
      expect(() => new AIGeneratorEngine()).toThrow('API key is required')
    })

    it('should generate component successfully', async () => {
      const engine = new AIGeneratorEngine({
        apiKey: 'test-key'
      })

      const result = await engine.generateComponent('A test button component')

      expect(result.success).toBe(true)
      expect(result.component).toBeDefined()
      expect(result.component?.name).toBe('TestButton')
      expect(result.files).toBeDefined()
      expect(result.files?.length).toBeGreaterThan(0)
    })
  })

  describe('FileSystemManager', () => {
    it('should initialize with base directory', () => {
      const fsManager = new FileSystemManager('/test/path')
      expect(fsManager).toBeInstanceOf(FileSystemManager)
    })

    it('should validate project structure', async () => {
      const fsManager = new FileSystemManager()
      const validation = await fsManager.validateProjectStructure('.')

      expect(validation).toHaveProperty('valid')
      expect(validation).toHaveProperty('missing')
      expect(Array.isArray(validation.missing)).toBe(true)
    })

    it('should create project structure', async () => {
      const fsManager = new FileSystemManager()
      
      // This should not throw
      await expect(fsManager.createProjectStructure('.')).resolves.toBeUndefined()
    })
  })

  describe('Template Generation', () => {
    it('should generate component template', () => {
      const generation: ComponentGeneration = {
        name: 'TestButton',
        description: 'A test button component',
        props: [
          {
            name: 'children',
            type: 'React.ReactNode',
            required: true,
            description: 'Button content'
          }
        ],
        variants: [
          {
            name: 'variant',
            values: ['default', 'secondary'],
            defaultValue: 'default'
          }
        ],
        dependencies: ['class-variance-authority'],
        registryDependencies: ['utils']
      }

      const template = generateComponentTemplate(generation)

      expect(template.component).toContain('TestButton')
      expect(template.component).toContain('class-variance-authority')
      expect(template.component).toContain('React.forwardRef')
      expect(template.example).toContain('TestButton')
      expect(template.test).toContain('TestButton')
      expect(template.documentation).toContain('TestButton')
    })

    it('should handle generation without variants', () => {
      const generation: ComponentGeneration = {
        name: 'SimpleComponent',
        description: 'A simple component',
        props: [],
        variants: [],
        dependencies: [],
        registryDependencies: ['utils']
      }

      const template = generateComponentTemplate(generation)

      expect(template.component).toContain('SimpleComponent')
      expect(template.component).not.toContain('variants: {')
    })

    it('should handle generation without props', () => {
      const generation: ComponentGeneration = {
        name: 'NoPropsComponent',
        description: 'A component without props',
        props: [],
        variants: [
          {
            name: 'size',
            values: ['sm', 'md', 'lg'],
            defaultValue: 'md'
          }
        ],
        dependencies: [],
        registryDependencies: ['utils']
      }

      const template = generateComponentTemplate(generation)

      expect(template.component).toContain('NoPropsComponent')
      expect(template.component).toContain('size')
      expect(template.component).not.toContain('props: [')
    })
  })
}) 