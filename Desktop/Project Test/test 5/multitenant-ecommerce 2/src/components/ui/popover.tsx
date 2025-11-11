"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

/**
 * Renders a Radix UI Popover root and forwards received props to it.
 *
 * @returns A Popover root element with `data-slot="popover"` and all received props forwarded to the underlying Radix primitive.
 */
function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

/**
 * Renders a Popover trigger element by wrapping Radix's Popover Trigger and adding a data-slot attribute.
 *
 * @param props - Props forwarded to the underlying Radix Popover Trigger component.
 * @returns The Popover Trigger element with `data-slot="popover-trigger"` and all provided props applied.
 */
function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

/**
 * Renders popover content inside a Radix Portal with built-in styling, animations, and placement controls.
 *
 * @param className - Additional CSS class names to apply to the content container
 * @param align - Alignment of the content relative to the trigger; defaults to `"center"`
 * @param sideOffset - Distance in pixels between the trigger and the content; defaults to `4`
 * @returns A React element that renders the styled popover content
 */
function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}

/**
 * Wraps the Radix Popover Anchor and forwards all received props while adding a `data-slot="popover-anchor"` attribute.
 *
 * @param props - All props accepted by `PopoverPrimitive.Anchor`; they are passed through to the underlying anchor.
 * @returns The Popover Anchor element with `data-slot="popover-anchor"` and the provided props applied.
 */
function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }