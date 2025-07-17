import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { AgeVerificationModal } from "@/components/ui/age-verification-modal"
import { CartProvider } from "@/lib/cart-context"
import { Inter } from "next/font/google"
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DoughBoy - Premium Cannabis Delivery",
  description: "Your trusted source for premium cannabis products. Quality guaranteed, satisfaction delivered.",
  generator: 'coredev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <AgeVerificationModal />
          {children}
          <SpeedInsights />
        </CartProvider>
      </body>
    </html>
  )
}