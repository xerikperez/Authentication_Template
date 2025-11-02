import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const publicRoutes = ["/", "/auth/login", "/auth/register"] as const;

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const token = await getToken({ req, raw: false });
  const isLoggedIn = !!token;
  const isPublicRoute = publicRoutes.some((route) =>
    nextUrl.pathname === route || nextUrl.pathname.startsWith(`${route}/`)
  );

  if (!isLoggedIn && !isPublicRoute) {
    const signInUrl = new URL("/auth/login", nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", nextUrl.pathname + nextUrl.search);
    return NextResponse.redirect(signInUrl);
  }

  if (isLoggedIn && (nextUrl.pathname === "/" || nextUrl.pathname.startsWith("/auth"))) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
