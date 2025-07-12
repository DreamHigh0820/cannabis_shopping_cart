"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Trash2 } from "lucide-react"
import type { Admin } from "@/lib/models"
import BackButton from "../../../components/BackButton"

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newAdmin, setNewAdmin] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/create")
      const data = await res.json()
      if (data.success) {
        setAdmins(data.admins)
      } else {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch admins.",
        variant: "destructive",
      })
    }
    setIsLoading(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewAdmin((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/admin/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAdmin),
      })
      const data = await res.json()
      if (data.success) {
        toast({
          title: "Success",
          description: "New admin created successfully.",
        })
        setNewAdmin({ id: "", name: "", email: "", password: "" })
        fetchAdmins()
      } else {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create admin.",
        variant: "destructive",
      })
    }
    setIsSubmitting(false)
  }

  const handleDeleteAdmin = async (id: string) => {
    if (confirm("Are you sure you want to delete this admin?")) {
      try {
        const res = await fetch(`/api/admin/create?id=${id}`, {
          method: "DELETE",
        })
        const data = await res.json()
        if (data.success) {
          toast({
            title: "Success",
            description: "Admin deleted successfully.",
          })
          fetchAdmins()
        } else {
          toast({
            title: "Error",
            description: data.message,
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete admin.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="max-w-7xl min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackButton />
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Create New Admin</h1>
        <form onSubmit={handleCreateAdmin} className="space-y-4 max-w-lg">
          <div>
            <Label htmlFor="id">Admin ID</Label>
            <Input id="id" name="id" value={newAdmin.id} onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={newAdmin.name} onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={newAdmin.email} onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={newAdmin.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Admin
          </Button>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Manage Admins</h2>
        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-2">
            {admins.map((admin) => (
              <div key={admin.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-semibold">{admin.name}</p>
                  <p className="text-sm text-gray-500">
                    {admin.id} - {admin.email}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDeleteAdmin(admin.id)}
                  disabled={admin.role === "super_admin"}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
