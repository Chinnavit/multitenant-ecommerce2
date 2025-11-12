"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"

import { cn } from "@/lib/utils"

/**
 * Wraps DrawerPrimitive.Root, injecting data-slot="drawer" and forwarding all received props.
 *
 * @param props - Props accepted by `DrawerPrimitive.Root`; all props are forwarded to the underlying root element.
 * @returns The rendered DrawerPrimitive.Root element with the `data-slot="drawer"` attribute.
 */
function Drawer({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />
}

/**
 * Renders the drawer trigger element.
 *
 * @returns The `DrawerPrimitive.Trigger` element with `data-slot="drawer-trigger"` and any forwarded props
 */
function DrawerTrigger({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

/**
 * Renders a drawer portal element with a `data-slot="drawer-portal"` attribute.
 *
 * @param props - Props forwarded to the portal element
 * @returns A portal element for rendering drawer content
 */
function DrawerPortal({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
}

/**
 * Renders a close control for a drawer and forwards all props to the rendered element.
 *
 * @returns The close control element with `data-slot="drawer-close"`.
 */
function DrawerClose({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
}

/**
 * Renders the translucent backdrop overlay for the drawer and applies direction/state animation classes.
 *
 * @param className - Additional CSS class names appended to the overlay's base classes
 * @param props - Other props forwarded to the underlying Vaul `DrawerPrimitive.Overlay`
 * @returns The rendered overlay element used behind the drawer content
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
 * Renders the drawer's content inside a portal with an overlay and direction-responsive styling.
 *
 * @param className - Additional CSS classes to append to the drawer content container.
 * @param children - Elements rendered inside the drawer content area.
 * @returns The drawer content element wrapped in a portal and overlay, with classes that adapt to the drawer's direction.
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
 * Renders the header area for the drawer content with responsive alignment and spacing.
 *
 * @param className - Additional class names to merge with the component's base styles.
 * @param props - Additional div attributes forwarded to the header element.
 * @returns The header div element used inside drawer content.
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
 * Renders the footer area for the drawer content.
 *
 * The element has a `data-slot="drawer-footer"` attribute and applies baseline layout
 * classes for spacing and alignment; any `className` passed is merged with these defaults.
 *
 * @param className - Additional CSS class names to merge with the footer's default classes
 * @returns A `div` element with `data-slot="drawer-footer"` and the footer layout classes applied
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
 * Renders a Drawer title element with default heading styles.
 *
 * @returns The rendered Drawer title element with default typography classes and any provided props
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
 * Renders the drawer's description element with default muted styling and a data-slot.
 *
 * @param className - Additional CSS class names to apply to the description element
 * @param props - Additional props forwarded to DrawerPrimitive.Description
 * @returns A DrawerPrimitive.Description element with `data-slot="drawer-description"` and base classes `text-muted-foreground text-sm`
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