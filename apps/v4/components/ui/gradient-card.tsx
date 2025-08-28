"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const gradientCardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800",
        purple: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
        blue: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
        green: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
        rainbow: "bg-gradient-to-br from-red-50 via-yellow-50 to-blue-50 dark:from-red-900/20 dark:via-yellow-900/20 dark:to-blue-900/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const gradientCardHeaderVariants = cva("flex flex-col space-y-1.5 p-6")
const gradientCardTitleVariants = cva("text-2xl font-semibold leading-none tracking-tight")
const gradientCardDescriptionVariants = cva("text-sm text-muted-foreground")
const gradientCardContentVariants = cva("p-6 pt-0")
const gradientCardFooterVariants = cva("flex items-center p-6 pt-0")

export interface GradientCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gradientCardVariants> {}

const GradientCard = React.forwardRef<HTMLDivElement, GradientCardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(gradientCardVariants({ variant }), className)}
      {...props}
    />
  )
)
GradientCard.displayName = "GradientCard"

const GradientCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(gradientCardHeaderVariants(), className)}
    {...props}
  />
))
GradientCardHeader.displayName = "GradientCardHeader"

const GradientCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(gradientCardTitleVariants(), className)}
    {...props}
  />
))
GradientCardTitle.displayName = "GradientCardTitle"

const GradientCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(gradientCardDescriptionVariants(), className)}
    {...props}
  />
))
GradientCardDescription.displayName = "GradientCardDescription"

const GradientCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(gradientCardContentVariants(), className)}
    {...props}
  />
))
GradientCardContent.displayName = "GradientCardContent"

const GradientCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(gradientCardFooterVariants(), className)}
    {...props}
  />
))
GradientCardFooter.displayName = "GradientCardFooter"

export {
  GradientCard,
  GradientCardHeader,
  GradientCardFooter,
  GradientCardTitle,
  GradientCardDescription,
  GradientCardContent,
} 