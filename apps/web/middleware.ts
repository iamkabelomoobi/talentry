import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_MARKERS = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
];

const hasBetterAuthSession = (request: NextRequest): boolean =>
  request.cookies
    .getAll()
    .some((cookie) => SESSION_COOKIE_MARKERS.some((marker) => cookie.name.includes(marker)));

export function middleware(request: NextRequest) {
  if (!hasBetterAuthSession(request)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/auth/:path*"],
};
