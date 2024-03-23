import { isBefore } from "date-fns";
import { jwtDecode } from "jwt-decode";
import { NextResponse, type NextRequest } from "next/server";

function redirect(request: NextRequest, newDest: string) {
  const isLogin = request.nextUrl.pathname.startsWith("/login");
  if (isLogin && newDest === "/login") {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL(newDest, request.url));
}

export function middleware(request: NextRequest) {
  const cookies = request.cookies;
  const isLogin = request.nextUrl.pathname.startsWith("/login");
  const isLogout = request.nextUrl.pathname.startsWith("/logout");
  if (isLogout) {
    const response = NextResponse.next({
      status: 302,
      headers: {
        // redirect to login
        location: request.nextUrl.origin + "/login",
      },
    });
    response.cookies.delete("jwt");
    return response;
  }
  const token = cookies.get("jwt")?.value;
  if (!token) {
    return redirect(request, "/login");
  }
  const decoded = jwtDecode(token);
  if (decoded.exp && isBefore(new Date(decoded.exp * 1000), Date.now())) {
    return redirect(request, "/login");
  }
  if (isLogin) {
    return redirect(request, "/dashboard");
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
