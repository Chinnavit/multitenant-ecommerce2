"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

/**
 * Displays a horizontal progress bar whose indicator is translated according to `value`.
 *
 * @param className - Additional class names applied to the root container.
 * @param value - Progress percentage (0–100); when omitted or falsy, treated as 0.
 * @param props - Additional props forwarded to `ProgressPrimitive.Root`.
 * @returns A `ProgressPrimitive.Root` element with an indicator positioned to represent `value`.
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