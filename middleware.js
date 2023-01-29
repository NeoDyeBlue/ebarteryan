import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

/**
 * https://stackoverflow.com/questions/71450003/restrict-sign-and-signup-page-after-auth-nextauth-nextjs
 * @param {*} req
 * @returns
 */

export async function middleware(req) {
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });
  const { verified, role } = session || {};
  const pathname = req.nextUrl.pathname;
  const userProtectedRoutes = [
    "/messages",
    "/profile",
    "/offers",
    "/saved",
    "/notifications",
    "/create",
  ];

  // if going to user protected routes
  if (userProtectedRoutes.includes(pathname)) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (session && !verified) {
      return NextResponse.redirect(new URL("/verification", req.url));
    }
  }

  // if going to password reset page
  if (pathname == "/password/reset" || pathname == "/password/new") {
    if (session) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
  // if going to password pages
  if (pathname == "/verification") {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (session && verified) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // if going to auth pages
  if (pathname == "/login" || pathname == "/signup") {
    if (session && verified) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (session && !verified) {
      return NextResponse.redirect(new URL("/verification", req.url));
    }
  }
}

export const config = {
  matcher: [
    "/((?!api|_next|fonts|examples|[\\w-]+\\.\\w+).*)",
    // "/admin/:path*",
    // "/messages",
    // "/notifications",
    // "/offers",
    // "/profile",
    // "/create",
    // "/saved",
    // "/",
    // "/signup",
    // "/:path*",
  ],
};
