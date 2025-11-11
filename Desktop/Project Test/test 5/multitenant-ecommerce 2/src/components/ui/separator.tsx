"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

/**
 * Render a styled separator with configurable orientation and accessibility semantics.
 *
 * @param className - Additional CSS classes to append to the separator.
 * @param orientation - Orientation of the separator, either `"horizontal"` or `"vertical"`.
 * @param decorative - When `true`, marks the separator as decorative to assistive technologies; when `false`, exposes it to the accessibility tree.
 * @param props - Additional props forwarded to the underlying Radix `SeparatorPrimitive.Root` element.
 * @returns The rendered Radix separator element with composed classes and forwarded props.
 */
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )}
      {...props}
    />
  )
}

export { Separator }