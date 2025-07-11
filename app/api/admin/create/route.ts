import { NextResponse, type NextRequest } from "next/server"
import { getAdmins, deleteAdmin } from "@/lib/db-operations"
import { AuthService } from "@/lib/auth"
import type { Admin } from "@/lib/models"

// This route should be protected and only accessible by superadmins via middleware.

export async function GET() {
  try {
    const admins = await getAdmins()
    return NextResponse.json({ success: true, admins })
  } catch (error) {
    console.error("Failed to fetch admins:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch admins." }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { id, name, email, password } = await request.json()

    if (!id || !name || !email || !password) {
      return NextResponse.json({ success: false, message: "All fields are required." }, { status: 400 })
    }

    // Use AuthService to correctly create the admin.
    // This service handles checking for existing users, hashing passwords, and setting defaults.
    const success = await AuthService.createAdmin({
      id,
      name,
      email,
      password, // Pass plain password, service will hash it
      role: "admin",
      isActive: true,
    } as Omit<Admin, "_id" | "createdAt" | "updatedAt">)

    if (success) {
      return NextResponse.json({ success: true, message: "Admin created successfully." }, { status: 201 })
    } else {
      // This error is returned if the user already exists or another DB error occurs.
      return NextResponse.json(
        { success: false, message: "Failed to create admin. An admin with this ID or email may already exist." },
        { status: 409 }, // 409 Conflict
      )
    }
  } catch (error) {
    console.error("Error in POST /api/admin/create:", error)
    return NextResponse.json({ success: false, message: "An internal server error occurred." }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, message: "Admin ID is required." }, { status: 400 })
    }

    const adminToDelete = await getAdmins().then((admins) => admins.find((a) => a.id === id))

    if (!adminToDelete) {
      return NextResponse.json({ success: false, message: "Admin not found." }, { status: 404 })
    }

    if (adminToDelete.role === "super_admin") {
      return NextResponse.json({ success: false, message: "Cannot delete a superadmin account." }, { status: 403 })
    }

    const success = await deleteAdmin(id)

    if (success) {
      return NextResponse.json({ success: true, message: "Admin deleted successfully." })
    } else {
      return NextResponse.json({ success: false, message: "Failed to delete admin." }, { status: 500 })
    }
  } catch (error) {
    console.error("Failed to delete admin:", error)
    return NextResponse.json({ success: false, message: "Failed to delete admin." }, { status: 500 })
  }
}
