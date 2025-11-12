import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

/**
 * Renders a navigation wrapper for pagination controls.
 *
 * The element has role="navigation", aria-label="pagination", and data-slot="pagination", applies a centered full-width layout, and spreads any additional props onto the <nav>.
 *
 * @param className - Optional additional class names to merge with the component's base layout classes
 * @returns The configured <nav> element for pagination
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
 * Renders the container UL for pagination items.
 *
 * @returns The rendered `ul` element used to hold pagination items with horizontal layout, centered alignment, and consistent gap. Data attribute: `data-slot="pagination-content"`.
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
 * Renders a list item used as a pagination item.
 *
 * The element includes `data-slot="pagination-item"` and forwards all received props to the `li`.
 *
 * @returns A list item element configured as a pagination item.
 */
function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">

/**
 * Renders a styled pagination anchor used for page links.
 *
 * @param className - Additional class names applied to the anchor element.
 * @param isActive - Whether this link represents the current page; when `true` sets `aria-current="page"` and applies active styles.
 * @param size - Button size variant to apply; defaults to `"icon"`.
 * @returns A React `<a>` element representing the pagination link.
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
 * Renders a pagination control for navigating to the previous page.
 *
 * @param props - Props forwarded to the rendered pagination link; accepts `className` and all props supported by `PaginationLink`.
 * @returns A JSX element representing the "previous" pagination link with a chevron icon and responsive "Previous" label.
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
 * Renders a pre-configured "Next" pagination control.
 *
 * @param className - Additional class names to merge with the component's default spacing classes
 * @param props - Additional props are forwarded to PaginationLink
 * @returns A PaginationLink element configured for navigating to the next page
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
 * Renders a decorative pagination ellipsis element.
 *
 * @param props - Additional span attributes; `className` and other props are forwarded to the ellipsis container.
 * @returns A span element used to indicate skipped pages in pagination.
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