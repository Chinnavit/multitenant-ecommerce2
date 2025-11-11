import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Render a card container div with base card styles and a `data-slot="card"` attribute.
 *
 * @param className - Additional CSS class names appended to the card's base styles
 * @returns A div element styled as a card (rounded, bordered, shadowed, vertical layout) with `data-slot="card"`
 */
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders the header region of a Card with grid layout, spacing, and a data-slot of "card-header".
 *
 * Forwards any additional div props to the underlying element.
 *
 * @returns The header DOM element for a Card with the composed layout and styling classes
 */
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders a title container for a Card with title typography and a `data-slot="card-title"` marker.
 *
 * @returns A `div` element with leading-none and font-semibold typography classes and `data-slot="card-title"`.
 */
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

/**
 * Renders a div intended to hold a card's descriptive text.
 *
 * @returns A div element with `data-slot="card-description"`, muted foreground and small text styling; merges a provided `className` and forwards remaining div props.
 */
function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

/**
 * Renders the card's action container used for end-aligned controls within the card layout.
 *
 * The element receives layout classes to position it in the card grid and includes `data-slot="card-action"`.
 *
 * @returns A div element used as the card action container with composed class names and the `data-slot="card-action"` attribute.
 */
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders the content area of a Card.
 *
 * Applies horizontal padding, composes the provided `className` with the base styling, sets `data-slot="card-content"`, and forwards remaining div props to the underlying element.
 *
 * @returns The card content container element.
 */
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

/**
 * Renders a card footer container with footer layout, horizontal padding, centered items, and top spacing.
 *
 * @returns A `div` element with `data-slot="card-footer"`, composed footer classes, and any provided div props applied.
 */
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}