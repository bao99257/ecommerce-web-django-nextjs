import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Lấy token từ cookies
  const access = request.cookies.get("access")?.value;

  // Những trang chỉ cho người đã login vào
  const protectedPaths = ["/profile", "/addresses", "/orders"];

  const currentPath = request.nextUrl.pathname;

  // Nếu chưa login mà truy cập trang cần login → redirect về /login
  if (!access && protectedPaths.includes(currentPath)) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile", "/addresses/:path*", "/orders"], // Những route cần chạy middleware
};
