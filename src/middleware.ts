import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/sign-in", "/sign-up", "/", "/dashboard/:path*", "/verify/:path*"],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.SECRET });
  const url = request.nextUrl;
  const isAuthPage = ["/sign-in", "/sign-up", "/verify", "/"].some((path) =>
    url.pathname.startsWith(path)
  );
  const isProtectedPage = url.pathname.startsWith("/dashboard");

  if (token) {
    if (isAuthPage) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    // Allow access to protected pages if token is present
    if (isProtectedPage) {
      return NextResponse.next();
    }
  }

  // Redirect to root if no token and trying to access a protected page
  if (!token && isProtectedPage) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Proceed with the request if no conditions match
  return NextResponse.next();
}
