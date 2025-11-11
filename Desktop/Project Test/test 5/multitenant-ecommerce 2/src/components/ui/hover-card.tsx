"use client"

import * as React from "react"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"

import { cn } from "@/lib/utils"

/**
 * Renders a Radix HoverCard root element and forwards all provided props.
 *
 * @param props - Props forwarded to the underlying HoverCardPrimitive.Root
 * @returns The rendered HoverCard root element
 */
function HoverCard({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  return <HoverCardPrimitive.Root data-slot="hover-card" {...props} />
}

/**
 * Renders a trigger element for a HoverCard, forwarding all received Trigger props.
 *
 * @returns The HoverCard trigger React element with a `data-slot` of `"hover-card-trigger"`.
 */
function HoverCardTrigger({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
  return (
    <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  )
}

/**
 * Renders the hover card content inside a portal with sensible defaults and styling.
 *
 * Renders HoverCardPrimitive.Content within a Portal, applies a composed className that includes
 * default appearance and animation styles combined with the optional `className`, uses the
 * provided `align` and `sideOffset` values, and forwards any remaining props to the underlying
 * content component.
 *
 * @param className - Additional CSS classes to merge with the component's default classes.
 * @param align - Alignment of the content relative to the trigger (default: "center").
 * @param sideOffset - Distance in pixels between the trigger and content (default: 4).
 * @returns The rendered hover card content element.
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