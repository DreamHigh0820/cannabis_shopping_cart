"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Database,
  MessageCircle,
  Settings,
  BarChart3,
  Users,
  Package,
  FileText,
  Shield,
  Leaf,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"

export default function AdminDashboard() {
  const [systemStatus, setSystemStatus] = useState({
    database: "checking",
    telegram: "checking",
    products: 0,
    blogPosts: 0,
    orders: 0,
  })

  useEffect(() => {
    checkSystemStatus()
  }, [])

  const checkSystemStatus = async () => {
    try {
      // Check database connection and counts
      const [productsRes, blogRes, telegramRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/blog"),
        fetch("/api/telegram/status"),
      ])

      const products = await productsRes.json()
      const blogs = await blogRes.json()
      const telegramStatus = await telegramRes.json()

      setSystemStatus({
        database: productsRes.ok ? "connected" : "error",
        telegram: telegramStatus.hasBotToken && telegramStatus.hasChatId ? "configured" : "incomplete",
        products: Array.isArray(products) ? products.length : 0,
        blogPosts: Array.isArray(blogs) ? blogs.length : 0,
        orders: 0, // This would come from an orders API if implemented
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
        return <CheckCircle className="h-5 w-5 text-green-600" />
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
        return "text-green-600"
      case "error":
      case "incomplete":
        return "text-red-600"
      default:
        return "text-yellow-600"
    }
  }

  const adminPages = [
    {
      title: "Database Management",
      description: "Initialize database with sample data",
      icon: <Database className="h-6 w-6" />,
      href: "/admin/init",
      status: systemStatus.database,
      badge: `${systemStatus.products} Products, ${systemStatus.blogPosts} Posts`,
    },
    {
      title: "Telegram Dashboard",
      description: "Manage Telegram bot and send messages",
      icon: <MessageCircle className="h-6 w-6" />,
      href: "/admin/telegram",
      status: systemStatus.telegram,
      badge: systemStatus.telegram === "configured" ? "Active" : "Setup Required",
    },
    {
      title: "Products Manager",
      description: "Add, edit, and manage product inventory",
      icon: <Package className="h-6 w-6" />,
      href: "/admin/products",
      status: "planned",
      badge: "Coming Soon",
    },
    {
      title: "Blog Manager",
      description: "Create and manage blog posts",
      icon: <FileText className="h-6 w-6" />,
      href: "/admin/blog",
      status: "planned",
      badge: "Coming Soon",
    },
    {
      title: "Orders Dashboard",
      description: "View and manage customer orders",
      icon: <BarChart3 className="h-6 w-6" />,
      href: "/admin/orders",
      status: "planned",
      badge: "Coming Soon",
    },
    {
      title: "User Management",
      description: "Manage customer accounts and permissions",
      icon: <Users className="h-6 w-6" />,
      href: "/admin/users",
      status: "planned",
      badge: "Coming Soon",
    },
    {
      title: "System Settings",
      description: "Configure application settings",
      icon: <Settings className="h-6 w-6" />,
      href: "/admin/settings",
      status: "planned",
      badge: "Coming Soon",
    },
    {
      title: "Security & Logs",
      description: "View system logs and security settings",
      icon: <Shield className="h-6 w-6" />,
      href: "/admin/security",
      status: "planned",
      badge: "Coming Soon",
    },
  ]

  const quickActions = [
    {
      title: "Initialize Database",
      description: "Set up sample data",
      action: () => window.open("/admin/init", "_blank"),
      icon: <Database className="h-5 w-5" />,
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Test Telegram",
      description: "Send test message",
      action: () => window.open("/admin/telegram", "_blank"),
      icon: <MessageCircle className="h-5 w-5" />,
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      title: "View Store",
      description: "Open main site",
      action: () => window.open("/", "_blank"),
      icon: <ExternalLink className="h-5 w-5" />,
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      title: "View Menu",
      description: "Check products",
      action: () => window.open("/menu", "_blank"),
      icon: <Package className="h-5 w-5" />,
      color: "bg-orange-600 hover:bg-orange-700",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* System Status Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Database</p>
                    <p className={`font-semibold ${getStatusColor(systemStatus.database)}`}>
                      {systemStatus.database === "connected"
                        ? "Connected"
                        : systemStatus.database === "error"
                          ? "Error"
                          : "Checking..."}
                    </p>
                  </div>
                  {getStatusIcon(systemStatus.database)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Telegram Bot</p>
                    <p className={`font-semibold ${getStatusColor(systemStatus.telegram)}`}>
                      {systemStatus.telegram === "configured"
                        ? "Active"
                        : systemStatus.telegram === "incomplete"
                          ? "Setup Required"
                          : "Checking..."}
                    </p>
                  </div>
                  {getStatusIcon(systemStatus.telegram)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Products</p>
                    <p className="font-semibold text-blue-600">{systemStatus.products}</p>
                  </div>
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Blog Posts</p>
                    <p className="font-semibold text-purple-600">{systemStatus.blogPosts}</p>
                  </div>
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                onClick={action.action}
                className={`${action.color} text-white p-4 h-auto flex flex-col items-center space-y-2`}
              >
                {action.icon}
                <div className="text-center">
                  <div className="font-semibold">{action.title}</div>
                  <div className="text-xs opacity-90">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Admin Pages */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Administration Pages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminPages.map((page, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg text-green-600">{page.icon}</div>
                      <div>
                        <CardTitle className="text-lg">{page.title}</CardTitle>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {page.status !== "planned" && getStatusIcon(page.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{page.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={page.status === "planned" ? "secondary" : "outline"}
                      className={
                        page.status === "configured" || page.status === "connected"
                          ? "bg-green-100 text-green-800"
                          : page.status === "error" || page.status === "incomplete"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                      }
                    >
                      {page.badge}
                    </Badge>
                    {page.status !== "planned" ? (
                      <Link href={page.href}>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
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
        </div>

        {/* Environment Setup Guide */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Environment Setup</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Make sure your <code className="bg-gray-100 px-2 py-1 rounded">.env</code> file contains:
            </p>
            <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
              <div>MONGODB_URI=your_mongodb_connection_string</div>
              <div>TELEGRAM_BOT_TOKEN=your_bot_token</div>
              <div>TELEGRAM_CHAT_ID=your_chat_id</div>
            </div>
            <div className="mt-4 flex space-x-4">
              <Link href="/admin/init">
                <Button variant="outline" size="sm">
                  Initialize Database
                </Button>
              </Link>
              <Link href="/admin/telegram">
                <Button variant="outline" size="sm">
                  Test Telegram
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
