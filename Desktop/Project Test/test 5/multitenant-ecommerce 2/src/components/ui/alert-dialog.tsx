"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

/**
 * Renders a Radix AlertDialog root element with a standardized `data-slot` attribute and forwards all received props.
 *
 * @param props - Props to pass through to the underlying Radix `AlertDialog.Root`
 * @returns A React element for the AlertDialog root with the `data-slot="alert-dialog"` attribute applied
 */
function AlertDialog({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

/**
 * Renders the AlertDialog trigger element with the `data-slot="alert-dialog-trigger"` attribute.
 *
 * @returns The trigger element configured for the AlertDialog, forwarding any received props to the underlying primitive.
 */
function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  )
}

/**
 * Wraps Radix's AlertDialog Portal and attaches a `data-slot="alert-dialog-portal"` attribute.
 *
 * @param props - Props forwarded to the underlying Radix AlertDialog Portal component
 * @returns The rendered AlertDialog portal element
 */
function AlertDialogPortal({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  )
}

/**
 * Renders the alert dialog overlay element with standardized styling and a `data-slot="alert-dialog-overlay"`.
 *
 * @param props - Props forwarded to the underlying Radix Overlay; `className` can be used to extend or override styles.
 * @returns The overlay React element.
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
 * Renders the dialog content inside a portal with an overlay, applying consistent layout, animation, and styling and exposing a `data-slot="alert-dialog-content"` attribute.
 *
 * @param className - Additional CSS class names to merge with the component's default styles
 * @returns The rendered AlertDialog content element
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
 * Renders the header container for an AlertDialog with standardized layout and slot attribute.
 *
 * @returns The alert dialog header element with predefined flex column layout, spacing, text alignment, and any additional `className` merged.
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
 * Renders the AlertDialog footer container that layouts action buttons responsively.
 *
 * The returned element is a `div` with the `data-slot="alert-dialog-footer"` attribute and default classes that stack actions vertically on small screens and align them to the end in a row on larger screens. `className` and other `div` props are forwarded to the element.
 *
 * @returns A `div` element serving as the dialog footer with responsive layout for actions.
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
 * Renders a styled title element for an AlertDialog.
 *
 * @returns The AlertDialog title element with standard styling and applied props
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
 * Renders the alert dialog description slot with muted, small text styling.
 *
 * @param className - Additional CSS class names merged with the component's default `text-muted-foreground text-sm` styling
 * @returns The rendered alert dialog description element
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
 * Renders a styled AlertDialog action button that applies primary button styles and accepts additional class names.
 *
 * @param className - Additional CSS class names to merge with the component's default button styles
 * @returns The AlertDialog action element with primary button styling and any provided `className` applied
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
 * Renders a styled "cancel" action button for the AlertDialog using the outline button variant.
 *
 * @param className - Additional CSS class names to apply to the button
 * @returns A Cancel button element styled with the outline variant that forwards all other props to the underlying AlertDialog Cancel primitive
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