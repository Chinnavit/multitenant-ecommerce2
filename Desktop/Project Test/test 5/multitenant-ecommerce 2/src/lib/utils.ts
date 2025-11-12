import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine and deduplicate CSS class names for Tailwind usage.
 *
 * @param inputs - One or more class value entries (strings, arrays, or objects) to be combined
 * @returns The resulting class string with duplicates resolved according to Tailwind rules
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Build a tenant-specific URL using path routing in development and subdomain routing in production.
 *
 * @param tenantSlug - Tenant identifier used as a path segment in development and as a subdomain in production
 * @returns The fully-qualified tenant URL (development: `${NEXT_PUBLIC_APP_URL}/tenants/{tenantSlug}`; production: `https://{tenantSlug}.{NEXT_PUBLIC_ROOT_DOMAIN}`)
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
 * Format a numeric value as Thai baht currency with no fractional digits.
 *
 * @param value - A number or numeric string to format as THB
 * @returns The formatted currency string using the "th-TH" locale (Thai baht) with zero fraction digits
 */
export function formatCurrency(value: number | string) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(Number(value));
}