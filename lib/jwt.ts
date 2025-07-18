import { SignJWT, jwtVerify } from "jose"
import type { AdminSession } from "./models/Admin"

interface JWTPayload {
  [key: string]: unknown;
}

const JWT_SECRET = process.env.JWT_SECRET || "dc79394ec25ed97a6292caeecb64051823ab19a2180d3e0aae723babb58b7c2791754565a2c43b8a8e9e55b4cc67b2a7734f57721e10314df9d9549743515313"

// The secret key must be converted to a Uint8Array for jose
const getSecretKey = () => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables.")
  }
  return new TextEncoder().encode(JWT_SECRET)
}

export async function generateToken(adminSession: AdminSession): Promise<string> {
  const key = getSecretKey()
  const token = await new SignJWT(adminSession as unknown as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key)
  return token
}

export async function verifyToken(token: string): Promise<AdminSession | null> {
  try {
    const key = getSecretKey()
    const { payload } = await jwtVerify(token, key)

    // Optional: Runtime check (good practice)
    if (
      // typeof payload.id === "number" && ← remove this line if id is optional
      typeof payload.adminId === "string" &&
      typeof payload.name === "string" &&
      typeof payload.email === "string" &&
      (payload.role === "super_admin" || payload.role === "admin" || payload.role === "moderator") &&
      typeof payload.isActive === "boolean"
    ) {
      return payload as unknown as AdminSession
    }

    console.error("JWT payload structure is invalid:", payload)
    return null
  } catch (error) {
    console.error("JWT Verification Error:", error)
    return null
  }
}
