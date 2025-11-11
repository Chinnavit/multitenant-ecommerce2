import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines one or more class value inputs into a single merged class string suitable for Tailwind CSS.
 *
 * @param inputs - Class value(s) to combine (strings, arrays, objects, and other class value shapes)
 * @returns The consolidated class string with duplicate or conflicting Tailwind classes merged
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Build a tenant-specific URL according to the current environment.
 *
 * @param tenantSlug - The tenant identifier to include in the generated URL
 * @returns The tenant URL; in development `NEXT_PUBLIC_APP_URL/tenants/{tenantSlug}`, in production `https://{tenantSlug}.{NEXT_PUBLIC_ROOT_DOMAIN}`
 */
export function generateTenantURL(tenantSlug: string) {
  // In development mode, use normal routing
  if (process.env.NODE_ENV === "development") {
    return `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${tenantSlug}`;
  }

  const protocol = "https";
  const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN!;

  // In production mode, use subdomain routing
  return `${protocol}://${tenantSlug}.${domain}`;
}

/**
 * Format a numeric value as Thai Baht currency with no fractional digits.
 *
 * @param value - A number or numeric string to format
 * @returns The formatted currency string in Thai locale using THB (for example, `฿1,234`)
 */
export function formatCurrency(value: number | string) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(Number(value));
}