"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

/**
 * Render a Tabs root that composes Radix UI's TabsPrimitive.Root with default layout styles and optional custom classes.
 *
 * @param className - Additional CSS classes to append to the default "flex flex-col gap-2" layout classes
 * @returns The TabsPrimitive.Root element with merged classes and all other props forwarded
 */
function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

/**
 * Renders the tab list container with standardized styling.
 *
 * Accepts an optional `className` to augment the built-in styles; all other props are forwarded to the underlying Radix `Tabs.List`.
 *
 * @param className - Additional CSS class names appended to the component's default styling
 * @returns The rendered `TabsPrimitive.List` element representing the tab list
 */
function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      )}
      {...props}
    />
  )
}

/**
 * Render a styled tab trigger element for Radix Tabs.
 *
 * @param className - Additional class names merged with the component's default styling
 * @param props - Remaining props forwarded to the underlying Radix `TabsPrimitive.Trigger`
 * @returns The rendered tabs trigger element
 */
function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

/**
 * Render a tab panel container with standardized layout and forwarded props.
 *
 * @param className - Additional CSS classes to merge with the default `"flex-1 outline-none"` styling.
 * @param props - All other props are forwarded to the underlying TabsPrimitive.Content element.
 * @returns The tab content element with `data-slot="tabs-content"` and merged class names.
 */
function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }