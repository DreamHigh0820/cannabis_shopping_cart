import { SignJWT, jwtVerify } from "jose"
import type { AdminSession } from "./models/Admin"

const JWT_SECRET = process.env.JWT_SECRET

// The secret key must be converted to a Uint8Array for jose
const getSecretKey = () => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables.")
  }
  return new TextEncoder().encode(JWT_SECRET)
}

/**
 * Generates a JWT token using the Edge-compatible 'jose' library.
 */
export async function generateToken(adminSession: AdminSession): Promise<string> {
  const key = getSecretKey()
  const token = await new SignJWT(adminSession)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key)
  return token
}

/**
 * Verifies a JWT token using the Edge-compatible 'jose' library.
 * This function is safe to run in middleware.
 */
export async function verifyToken(token: string): Promise<AdminSession | null> {
  try {
    const key = getSecretKey()
    const { payload } = await jwtVerify(token, key)
    return payload as AdminSession
  } catch (error) {
    console.error("JWT Verification Error:", error)
    return null
  }
}
