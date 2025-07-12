import type { ObjectId } from "mongodb"

export interface Admin {
  _id?: ObjectId
  id: string // Unique admin ID (e.g., "superadmin")
  name: string
  email: string
  password: string
  role: "super_admin" | "admin" | "moderator"
  isActive: boolean
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

export interface AdminSession {
  id: number
  adminId: string
  name: string
  email: string
  role: "super_admin" | "admin" | "moderator"
  isActive: boolean
}
