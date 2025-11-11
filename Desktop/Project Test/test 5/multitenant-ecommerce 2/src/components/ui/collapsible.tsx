"use client"

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

/**
 * Wraps Radix Collapsible.Root, forwards all received props, and sets data-slot="collapsible" for DOM targeting.
 *
 * @param props - Props to pass through to the underlying Collapsible root element.
 * @returns A React element rendering the configured Collapsible root.
 */
function Collapsible({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

/**
 * Renders a Radix CollapsibleTrigger with a `data-slot` attribute for DOM targeting.
 *
 * @param props - Props forwarded to Radix's `CollapsibleTrigger` primitive.
 * @returns A React element for a collapsible trigger configured with `data-slot="collapsible-trigger"`.
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
 * Renders a CollapsibleContent wrapper that forwards props to the underlying primitive and sets `data-slot="collapsible-content"`.
 *
 * @param props - Props passed through to the underlying CollapsibleContent primitive.
 * @returns A CollapsibleContent element with the provided props and the `data-slot="collapsible-content"` attribute.
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