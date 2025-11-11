import { cn } from "@/lib/utils"

/**
 * Renders a div used as a loading skeleton with default styling.
 *
 * @param className - Optional additional CSS classes merged with the component's default classes.
 * @param props - Additional props passed through to the underlying div element.
 * @returns The rendered div element acting as a loading skeleton.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }