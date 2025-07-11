import { NextResponse } from "next/server"
import { verifyAdminAuth } from "@/lib/admin-middleware"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminAuth(request)
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ admin })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
