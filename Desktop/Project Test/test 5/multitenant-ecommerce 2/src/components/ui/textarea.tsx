import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Render a textarea element with composed styling and forwarded props.
 *
 * The component applies a base set of styling classes (including responsive and dark-mode adjustments),
 * appends "md:text-base" and "bg-white", merges any `className` provided, and forwards all other textarea props to the underlying element.
 *
 * @param className - Additional CSS classes to append to the component's composed class list
 * @param props - Remaining standard textarea props which are forwarded to the underlying element
 * @returns A JSX textarea element with the composed `className`, `data-slot="textarea"`, and forwarded props
 */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border px-3 py-2 text-base transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        // Modified classes
        "md:text-base bg-white",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }