import { cn } from "@/lib/utils"

/**
 * Render a styled div that serves as a skeleton placeholder for loading content.
 *
 * The element includes default skeleton styles and a `data-slot="skeleton"` attribute; any
 * `className` passed will be merged with the default classes.
 *
 * @param className - Additional CSS classes to append to the default skeleton styles
 * @returns The rendered skeleton `div` element
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