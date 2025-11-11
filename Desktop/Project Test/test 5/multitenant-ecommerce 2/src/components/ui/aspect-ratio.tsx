"use client"

import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"

/**
 * Renders a thin wrapper around Radix UI's AspectRatio Root that forwards all props and sets `data-slot="aspect-ratio"`.
 *
 * @param props - Props forwarded to `AspectRatioPrimitive.Root`
 * @returns A JSX element of `AspectRatioPrimitive.Root` with the forwarded props and `data-slot="aspect-ratio"`
 */
function AspectRatio({
  ...props
}: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />
}

export { AspectRatio }