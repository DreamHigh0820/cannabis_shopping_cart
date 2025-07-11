"use client"

import Link from "next/link"
import Image from "next/image"
import { Leaf } from "lucide-react"

interface FeaderProps {
  variant: "public" | "admin"
}

export default function Footer ({ variant }: FeaderProps) {

  // Admin Header
  if (variant === "admin" || variant === "public") {
    return (
        <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <Image
                  // src="/placeholder.svg"
                  src="/logo.png"
                  alt="DoughBoy logo"
                  width={200}
                  height={100}
                  className="rounded-lg shadow-2xl"
                />
              </Link>
              <p className="text-gray-400">
                Your trusted source for premium cannabis products. Quality guaranteed, satisfaction delivered.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/menu?category=flowers" className="hover:text-white">
                    Flowers
                  </Link>
                </li>
                <li>
                  <Link href="/menu?category=vapes" className="hover:text-white">
                    Vapes
                  </Link>
                </li>
                <li>
                  <Link href="/menu?category=edibles" className="hover:text-white">
                    Edibles
                  </Link>
                </li>
                <li>
                  <Link href="/menu?category=extracts" className="hover:text-white">
                    Extracts
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  {/* <Link href="/blog" className="hover:text-white"> */}
                  <Link href="" className="hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  {/* <Link href="/privacy" className="hover:text-white"> */}
                  <Link href="" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-400">
                <p>Email: info@doughboy.com</p>
                <p>Phone: (555) 123-4567</p>
                <p>Telegram: @doughboy_official</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 DoughBoy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    )
  }
}
