import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Render a styled input element that forwards remaining props to the underlying <input>.
 *
 * @param className - Additional CSS classes to append to the component's default styling
 * @param type - HTML input `type` attribute
 * @param props - Remaining native input props passed through to the rendered element
 * @returns The rendered input element with composed styling and forwarded props
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