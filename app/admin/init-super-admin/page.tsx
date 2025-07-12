"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal, UserPlus } from "lucide-react"

export default function InitSuperAdminPage() {
  const [formData, setFormData] = useState({
    id: "superadmin",
    name: "",
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleInit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    try {
      const response = await fetch("/api/admin/init-super-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await response.json()

      if (response.ok) {
        setResult({ type: "success", message: `${data.message} Redirecting to login...` })
        setTimeout(() => {
          router.push("/admin/login")
        }, 2000)
      } else {
        setResult({ type: "error", message: data.error || "An unknown error occurred." })
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "A network error occurred."
      setResult({ type: "error", message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center lg:px-8 sm:px-6 px-4 py-8">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <UserPlus className="mx-auto h-10 w-10 text-green-600" />
          <CardTitle className="text-2xl font-bold mt-2">Create Super Admin</CardTitle>
          <CardDescription>Initialize the first administrative account for your application.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInit} className="space-y-4">
            <div>
              <Label htmlFor="id">Admin ID</Label>
              <Input
                id="id"
                name="id"
                type="text"
                value={formData.id}
                onChange={handleChange}
                required
                placeholder="e.g., superadmin"
              />
            </div>
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Jane Doe"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="e.g., admin@example.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Choose a strong password"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating Account..." : "Create Super Admin Account"}
            </Button>
          </form>

          {result && (
            <Alert className="mt-4" variant={result.type === "error" ? "destructive" : "default"}>
              <Terminal className="h-4 w-4" />
              <AlertTitle>{result.type === "success" ? "Success" : "Error"}</AlertTitle>
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
