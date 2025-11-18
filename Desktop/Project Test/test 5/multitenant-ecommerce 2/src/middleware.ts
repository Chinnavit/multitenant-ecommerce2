import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (static / public files)
     * 4. all root files inside /public (e.g., /favicon.ico)
     */
    "/((?!api/|_next/|_static/|_vercel|media/|[\\w-]+\\.\\w+).*)",
  ],
};

/**
 * Rewrites requests from tenant subdomains to an internal tenant path or passes through otherwise.
 *
 * Determines whether the request's Host header ends with the configured root domain; if so,
 * extracts the tenant slug from the subdomain and rewrites the request to `/tenant/{tenantSlug}{originalPath}` preserving the original query and path. Otherwise, continues normal request processing.
 *
 * @param req - The incoming NextRequest used to read the Host header and original URL
 * @returns A NextResponse that rewrites to the tenant path when the host matches the root domain, or a NextResponse that continues processing when it does not
 */
export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  //Extract hostname (e.g.,"sin.centralArt.com" or "admin.centralArt.com")
  const hostname = req.headers.get("host") || "";

  const rootDomain = process.env.ROOT_DOMAIN || "";

  if (hostname.endsWith(`.${rootDomain}`)) {
    const tenantSlug = hostname.replace(`.${rootDomain}`, "");
    return NextResponse.rewrite(
      new URL(`/tenant/${tenantSlug}${url.pathname}`, req.url)
    );
  }

  return NextResponse.next();
}