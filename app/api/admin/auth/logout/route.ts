import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    cookies().set("admin_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      expires: new Date(0),
    })
    return NextResponse.json({ success: true, message: "Logout successful" })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
