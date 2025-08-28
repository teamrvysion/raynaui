import { promises as fs } from "fs"
import path from "path"
import { registry } from "@/registry/index"

async function testRegistryBuild() {
  try {
    console.log("🧪 Testing registry build...")
    
    // Test 1: Check if registry can be imported
    console.log(`✅ Registry loaded with ${registry.items.length} items`)
    
    // Test 2: Check if we can access registry items
    const firstItem = registry.items[0]
    console.log(`✅ First item: ${firstItem.name}`)
    
    // Test 3: Check if we can write a simple file
    const testContent = `// Test file generated at ${new Date().toISOString()}
export const test = "registry build test"`
    
    await fs.writeFile(path.join(process.cwd(), "test-output.ts"), testContent)
    console.log("✅ Test file written successfully")
    
    // Clean up
    await fs.unlink(path.join(process.cwd(), "test-output.ts"))
    console.log("✅ Test file cleaned up")
    
    console.log("🎉 All tests passed!")
  } catch (error) {
    console.error("❌ Test failed:", error)
    process.exit(1)
  }
}

testRegistryBuild() 