#!/usr/bin/env tsx

import { RaynaUIAIGenerator } from './src/index'

async function demo() {
  console.log('🚀 RaynaUI AI Generator Demo\n')

  // Initialize the generator (without API key for demo)
  const generator = new RaynaUIAIGenerator({
    apiKey: process.env.ANTHROPIC_API_KEY || 'demo-key'
  })

  console.log('1. Initializing project structure...')
  try {
    await generator.initializeProject('./demo-output')
    console.log('✅ Project structure created\n')
  } catch (error) {
    console.log('⚠️  Project structure already exists or error occurred\n')
  }

  console.log('2. Validating project structure...')
  const validation = await generator.validateProject('./demo-output')
  if (validation.valid) {
    console.log('✅ Project structure is valid\n')
  } else {
    console.log('❌ Project structure is invalid:', validation.missing)
    return
  }

  console.log('3. Demo component generation...')
  console.log('   (This would normally use AI to generate components)')
  console.log('   For demo purposes, showing the template system...\n')

  // Show template generation without AI
  const { generateComponentTemplate } = await import('./src/templates')
  
  const demoComponent = {
    name: 'DemoButton',
    description: 'A demo button component with variants',
    props: [
      {
        name: 'children',
        type: 'React.ReactNode',
        required: true,
        description: 'Button content'
      },
      {
        name: 'onClick',
        type: '() => void',
        required: false,
        description: 'Click handler'
      }
    ],
    variants: [
      {
        name: 'variant',
        values: ['default', 'secondary', 'destructive'],
        defaultValue: 'default'
      },
      {
        name: 'size',
        values: ['sm', 'md', 'lg'],
        defaultValue: 'md'
      }
    ],
    dependencies: ['class-variance-authority'],
    registryDependencies: ['utils']
  }

  const template = generateComponentTemplate(demoComponent)

  console.log('Generated Component Template:')
  console.log('=' .repeat(50))
  console.log(template.component)
  console.log('\nGenerated Example:')
  console.log('=' .repeat(50))
  console.log(template.example)
  console.log('\nGenerated Documentation:')
  console.log('=' .repeat(50))
  console.log(template.documentation)

  console.log('\n🎉 Demo completed!')
  console.log('\nTo use the full AI generator:')
  console.log('1. Set your ANTHROPIC_API_KEY environment variable')
  console.log('2. Run: npx raynaui-ai generate "A button component"')
  console.log('3. Or use programmatically:')
  console.log('   const result = await generator.generateComponent("A button component")')
}

demo().catch(console.error) 