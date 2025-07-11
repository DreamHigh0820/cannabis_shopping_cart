import { NextResponse } from "next/server"
import { AuthService } from "@/lib/auth"
import { generateToken } from "@/lib/jwt"

export async function POST(request: Request) {
  try {
    const { identifier, password } = await request.json()

    if (!identifier || !password) {
      return NextResponse.json({ message: "Identifier and password are required" }, { status: 400 })
    }

    const adminSession = await AuthService.authenticateAdmin(identifier, password)

    if (!adminSession) {
      return NextResponse.json({ message: "Invalid credentials or inactive account" }, { status: 401 })
    }

    // Await the new async token generation
    const token = await generateToken(adminSession)

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
    })

    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
