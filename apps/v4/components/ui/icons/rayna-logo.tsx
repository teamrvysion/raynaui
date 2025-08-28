import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const raynaLogoVariants = cva(
  "inline-block",
  {
    variants: {
      size: {
        sm: "h-4 w-4",
        md: "h-6 w-6",
        lg: "h-8 w-8",
        xl: "h-12 w-12",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

export interface RaynaLogoProps
  extends React.SVGProps<SVGSVGElement>,
    VariantProps<typeof raynaLogoVariants> {}

const RaynaLogo = React.forwardRef<SVGSVGElement, RaynaLogoProps>(
  ({ className, size, ...props }, ref) => (
    <svg
      ref={ref}
      className={cn(raynaLogoVariants({ size }), className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 2L2 7L12 12L22 7L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 17L12 22L22 17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 12L12 17L22 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
)
RaynaLogo.displayName = "RaynaLogo"

export { RaynaLogo, raynaLogoVariants } 