"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

/**
 * Renders an avatar root element with the component's base styles and any additional classes.
 *
 * @param className - Additional CSS class names to merge with the component's base avatar styles
 * @param props - Additional props passed through to the underlying AvatarPrimitive.Root
 * @returns A React element representing the avatar root with composed classes and `data-slot="avatar"`
 */
function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders an avatar image element using Radix's AvatarPrimitive.Image with default sizing classes.
 *
 * @param className - Additional CSS class names to merge with the default "aspect-square size-full" styles
 * @param props - Additional props forwarded to AvatarPrimitive.Image
 * @returns The rendered AvatarPrimitive.Image element
 */
function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}

/**
 * Renders the Avatar fallback element with default styling and optional additional classes.
 *
 * @param className - Additional class names merged with the component's default fallback styles
 * @returns The Avatar fallback element with default styles and any provided `className` applied
 */
function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }