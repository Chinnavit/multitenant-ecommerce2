import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Renders a semantic container for a breadcrumb navigation region.
 *
 * @param props - Props forwarded to the underlying `nav` element (e.g., `className`, event handlers, ARIA attributes).
 * @returns A `nav` element with `aria-label="breadcrumb"` and `data-slot="breadcrumb"`.
 */
function Breadcrumb({ ...props }: React.ComponentProps<"nav">) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />
}

/**
 * Renders an ordered list container for breadcrumb items with default styling and attributes.
 *
 * @returns The rendered `<ol>` element configured as a breadcrumb list (`data-slot="breadcrumb-list"`).
 */
function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders a breadcrumb list item with default inline-flex alignment and gap.
 *
 * Merges the provided `className` with the component's base styles and forwards all other `li` props.
 *
 * @returns A JSX `li` element with `data-slot="breadcrumb-item"` and the combined class names
 */
function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  )
}

/**
 * Render a breadcrumb link element that uses an anchor by default or the provided child element when `asChild` is true.
 *
 * @param asChild - If `true`, use the passed child element instead of rendering an `<a>` tag.
 * @param className - Additional CSS class names to apply to the rendered element.
 * @returns A React element representing the breadcrumb link.
 */
function BreadcrumbLink({
  asChild,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn("hover:text-foreground transition-colors", className)}
      {...props}
    />
  )
}

/**
 * Render a breadcrumb page label that represents the current page.
 *
 * The element is a span styled for breadcrumb pages and is marked with `aria-current="page"`
 * and `aria-disabled="true"` to indicate it is the active, non-interactive item.
 *
 * @returns A span element representing the current breadcrumb item with `aria-current="page"` and `aria-disabled="true"`.
 */
function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("text-foreground font-normal", className)}
      {...props}
    />
  )
}

/**
 * Renders a breadcrumb separator list item that displays a separator icon or custom content.
 *
 * The element is marked as presentational and hidden from assistive technologies.
 *
 * @param children - Optional custom separator content; when omitted a `ChevronRight` icon is rendered.
 * @param className - Additional CSS classes merged with the component's default styles (targets nested SVG size).
 * @returns The separator `li` element used between breadcrumb items.
 */
function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  )
}

/**
 * Renders an accessible ellipsis separator for breadcrumb lists.
 *
 * @returns A span element that visually displays an ellipsis icon and a screen-reader-only "More" label to indicate additional breadcrumb items.
 */
function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More</span>
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}