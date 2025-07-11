import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyAdminAuth } from "./lib/admin-middleware"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const publicAdminRoutes = ["/admin/login", "/admin/init-super-admin"]

  if (pathname.startsWith("/admin") && !publicAdminRoutes.includes(pathname)) {
    const admin = await verifyAdminAuth(request)
    if (!admin) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  if (pathname.startsWith("/admin/login")) {
    const admin = await verifyAdminAuth(request)
    if (admin) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
