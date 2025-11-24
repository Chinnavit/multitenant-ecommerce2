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
 * Rewrites requests for tenant subdomains to the corresponding /tenant/{slug} path or allows normal processing otherwise.
 *
 * @param req - The incoming NextRequest; its Host header and URL pathname are inspected to determine tenant routing.
 * @returns A NextResponse that rewrites to `/tenant/{tenantSlug}{originalPath}` when the request hostname ends with the configured root domain, `NextResponse.next()` otherwise.
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