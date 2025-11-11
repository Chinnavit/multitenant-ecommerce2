"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Render a styled <table> element inside a horizontally scrollable container.
 *
 * @param className - Additional CSS class names to merge with the component's base table styles.
 * @param props - All other props are passed through to the underlying `<table>` element.
 * @returns A `<div>` containing a `<table>` with merged class names and data-slot attributes for layout and styling.
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
 * Renders a table header (<thead>) element with default row-border styling.
 *
 * Merges the provided `className` with the component's base row-border styles and forwards remaining props to the underlying `<thead>`.
 *
 * @returns The rendered `<thead>` element
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
 * Renders a styled table body (<tbody>) element.
 *
 * @returns A `<tbody>` element with `data-slot="table-body"` and composed class names that remove the bottom border from the last row and include any provided `className`.
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
 * Renders a styled table footer element with the component's footer classes and data-slot.
 *
 * @param className - Additional class names to merge with the component's default footer styles
 * @returns A `<tfoot>` element with base footer styling, `data-slot="table-footer"`, and any other props applied
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
 * Renders a styled table row element for use inside the table primitives.
 *
 * Forwards remaining props to the underlying <tr> and composes the provided `className` with default styling.
 *
 * @returns A `<tr>` element with `data-slot="table-row"` and class names for hover, selected, and border states.
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
 * Renders a styled table header cell (<th>) with a data-slot attribute and merged class names.
 *
 * @param className - Additional CSS classes to merge with the component's default header styles
 * @returns A `<th>` element with the component's default styling, merged `className`, and all other props forwarded
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
 * Renders a styled table data cell (<td>) with consistent spacing and checkbox-aware layout.
 *
 * @param className - Additional CSS classes to merge with the component's base styles
 * @returns The rendered `<td>` element with merged class names and forwarded props
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
 * Renders a table caption element with muted foreground styling and spacing.
 *
 * @param className - Additional CSS class names to merge with the component's base styles.
 * @param props - Additional attributes forwarded to the underlying `<caption>` element.
 * @returns The rendered `<caption>` element with merged class names and forwarded props.
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