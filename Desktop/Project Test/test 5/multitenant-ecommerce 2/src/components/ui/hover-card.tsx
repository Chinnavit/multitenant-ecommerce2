"use client"

import * as React from "react"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"

import { cn } from "@/lib/utils"

/**
 * Wraps Radix's HoverCard.Root and attaches a `data-slot="hover-card"` attribute for slot-based styling and observability.
 *
 * @param props - Props forwarded to the underlying HoverCard root element
 * @returns The rendered HoverCard root element
 */
function HoverCard({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  return <HoverCardPrimitive.Root data-slot="hover-card" {...props} />
}

/**
 * Wraps the Radix HoverCard Trigger, forwarding all received props and adding a `data-slot="hover-card-trigger"` attribute.
 *
 * @returns A React element rendering the HoverCard Trigger with forwarded props and the `data-slot="hover-card-trigger"` attribute.
 */
function HoverCardTrigger({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
  return (
    <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  )
}

/**
 * Render hover card content inside a portal with preset styling and configurable alignment and offset.
 *
 * @param className - Additional CSS class names to merge with the component's default styles.
 * @param align - Horizontal alignment of the content relative to the trigger; defaults to `"center"`.
 * @param sideOffset - Distance in pixels between the trigger and the content; defaults to `4`.
 * @returns The hover card content element rendered inside a portal with merged classes and forwarded props.
 */
function HoverCardContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Content>) {
  return (
    <HoverCardPrimitive.Portal data-slot="hover-card-portal">
      <HoverCardPrimitive.Content
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-64 origin-(--radix-hover-card-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
          className
        )}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  )
}

export { HoverCard, HoverCardTrigger, HoverCardContent }