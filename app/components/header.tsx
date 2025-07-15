"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Leaf, ShoppingCart, MessageCircle, ExternalLink, LogOut, User, ArrowLeft } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import type { AdminSession } from "@/lib/models/Admin"

interface HeaderProps {
  variant: "public" | "admin"
  admin?: AdminSession | null
  backButton?: {
    href: string
    text: string
  }
}

export default function Header({ variant, admin, backButton }: HeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { state: cartState } = useCart()

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" })
      router.push("/admin/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const publicNavLinks = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    // { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  // Admin Header
  if (variant === "admin") {
    return (
      <header className="bg-white shadow-sm border-b min-h-16 md:h-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center min-h-16 md:h-24 py-2">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="DoughBoy logo"
                width={120}
                height={60}
                className="rounded-lg shadow-2xl w-20 h-10 md:w-32 md:h-16 lg:w-40 lg:h-20"
              />
              <div className="hidden sm:flex sm:flex-col">
                <h1 className="text-lg md:text-2xl font-bold text-gray-900">
                  DoughBoy Admin
                </h1>
                <p className="text-xs md:text-sm text-gray-500 hidden md:block">
                  Administration Dashboard
                </p>
              </div>
            </div>

            {/* Admin Actions */}
            {admin && (
              <div className="flex items-center space-x-1 md:space-x-3">
                {/* User Info - Hidden on mobile, shown on larger screens */}
                <div className="hidden lg:flex lg:items-center lg:space-x-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span className="truncate max-w-32">{admin.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {admin.role.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>

                {/* Mobile User Info - Only name and role */}
                <div className="flex lg:hidden items-center space-x-1 text-xs text-gray-600">
                  <User className="h-4 w-4" />
                  <span className="truncate max-w-20">{admin.name}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-1 md:space-x-2">
                  <Link href="/">
                    <Button variant="outline" size="sm" className="text-xs md:text-sm">
                      <ExternalLink className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
                      <span className="hidden md:inline">View Store</span>
                    </Button>
                  </Link>
                  <Button onClick={handleLogout} variant="outline" size="sm" className="text-xs md:text-sm">
                    <LogOut className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
                    <span className="hidden md:inline">Logout</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    )
  }

  // Public Header (Default)
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40 min-h-16 md:h-24">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       <div className="flex justify-between items-center min-h-16 md:h-24">
       <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
        <Image
          src="/logo.png"
          alt="DoughBoy logo"
          width={120}
          height={60}
          className="rounded-lg shadow-2xl w-20 h-10 md:w-32 md:h-16 lg:w-40 lg:h-20"
        />
      </Link>
          <nav className="hidden md:flex space-x-8">
            {publicNavLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className={`${pathname === link.href ? "text-gray-900 font-medium" : "text-gray-700"
                  } hover:text-green-600`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center space-x-3">
            <Link href="/cart">
              <Button variant="outline" size="sm" className="hidden sm:flex bg-transparent">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart ({cartState.totalItems})
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="md:hidden">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
