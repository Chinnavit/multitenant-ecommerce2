"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Renders a Radix Accordion root element with a fixed `data-slot="accordion"` while forwarding all received props.
 *
 * @returns A React element for the Accordion root with the provided props and `data-slot="accordion"`.
 */
function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />
}

/**
 * Renders an accordion item with a default bottom border and optional custom classes.
 *
 * @param className - Additional CSS class names to merge with the component's default border styling
 * @returns The rendered Accordion Item element with merged classes and forwarded props
 */
function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b last:border-b-0", className)}
      {...props}
    />
  )
}

/**
 * Renders an accordion trigger that displays given children with a right-aligned chevron icon.
 *
 * @param className - Optional additional class names merged with the component's default trigger styles.
 * @param children - Content rendered inside the trigger (label or custom elements).
 * @returns A React element representing a styled accordion trigger that forwards remaining props to the underlying Radix Trigger.
 */
function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

/**
 * Renders accordion panel content with open/close animations and a padded inner container.
 *
 * The component sets a `data-slot="accordion-content"` attribute, applies state-based
 * animation and overflow styles to the outer element, and merges `className` into the
 * inner padded wrapper.
 *
 * @param className - Additional CSS classes to apply to the inner content wrapper
 * @param children - Elements to render inside the accordion panel
 * @returns The accordion content element with animation and padding
 */
function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }