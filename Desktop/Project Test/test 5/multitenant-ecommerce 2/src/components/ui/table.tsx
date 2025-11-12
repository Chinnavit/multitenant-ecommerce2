"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Render a table inside a horizontally scrollable, full-width container.
 *
 * @param className - Optional additional CSS classes to apply to the table element
 * @returns A table element wrapped in a responsive container that enables horizontal scrolling
 */
function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
}

/**
 * Renders a styled table header section.
 *
 * @returns A `thead` element with slot attributes and merged classes for header styling.
 */
function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  )
}

/**
 * Render a styled tbody element that serves as the table body slot.
 *
 * The element includes a `data-slot="table-body"` attribute, applies default table-body styling, merges any provided `className`, and forwards all other props to the underlying `tbody`.
 *
 * @returns A `tbody` element with `data-slot="table-body"`, composed `className`, and forwarded props.
 */
function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

/**
 * Renders a styled table footer element for table layouts.
 *
 * @param className - Additional CSS class names to merge with the default footer classes.
 * @param props - Additional attributes and event handlers forwarded to the underlying `tfoot` element.
 * @returns The rendered `tfoot` element with `data-slot="table-footer"` and default footer styling.
 */
function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders a table row element with a slot attribute and default row styling while merging a provided `className`.
 *
 * @returns A `tr` element with `data-slot="table-row"` and the combined class names
 */
function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders a table header cell (<th>) with the component's default header styles.
 *
 * @param className - Additional CSS class(es) to merge with the component's default classes
 * @param props - Additional attributes and event handlers forwarded to the underlying `<th>` element
 * @returns The rendered `<th>` element with merged classes and forwarded props
 */
function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders a table cell (`td`) element with default spacing, alignment, and slot-specific classes.
 *
 * @returns A `td` element with the component's default table-cell classes merged with the provided `className` and all other props forwarded.
 */
function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders a table caption element with muted text styling and a slot attribute for composition.
 *
 * @returns A `caption` element with `data-slot="table-caption"` and merged styling classes.
 */
function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}