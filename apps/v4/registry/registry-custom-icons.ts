import { registryItemSchema } from "shadcn/schema"
import { z } from "zod"

// Custom RaynaUI icons
export const customIcons = [
  {
    name: "rayna-logo",
    type: "components:ui",
    files: ["components/ui/icons/rayna-logo.tsx"],
    dependencies: [],
    description: "RaynaUI logo icon component",
  },
  {
    name: "custom-arrow",
    type: "components:ui",
    files: ["components/ui/icons/custom-arrow.tsx"],
    dependencies: [],
    description: "Custom arrow icon with RaynaUI styling",
  },
  {
    name: "animated-star",
    type: "components:ui",
    files: ["components/ui/icons/animated-star.tsx"],
    dependencies: ["framer-motion"],
    description: "Animated star icon component",
  },
] satisfies z.infer<typeof registryItemSchema>[] 