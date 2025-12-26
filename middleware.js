import { NextResponse } from "next/server";

// Lightweight middleware: check for presence of cookies on protected routes and redirect
// unauthenticated requests to `/sign-in`. This avoids importing Clerk or Arcjet in the Edge
// middleware to keep the Edge Function bundle small.
const protectedRegex = /^\/(dashboard|account|transaction)(\/|$)/;

export function middleware(req) {
  const { pathname } = req.nextUrl;

  if (protectedRegex.test(pathname)) {
    const cookieHeader = req.headers.get("cookie") || "";

    // If no cookies present, treat as unauthenticated and redirect to sign-in
    if (!cookieHeader) {
      const signInUrl = new URL("/sign-in", req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
