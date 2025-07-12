import type { NextRequest } from "next/server"
import { verifyToken } from "./jwt"
import type { AdminSession } from "./models/Admin"

export async function verifyAdminAuth(request: NextRequest): Promise<AdminSession | null> {
  const token = request.cookies.get("admin_token")?.value

  console.log("token", token)
  if (!token) {
    return null
  }
  // This now calls the async, Edge-compatible verifyToken function
  return await verifyToken(token)
}
