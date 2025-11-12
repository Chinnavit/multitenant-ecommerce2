"use client"

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

/**
 * Wraps Radix's Collapsible Root, forwarding all received props and adding a `data-slot="collapsible"` attribute.
 *
 * @param props - Props to pass through to `CollapsiblePrimitive.Root`
 * @returns A `CollapsiblePrimitive.Root` element with `data-slot="collapsible"` and the provided props applied
 */
function Collapsible({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

/**
 * Wraps Radix UI's CollapsibleTrigger, forwarding all received props and adding a `data-slot="collapsible-trigger"` attribute.
 *
 * @param props - Props forwarded to the underlying Radix `CollapsibleTrigger` component
 * @returns A `CollapsibleTrigger` element with `data-slot="collapsible-trigger"` and all provided props applied
 */
function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  )
}

/**
 * Wraps the Radix CollapsibleContent primitive and injects a `data-slot="collapsible-content"` attribute.
 *
 * @param props - Props forwarded to the underlying Radix `CollapsibleContent` primitive
 * @returns The rendered `CollapsibleContent` element with forwarded props and the `data-slot` attribute
 */
function CollapsibleContent({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      {...props}
    />
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }