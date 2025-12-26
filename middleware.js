import { NextResponse } from "next/server";



export function middleware(req) {
  const pathname = req.nextUrl.pathname;

  // Protected routes
  const protectedRoutes = [
    "/dashboard",
    "/account",
    "/transaction",
  ];

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Clerk session cookie (safe check)
  const hasSession =
    req.cookies.get("__session") ||
    req.cookies.get("__clerk_session");

  if (isProtected && !hasSession) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/account/:path*",
    "/transaction/:path*",
  ],
};
