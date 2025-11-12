import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * Render an alert container element with variant-controlled styling.
 *
 * @param className - Optional additional CSS classes to merge with the component's styles.
 * @param variant - Visual variant for the alert; `"default"` applies neutral styling, `"destructive"` applies destructive styling.
 * @returns A React `div` element with `role="alert"` and `data-slot="alert"`.
 */
function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

/**
 * Renders the title slot for an Alert component.
 *
 * The element is a styled `div` with `data-slot="alert-title"` and accepts standard `div` props;
 * any `className` provided will be merged with the component's default title classes.
 *
 * @returns A `div` element used as the alert title slot
 */
function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders the alert description slot used inside the Alert layout.
 *
 * @param className - Additional CSS classes to merge with the component's default description styles
 * @param props - Additional HTML div attributes forwarded to the element
 * @returns The div element serving as the alert's descriptive content slot
 */
function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }