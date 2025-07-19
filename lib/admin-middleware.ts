import type { NextRequest } from "next/server"
import { verifyToken } from "./jwt"
import type { AdminSession } from "./models/Admin"

export async function verifyAdminAuth(request: NextRequest): Promise<AdminSession | null> {
  const allCookies = request.cookies.getAll()

  const token = request.cookies.get("admin_token")?.value

  if (!token) {
    return null
  }

  return await verifyToken(token)
}