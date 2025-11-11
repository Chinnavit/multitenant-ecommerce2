import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

/**
 * Renders a navigation container for pagination controls.
 *
 * Applies default layout classes, allows additional class names, and forwards any other props to the rendered <nav> element.
 *
 * @param className - Additional CSS class names to append to the component's default classes
 * @param props - Additional props forwarded to the underlying `<nav>` element
 * @returns The configured `<nav>` element that serves as a pagination container
 */
function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

/**
 * Renders a UL element that serves as the pagination content container.
 *
 * Applies internal layout classes, merges any provided `className`, sets `data-slot="pagination-content"`, and forwards remaining props to the underlying `ul`.
 *
 * @param className - Additional class names to merge with the component's layout classes
 * @returns The rendered `ul` element used to contain pagination items
 */
function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  )
}

/**
 * Renders a list item that serves as a single pagination item.
 *
 * @param props - Props forwarded to the underlying `li` element
 * @returns The rendered `li` element with `data-slot="pagination-item"` and all provided props applied
 */
function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">

/**
 * Render a styled pagination anchor that reflects an active/current state.
 *
 * @param isActive - When `true`, marks the link as the current page by setting `aria-current` and applying active styling.
 * @param size - Button size variant to apply; defaults to `"icon"`.
 * @returns A JSX anchor element styled and annotated as a pagination link.
 */
function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className
      )}
      {...props}
    />
  )
}

/**
 * Render a previous-page pagination link containing a left chevron and a "Previous" label (visible on small screens and up).
 *
 * The link is configured as a pagination previous control with appropriate accessibility labeling.
 *
 * @returns A React element representing a previous-page pagination link.
 */
function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  )
}

/**
 * Render a "Next" pagination link with a right-facing chevron icon.
 *
 * @param props - Props forwarded to the underlying PaginationLink (e.g., href, onClick, className)
 * @returns A JSX element for the "Next" pagination control
 */
function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  )
}

/**
 * Renders a visual ellipsis indicator for truncated pagination.
 *
 * The element is a span with `aria-hidden` and `data-slot="pagination-ellipsis"`, contains a horizontal-more icon, and includes a screen-reader-only "More pages" label for accessibility.
 *
 * @returns A span element that visually indicates there are more pages; includes an icon and sr-only text.
 */
function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}