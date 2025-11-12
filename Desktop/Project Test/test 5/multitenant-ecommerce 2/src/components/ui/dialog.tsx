"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Renders a Dialog root wrapper that forwards all props to Radix's Dialog.Root and sets data-slot "dialog".
 *
 * @returns A Dialog.Root element with data-slot `"dialog"` and the forwarded props
 */
function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

/**
 * Render the trigger element for a dialog.
 *
 * @returns The rendered trigger element with the provided props applied.
 */
function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

/**
 * Renders a Radix Dialog Portal element with the `data-slot="dialog-portal"` attribute for slot-based composition.
 *
 * @returns A Portal element that renders its children into a DOM portal and includes the `data-slot="dialog-portal"` attribute.
 */
function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

/**
 * Wraps the Radix Dialog `Close` primitive, attaching a `data-slot="dialog-close"` and forwarding all props.
 *
 * @returns A `DialogPrimitive.Close` element with `data-slot="dialog-close"` and the provided props applied.
 */
function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

/**
 * Renders the dialog's backdrop overlay with default backdrop and animation styles.
 *
 * @param className - Additional CSS class names to merge with the overlay's default styles
 * @returns The React element used as the dialog overlay/backdrop
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
 * Renders dialog content inside a portal with an overlay and an optional built-in close button.
 *
 * Renders a DialogPortal containing a DialogOverlay and Radix Dialog Content, and attaches data-slot attributes for slot querying.
 *
 * @param className - Additional class names applied to the content container
 * @param children - Content to render inside the dialog
 * @param showCloseButton - When `true`, renders a positioned close button inside the dialog (default: `true`)
 * @param props - Additional props forwarded to the underlying Radix Dialog Content element
 * @returns The rendered dialog content element
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
 * Renders a header container for dialog content with default layout and slot metadata.
 *
 * Applies a column flex layout, vertical gap, and responsive text alignment, and merges any
 * provided `className` with the defaults. The element is marked with `data-slot="dialog-header"`.
 *
 * @param className - Additional CSS class names to merge with the component's default classes
 * @returns The rendered header element for use inside a dialog
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
 * Renders a footer container for dialog actions with a responsive layout.
 *
 * @param className - Additional CSS classes merged with the default layout
 * @returns A `div` element with `data-slot="dialog-footer"` that stacks children in a column on small screens and arranges them in a right-aligned row on larger screens
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
 * Renders the dialog's title element with consistent typography and a `data-slot="dialog-title"`.
 *
 * Accepts all props for Radix's Title primitive and merges `className` with the component's default title styles.
 *
 * @param className - Additional CSS classes to append to the default title styles.
 * @returns The rendered DialogPrimitive.Title element configured for the dialog header.
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
 * Renders a dialog description element with consistent styling and a data-slot of "dialog-description".
 *
 * @param className - Additional class names to append to the default description styles
 * @returns The DialogPrimitive.Description element with merged classes and any other passed props
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