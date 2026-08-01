import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "access_token";
const publicRoutes = ["/login", "/register"];
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ?? "http://localhost:8080";

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const isAuthenticated = Boolean(token);

  if (!isPublicRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (path === "/" && isAuthenticated) {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/v1/users/me/preferences`,
        {
          headers: {
            Cookie: `${AUTH_COOKIE_NAME}=${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        if (data?.lastConversationId) {
          return NextResponse.redirect(
            new URL(`/${data.lastConversationId}`, req.nextUrl),
          );
        }
      }
    } catch (error) {
      console.error("error fetching user preferences in proxy:", error);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
