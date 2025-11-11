"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

/**
 * Renders a styled progress bar that visualizes a percentage value.
 *
 * @param className - Optional additional CSS classes applied to the progress root
 * @param value - Progress percentage from 0 to 100; treated as 0 when `undefined`
 * @param props - Any other props are forwarded to `ProgressPrimitive.Root`
 * @returns A `ProgressPrimitive.Root` element containing an indicator translated to represent `value`
 */
function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative h-3 w-full overflow-hidden rounded-full",
        // Modified classes
        "borde bg-white",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-pink-400 h-full w-full flex-1 transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root> 
  )
}

export { Progress }