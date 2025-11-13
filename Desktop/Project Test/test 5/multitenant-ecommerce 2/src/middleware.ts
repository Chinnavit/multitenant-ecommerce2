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

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  //Extract hostname (e.g.,"sin.centralArt.com")
  const hostname = req.headers.get("host") || "";

  const rootDomain = process.env.ROOT_DOMAIN || "";

  if (hostname.endsWith(`.${rootDomain}`)) {
    const tenantSlug = hostname.replace(`.${rootDomain}`, "");
    return NextResponse.rewrite(new URL(`/tenant/${tenantSlug}${url.pathname}`, req.url));
  }

  return NextResponse.next();
};
