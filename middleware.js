// import { withAuth } from "next-auth/middleware";

// export default withAuth(
//   function middleware(req) {
//     const { role, verified } = req.nextauth.token;
//     const pathname = req.nextUrl.pathname;
//     console.log(pathname);
//     //if user tries to go to login pages even thought he/she
//     // is already logged in
//     if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
//       console.log("er");
//       return NextResponse.redirect(new URL("/", req.url));
//     }

//     // if user tries to go to admin pages
//     if (pathname.startsWith("/admin") && role !== "admin") {
//       return NextResponse.redirect(new URL("/", req.url));
//     }

//     // if user tries to go to verification even though he/she
//     // is already verified
//     if (
//       verified &&
//       (pathname.startsWith("/verification") || pathname.startsWith("/verify"))
//     ) {
//       return NextResponse.redirect(new URL("/", req.url));
//     }

//     // if user is not verified continue to verification
//     if (!verified) {
//       return NextResponse.redirect(new URL("/verification", req.url));
//     }
//   },
//   {
//     callbacks: {
//       authorized({ token }) {
//         if (token && (token.role == "user" || token.role == "admin")) {
//           return true;
//         }
//         return false;
//       },
//     },
//   }
// );

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

  // if going to admin
  if (pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (session && verified && role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // if going to homepage
  if (pathname == "/") {
    if (session && verified && role == "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  // if going to user protected routes
  if (userProtectedRoutes.includes(pathname)) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (session && !verified && role !== "admin") {
      return NextResponse.redirect(new URL("/verification", req.url));
    }
    if (session && verified && role == "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  // if going to verification pages
  if (pathname == "/verification") {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (session && verified) {
      if (role == "user") {
        return NextResponse.redirect(new URL("/", req.url));
      }
      if (role == "admin") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
    }
  }

  // if going to auth pages
  if (pathname == "/login" || pathname == "/signup") {
    if (session && verified) {
      if (role == "user") {
        return NextResponse.redirect(new URL("/", req.url));
      }
      if (role == "admin") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
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
