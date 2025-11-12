"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

/**
 * Wraps Radix's TooltipProvider and renders it with a configurable open delay.
 *
 * @param delayDuration - Milliseconds to wait before showing the tooltip. Defaults to `0`.
 * @param props - Additional props are forwarded to the underlying Radix `TooltipProvider`.
 * @returns The rendered `TooltipPrimitive.Provider` element.
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
 * Render a Tooltip wrapped with a TooltipProvider.
 *
 * @param props - Props forwarded to the Radix Tooltip root component.
 * @returns The Tooltip root element wrapped by a TooltipProvider.
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
 * Renders the element that toggles the tooltip.
 *
 * Forwards all provided props to the underlying Radix `Tooltip.Trigger` and
 * adds `data-slot="tooltip-trigger"`.
 *
 * @returns The Tooltip trigger element with forwarded props and the `data-slot` attribute.
 */
function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

/**
 * Renders tooltip content inside a portal with built-in styling and an arrow, allowing a configurable offset and custom classes.
 *
 * @param className - Additional CSS classes to merge with the component's default styles.
 * @param sideOffset - Distance in pixels between the tooltip and its trigger (default: 0).
 * @param children - Contents to display inside the tooltip.
 * @param props - Remaining props are forwarded to the underlying tooltip content element.
 * @returns The rendered tooltip content element with an arrow, mounted in a portal.
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