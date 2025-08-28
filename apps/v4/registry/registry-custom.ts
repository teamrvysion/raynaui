import { registryItemSchema } from "shadcn/schema"
import { z } from "zod"

// Custom RaynaUI components
export const customComponents = [
  {
    name: "animated-button",
    type: "components:ui",
    registryDependencies: ["button"],
    files: ["components/ui/animated-button.tsx"],
    dependencies: ["framer-motion"],
    description: "An animated button component with hover effects",
  },
  {
    name: "gradient-card",
    type: "components:ui", 
    registryDependencies: ["card"],
    files: ["components/ui/gradient-card.tsx"],
    dependencies: [],
    description: "A card component with gradient backgrounds",
  },
  {
    name: "floating-nav",
    type: "components:ui",
    registryDependencies: ["navigation-menu"],
    files: ["components/ui/floating-nav.tsx"],
    dependencies: ["framer-motion"],
    description: "A floating navigation component",
  },
] satisfies z.infer<typeof registryItemSchema>[] 