"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

/**
 * Renders a Radix Tooltip Provider with a default zero delay and a data-slot attribute.
 *
 * @param delayDuration - Time in milliseconds to wait before showing the tooltip. Defaults to `0`.
 * @returns The rendered TooltipPrimitive.Provider element configured for the app's tooltip system.
 */
function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}

/**
 * Wraps the Tooltip root with the module's TooltipProvider and forwards all received props to the underlying Tooltip root.
 *
 * @param props - Props to pass through to the underlying TooltipPrimitive.Root
 * @returns The TooltipPrimitive.Root element wrapped by TooltipProvider
 */
function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  )
}

/**
 * Renders a tooltip trigger element that applies data-slot="tooltip-trigger" and forwards all received props.
 *
 * @returns A JSX element representing the tooltip trigger with the provided props applied.
 */
function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

/**
 * Renders the styled tooltip content inside a portal.
 *
 * Renders tooltip content with built-in styling, animations, and an arrow, and mounts it in a portal so it layers above other UI.
 *
 * @param className - Additional CSS classes to append to the default tooltip content styles.
 * @param sideOffset - Distance in pixels between the trigger and the tooltip; defaults to `0`.
 * @param children - The contents to display inside the tooltip.
 * @returns The mounted tooltip content element (including its arrow), suitable for use as a Radix Tooltip Content component.
 */
function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }