import bcrypt from "bcryptjs"
import { getDatabase } from "./mongodb"
import type { Admin, AdminSession } from "./models/Admin"

const SALT_ROUNDS = 12

/**
 * This class handles server-side authentication logic that requires database access.
 * It should only be used in API routes and Server Components.
 */
export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS)
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }

  static async createAdmin(adminData: Omit<Admin, "_id" | "createdAt" | "updatedAt">): Promise<boolean> {
    try {
      const db = await getDatabase()
      const existingAdmin = await db.collection<Admin>("admins").findOne({
        $or: [{ id: adminData.id }, { email: adminData.email }],
      })

      if (existingAdmin) {
        throw new Error("Admin with this ID or email already exists")
      }

      const hashedPassword = await this.hashPassword(adminData.password)
      const newAdmin: Admin = {
        ...adminData,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await db.collection<Admin>("admins").insertOne(newAdmin)
      return true
    } catch (error) {
      console.error("Error creating admin:", error)
      return false
    }
  }

  static async authenticateAdmin(identifier: string, password: string): Promise<AdminSession | null> {
    try {
      const db = await getDatabase()
      const admin = await db.collection<Admin>("admins").findOne({
        $or: [{ id: identifier }, { email: identifier }],
        isActive: true,
      })

      if (!admin) return null

      const isValidPassword = await this.verifyPassword(password, admin.password)
      if (!isValidPassword) return null

      await db
        .collection<Admin>("admins")
        .updateOne({ _id: admin._id }, { $set: { lastLogin: new Date(), updatedAt: new Date() } })

      return {
        adminId: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive,
      }
    } catch (error) {
      console.error("Error authenticating admin:", error)
      return null
    }
  }
}
