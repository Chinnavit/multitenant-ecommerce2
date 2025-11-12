import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Card container element used as the root for card UI primitives.
 *
 * Renders a div with data-slot="card", applies base card styling combined with any provided `className`, and forwards all other props to the underlying div.
 *
 * @returns A JSX element representing the card container.
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
 * Renders the header region of a card with layout utilities and a `data-slot="card-header"` attribute.
 *
 * Accepts standard div props and composes the provided `className` with the component's default header styles.
 *
 * @returns The header element to place at the top of a Card.
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
 * Renders a card title element with default title styling and a `data-slot` attribute for composition.
 *
 * Applies base text styles (`leading-none`, `font-semibold`), merges any provided `className`, and forwards all received div props to the underlying element.
 *
 * @returns A `div` element with `data-slot="card-title"` representing the card's title.
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
 * Renders the card's description region with muted, small body text.
 *
 * @param className - Additional CSS class names appended to the component's default description styles
 * @returns A div element used for the card description, combining the component's base styles with any provided classes and forwarded props
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
 * Renders the card action slot positioned within the card layout for aligning actions (e.g., buttons).
 *
 * @param className - Additional CSS class names to merge with the component's default layout classes
 * @returns A `div` element with `data-slot="card-action"` positioned for card actions
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
 * Renders the main content area of a Card with default horizontal padding.
 *
 * @param className - Additional class names appended to the default padding
 * @returns A div with `data-slot="card-content"`, `px-6` padding, and any provided props and classes applied
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
 * Renders the footer region of a Card, providing layout and padding for footer content.
 *
 * @returns The div element used as the card footer with `data-slot="card-footer"` and composed footer styles.
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