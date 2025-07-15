"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Database,
  MessageCircle,
  BarChart3,
  Users,
  Package,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import type { AdminSession } from "@/lib/models/Admin"
import Header from "@/app/components/header"
import Footer from "@/app/components/footer"

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<AdminSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [systemStatus, setSystemStatus] = useState({
    database: "checking",
    telegram: "checking",
    products: 0,
    blogPosts: 0,
    orders: 0,
  })
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/auth/me")
      
      if (response.ok) {
        const data = await response.json()

        setAdmin(data.admin)
        checkSystemStatus()
      } else {
        router.push("/admin/login")
      }
    } catch (error) {
      router.push("/admin/login")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" })
      router.push("/admin/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const checkSystemStatus = async () => {
    try {
      const [productsRes, blogRes, telegramRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/blog"),
        fetch("/api/telegram/status"),
      ])

      const products = await productsRes.json()
      const blogs = await blogRes.json()
      const telegramStatus = await telegramRes.json()
      console.log("products", products, Array.isArray(products))
      setSystemStatus({
        database: productsRes.ok ? "connected" : "error",
        telegram: telegramStatus.hasBotToken && telegramStatus.hasChatId ? "configured" : "incomplete",
        products: Array.isArray(products.products) ? products.products.length : 0,
        blogPosts: Array.isArray(blogs) ? blogs.length : 0,
        orders: 0, // Placeholder
      })
    } catch (error) {
      console.error("Error checking system status:", error)
      setSystemStatus((prev) => ({
        ...prev,
        database: "error",
        telegram: "error",
      }))
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
      case "configured":
      case "active":
        return <CheckCircle className="h-5 w-5 text-red-600" />
      case "error":
      case "incomplete":
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
      case "configured":
        return "text-red-600"
      case "error":
      case "incomplete":
        return "text-red-600"
      default:
        return "text-yellow-600"
    }
  }

  const adminPages = [
    // {
    //   title: "Database Management",
    //   description: "Initialize database with sample data",
    //   icon: <Database className="h-6 w-6" />,
    //   href: "/admin/init",
    //   status: systemStatus.database,
    //   badge: "Initialize",
    //   requiredRole: "admin",
    // },
    // {
    //   title: "Telegram Dashboard",
    //   description: "Manage Telegram bot and send messages",
    //   icon: <MessageCircle className="h-6 w-6" />,
    //   href: "/admin/telegram",
    //   status: systemStatus.telegram,
    //   badge: systemStatus.telegram === "configured" ? "Active" : "Setup Required",
    //   requiredRole: "admin",
    // },
    {
      title: "Products Manager",
      description: "Add, edit, and manage product inventory",
      icon: <Package className="h-6 w-6" />,
      href: "/admin/products",
      status: "active", // <-- FIX: Changed from 'planned' to 'active'
      badge: `${systemStatus.products} Products`,
      requiredRole: "admin",
    },
    {
      title: "Admin Management",
      description: "Create and manage admin accounts",
      icon: <Users className="h-6 w-6" />,
      href: "/admin/admins",
      status: "active", // Changed from "planned"
      badge: "Super Admin Only",
      requiredRole: "super_admin",
    },
    {
      title: "Blog Manager",
      description: "Create and manage blog posts",
      icon: <FileText className="h-6 w-6" />,
      href: "/admin/blog",
      status: "planned",
      badge: "Coming Soon",
      requiredRole: "admin",
    },
    // {
    //   title: "Orders Dashboard",
    //   description: "View and manage customer orders",
    //   icon: <BarChart3 className="h-6 w-6" />,
    //   href: "/admin/orders",
    //   status: "planned",
    //   badge: "Coming Soon",
    //   requiredRole: "admin",
    // },
  ]

  const hasPermission = (requiredRole: string) => {
    if (!admin) return false
    if (admin.role === "super_admin") return true
    if (requiredRole === "admin" && (admin.role === "admin" || admin.role === "moderator")) return true
    if (requiredRole === "moderator" && admin.role === "moderator") return true
    return false
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (!admin) {
    return null // Will be redirected by middleware or useEffect
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header variant="admin" admin={admin} />

      <main className="min-h-[calc(100dvh-496px)] max-w-7xl mx-auto lg:px-8 sm:px-6 px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Welcome back, {admin.name}!</h2>
          <p className="text-gray-600">Here's what's happening with your DoughBoy platform today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminPages
            .filter((page) => hasPermission(page.requiredRole))
            .map((page, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-red-100 rounded-lg text-red-600">{page.icon}</div>
                      <CardTitle className="text-lg">{page.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 h-12">{page.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={page.status === "planned" ? "secondary" : "outline"}
                      className={
                        page.status === "configured" || page.status === "connected" || page.status === "active"
                          ? "bg-red-100 text-red-800"
                          : page.status === "error" || page.status === "incomplete"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                      }
                    >
                      {page.badge}
                    </Badge>
                    {page.status !== "planned" ? (
                      <Link href={page.href}>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700">
                          Open
                        </Button>
                      </Link>
                    ) : (
                      <Button size="sm" variant="outline" disabled>
                        Coming Soon
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </main>

      {/* Footer */}
      <Footer variant="public" />
    </div>
  )
}
