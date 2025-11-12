import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Renders a breadcrumb navigation container.
 *
 * The component outputs a <nav> element with `aria-label="breadcrumb"` and `data-slot="breadcrumb"`. All provided props are forwarded to the underlying `<nav>`.
 *
 * @param props - Props to spread onto the rendered `<nav>` element
 * @returns The rendered breadcrumb `<nav>` element
 */
function Breadcrumb({ ...props }: React.ComponentProps<"nav">) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />
}

/**
 * Renders an ordered breadcrumb list container.
 *
 * Applies layout and typographic classes for breadcrumb presentation and forwards all remaining props to the underlying `<ol>` element.
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
 * Renders a breadcrumb list item element with default layout and spacing.
 *
 * @param className - Additional CSS classes appended to the component's default classes.
 * @returns A `<li>` element with `data-slot="breadcrumb-item"`, base inline-flex layout and gap classes, and any other `li` props spread onto it.
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
 * Renders a breadcrumb link as an anchor or, when `asChild` is true, as a Radix `Slot`.
 *
 * @param asChild - If `true`, render via Radix `Slot` to pass props to a child element instead of an `<a>`.
 * @param className - Additional class names to merge with the component's default hover and transition styles.
 * @returns The rendered anchor or `Slot` element with `data-slot="breadcrumb-link"` and the applied classes.
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
 * Renders the current breadcrumb page as a non-interactive element.
 *
 * @param className - Additional CSS classes appended to the component
 * @param props - Remaining props are spread onto the underlying `span`
 * @returns A `span` element representing the current breadcrumb page with accessibility attributes set (`role="link"`, `aria-disabled="true"`, `aria-current="page"`)
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
 * Render a breadcrumb separator list item that is visually an icon or provided content.
 *
 * @param children - Optional content to display inside the separator; if omitted the component renders a right chevron icon.
 * @returns The `<li>` element used as the breadcrumb separator containing `children` or a `ChevronRight` icon.
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
 * Renders an ellipsis separator for collapsed breadcrumb items.
 *
 * @returns A <span> element containing a MoreHorizontal icon and an accessible "More" label; the element uses presentation semantics (role="presentation") and is hidden from assistive technologies (aria-hidden="true").
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