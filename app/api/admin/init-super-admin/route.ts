import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { AuthService } from "@/lib/auth"
import type { Admin } from "@/lib/models/Admin"

export async function POST(request: Request) {
  try {
    const db = await getDatabase()

    // Check if a super admin already exists
    const existingSuperAdmin = await db.collection<Admin>("admins").findOne({ role: "super_admin" })
    if (existingSuperAdmin) {
      return NextResponse.json({ error: "A super admin already exists." }, { status: 409 })
    }

    // Get credentials from the request body
    const { id, name, email, password } = await request.json()

    if (!id || !name || !email || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 })
    }

    const adminData = {
      id,
      name,
      email,
      password,
      role: "super_admin" as const,
      isActive: true,
    }

    const success = await AuthService.createAdmin(adminData)

    if (success) {
      return NextResponse.json({ message: "Super admin created successfully." })
    } else {
      return NextResponse.json({ error: "Failed to create super admin." }, { status: 500 })
    }
  } catch (error) {
    console.error("Error creating super admin:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
