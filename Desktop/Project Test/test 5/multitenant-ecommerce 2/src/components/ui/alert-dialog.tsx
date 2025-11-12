"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

/**
 * Renders the AlertDialog root component and attaches a `data-slot="alert-dialog"` attribute.
 *
 * @returns The AlertDialog root React element.
 */
function AlertDialog({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

/**
 * Renders the alert dialog trigger element with a standardized data-slot attribute.
 *
 * Forwards received props to the underlying trigger element and applies data-slot="alert-dialog-trigger".
 *
 * @param props - Props to pass to the trigger element
 * @returns The configured alert dialog trigger element
 */
function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  )
}

/**
 * Renders the AlertDialog portal element and applies a data-slot attribute for integration hooks.
 *
 * @param props - Props forwarded to the underlying AlertDialog Portal primitive
 * @returns The configured portal element for the alert dialog
 */
function AlertDialogPortal({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  )
}

/**
 * Renders the dialog overlay with consistent backdrop and animation classes.
 *
 * @param className - Additional CSS classes to merge with the default overlay styles
 * @returns The AlertDialog overlay element with backdrop, positioning, and open/close animations
 */
function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders the alert dialog's content centered on screen and includes its portal and overlay.
 *
 * @param className - Additional CSS class names to apply to the content container
 * @returns The rendered alert dialog content element (wrapped with portal and overlay)
 */
function AlertDialogContent({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content>) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  )
}

/**
 * Renders the header container for an AlertDialog with standardized layout and spacing.
 *
 * Renders a `div` element with `data-slot="alert-dialog-header"` and default classes for vertical layout, gap, and responsive text alignment; any `className` and other props are forwarded to the element.
 *
 * @returns A `div` element used as the alert dialog header.
 */
function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

/**
 * Renders the footer container for an alert dialog, arranging action controls responsively.
 *
 * @param className - Additional CSS classes appended to the footer's default layout
 * @returns The rendered alert dialog footer element
 */
function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders the alert dialog's title with standardized styling and integration attributes.
 *
 * Applies default font size and weight, merges any provided `className`, and sets the `data-slot` attribute to `"alert-dialog-title"`.
 *
 * @returns The alert dialog title element.
 */
function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  )
}

/**
 * Renders the alert dialog's description element with standardized muted, small-text styling.
 *
 * @returns A React element for the alert dialog description that applies the `data-slot="alert-dialog-description"` attribute and merges the provided `className` with default muted small-text classes.
 */
function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

/**
 * Renders an AlertDialog action button with standardized button styling.
 *
 * @param className - Additional CSS classes to apply to the action button
 * @returns The rendered AlertDialog action element
 */
function AlertDialogAction({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action>) {
  return (
    <AlertDialogPrimitive.Action
      className={cn(buttonVariants(), className)}
      {...props}
    />
  )
}

/**
 * Renders a styled cancel button for the AlertDialog using the outlined button variant.
 *
 * @param className - Additional CSS class names to apply on top of the default outlined button styles
 * @returns The Cancel action element for the AlertDialog
 */
function AlertDialogCancel({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  return (
    <AlertDialogPrimitive.Cancel
      className={cn(buttonVariants({ variant: "outline" }), className)}
      {...props}
    />
  )
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}