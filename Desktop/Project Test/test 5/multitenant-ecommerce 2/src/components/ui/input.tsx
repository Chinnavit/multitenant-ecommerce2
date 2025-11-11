import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Stylized input component that applies a default set of UI classes and forwards native input props.
 *
 * @param className - Optional additional class names that are merged with the component's default styling
 * @param type - Input `type` attribute (e.g., "text", "password"); defaults to the native input behavior when omitted
 * @returns The rendered input element with composed class names and forwarded props
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        // Modified classes
        "h-12 bg-white font-medium md:text-base",
        className
      )}
      {...props}
    />
  )
}

export { Input }