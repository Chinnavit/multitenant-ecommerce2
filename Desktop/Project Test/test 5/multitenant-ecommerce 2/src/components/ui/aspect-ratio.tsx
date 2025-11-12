"use client"

import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"

/**
 * Renders a Radix AspectRatio root and forwards all received props.
 *
 * @param props - Properties accepted by `AspectRatioPrimitive.Root`; all props are spread onto the underlying element.
 * @returns A JSX element rendering `AspectRatioPrimitive.Root` with `data-slot="aspect-ratio"`.
 */
function AspectRatio({
  ...props
}: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />
}

export { AspectRatio }