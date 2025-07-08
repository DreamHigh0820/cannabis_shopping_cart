"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Leaf, ShoppingCart, MessageCircle, ExternalLink } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { usePathname } from "next/navigation"

export default function Header() {
  const { state: cartState } = useCart()
  const pathname = usePathname()
  const isAdminPage = pathname.startsWith('/admin')

  const checkSystemStatus = () => {
    // Add your system status check logic here
    console.log("Checking system status...")
  }

  if (isAdminPage) {
    return (
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">DoughBoy Admin</h1>
                <p className="text-sm text-gray-500">Administration Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Store
                </Button>
              </Link>
              <Button onClick={checkSystemStatus} variant="outline" size="sm">
                Refresh Status
              </Button>
            </div>
          </div>
        </div>
      </header>
    )
  }

  // Regular store header
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            {/* <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">DoughBoy</span> */}
            <Image
              // src="/placeholder.svg"
              src="/logo.png"
              alt="DoughBoy logo"
              width={200}
              height={100}
              className="rounded-lg shadow-2xl"
            />
          </Link>
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-900 hover:text-green-600 font-medium">
              Home
            </Link>
            <Link href="/menu" className="text-gray-700 hover:text-green-600">
              Menu
            </Link>
            {/* <Link href="/blog" className="text-gray-700 hover:text-green-600"> */}
            <Link href="/" className="text-gray-700 hover:text-green-600">
              Blog
            </Link>
            {/* <Link href="/about" className="text-gray-700 hover:text-green-600"> */}
            <Link href="/" className="text-gray-700 hover:text-green-600">
              About
            </Link>
            {/* <Link href="/contact" className="text-gray-700 hover:text-green-600"> */}
            <Link href="/" className="text-gray-700 hover:text-green-600">
              Contact
            </Link>
          </nav>
          <div className="flex items-center space-x-3">
            {/* <Link href="/cart"> */}
            <Link href="">
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