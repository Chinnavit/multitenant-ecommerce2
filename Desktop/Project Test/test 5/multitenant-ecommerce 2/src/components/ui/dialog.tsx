"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Render a dialog root element that forwards all props and includes data-slot="dialog".
 *
 * @returns A React element for the dialog root with `data-slot="dialog"`.
 */
function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

/**
 * Renders a dialog trigger element with a data-slot of "dialog-trigger".
 *
 * @returns A React element representing the dialog trigger.
 */
function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

/**
 * Renders a dialog portal element with a persistent `data-slot="dialog-portal"` attribute.
 *
 * @param props - Props passed through to the underlying Portal element.
 * @returns A Portal element with `data-slot="dialog-portal"` and any provided props applied.
 */
function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

/**
 * Renders a Dialog close control using Radix's Close primitive and applies `data-slot="dialog-close"`.
 *
 * @param props - Props forwarded to the underlying DialogPrimitive.Close element.
 * @returns The DialogPrimitive.Close element with the `data-slot="dialog-close"` attribute applied.
 */
function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

/**
 * Renders the dialog overlay element with a semi-transparent backdrop and built-in open/close animations.
 *
 * @param className - Additional CSS classes to merge with the component's default overlay styling
 * @returns The overlay element with backdrop, animation state classes, and the composed `className`
 */
function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders dialog content inside a portal with an overlay and optional close button.
 *
 * Renders Radix Dialog content centered in a portal, includes the overlay, and optionally
 * mounts a close button in the top-right of the content.
 *
 * @param className - Additional CSS classes applied to the content container
 * @param children - Elements displayed inside the dialog content
 * @param showCloseButton - If `true`, renders a close button in the top-right; defaults to `true`
 * @returns The dialog content element rendered inside a portal with its overlay
 */
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

/**
 * Renders a styled container for dialog header content.
 *
 * @param className - Optional additional CSS classes to merge with the header's default layout and spacing.
 * @param props - Additional HTML div attributes that are forwarded to the root element.
 * @returns A div element used as the dialog header container (has `data-slot="dialog-header"`).
 */
function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

/**
 * Renders a footer container for dialog actions with responsive layout.
 *
 * The footer stacks actions vertically in reverse order on small screens and
 * arranges them horizontally aligned to the end on larger screens.
 *
 * @param className - Additional CSS classes to merge with the footer's default styles
 * @returns A `div` element styled and attributed as the dialog footer
 */
function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders a dialog title element with default title styling and a `data-slot` attribute.
 *
 * The provided `className` is merged with the component's default title classes.
 *
 * @returns A DialogPrimitive.Title element with merged classes and `data-slot="dialog-title"`.
 */
function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  )
}

/**
 * Renders a styled dialog description element with data-slot="dialog-description".
 *
 * @returns The dialog description element with muted, small text and any additional classes applied.
 */
function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}