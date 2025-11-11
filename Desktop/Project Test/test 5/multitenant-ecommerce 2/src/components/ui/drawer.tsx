"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"

import { cn } from "@/lib/utils"

/**
 * Drawer root component that forwards all props and sets data-slot="drawer".
 *
 * Renders the drawer container and passes every received prop through to the underlying drawer root element.
 */
function Drawer({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />
}

/**
 * Render a Drawer trigger element with the `data-slot="drawer-trigger"` attribute.
 *
 * @returns The Drawer trigger React element
 */
function DrawerTrigger({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

/**
 * Renders the drawer's portal element and marks it with `data-slot="drawer-portal"`.
 *
 * @param props - Props forwarded to the underlying Portal component
 * @returns The portal element used to render drawer content into a React portal
 */
function DrawerPortal({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
}

/**
 * Renders a drawer close trigger element with a consistent data-slot attribute.
 *
 * @param props - Props to pass through to the underlying Close primitive
 * @returns The Drawer close trigger element
 */
function DrawerClose({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
}

/**
 * Renders the drawer backdrop overlay with a semi-transparent background, fixed positioning, z-index, and open/close animations.
 *
 * @param className - Additional class names appended to the overlay's default styles.
 * @returns The overlay element with merged className and `data-slot="drawer-overlay"`.
 */
function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders the drawer content area inside a portal with an overlay and direction-aware styling.
 *
 * The component mounts a portal and overlay, then renders the underlying drawer content element
 * with data-slot="drawer-content" and responsive classes that adapt to vaul-drawer-direction
 * (top, bottom, left, right). It also renders a small draggable handle that is visible for
 * bottom-positioned drawers.
 *
 * @param className - Additional CSS classes to append to the content container.
 * @param children - Elements to display inside the drawer content.
 * @returns The composed drawer content element.
 */
function DrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content>) {
  return (
    <DrawerPortal data-slot="drawer-portal">
      <DrawerOverlay />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        className={cn(
          "group/drawer-content bg-background fixed z-50 flex h-auto flex-col",
          "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b",
          "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=bottom]:border-t",
          "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm",
          "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm",
          className
        )}
        {...props}
      >
        <div className="bg-muted mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  )
}

/**
 * Renders the header region for a Drawer with layout and responsive text-alignment styles.
 *
 * @param props - Standard div props. The `className` prop is merged with the component's default classes.
 * @returns A div element with `data-slot="drawer-header"` containing header content and applied spacing/typography classes.
 */
function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        "flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-1.5 md:text-left",
        className
      )}
      {...props}
    />
  )
}

/**
 * Footer container for Drawer content that provides spacing and vertical layout.
 *
 * @param className - Optional additional CSS classes to merge with the default footer styles
 * @param props - Additional `div` props which are forwarded to the rendered element
 * @returns The rendered footer element with default layout classes, merged `className`, and forwarded props
 */
function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

/**
 * Renders a drawer title element with consistent typography and a data-slot for composition.
 *
 * @returns A `DrawerPrimitive.Title` element using the foreground text color and semibold font weight; any `className` passed in is merged with the defaults and all other props are forwarded to the underlying element.
 */
function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn("text-foreground font-semibold", className)}
      {...props}
    />
  )
}

/**
 * Renders a drawer description element with standard muted typography.
 *
 * @param className - Additional CSS classes to merge with the default `text-muted-foreground text-sm` styles
 * @returns A `DrawerPrimitive.Description` element with muted foreground and small text styling
 */
function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}