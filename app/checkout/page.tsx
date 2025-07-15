"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useCartCalculations } from "@/hooks/use-cart-calculations"
import Header from "@/app/components/header"
import Footer from "@/app/components/footer"
import BackButton from "../../components/BackButton"

export default function CheckoutPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const { state: cartState, dispatch: cartDispatch } = useCart()
  const { subtotal, volumeDiscount, shippingDiscount, shippingUpgradeCost, paymentUpcharge, total } =
    useCartCalculations(cartState)

  // Redirect if cart is empty on mount
  useEffect(() => {
    if (cartState.items.length === 0) {
      router.push("/cart")
    }
  }, [cartState.items, router])

  // Helper function to format shipping method display
  const getShippingDisplayText = () => {
    if (!cartState.shippingCarrier || !cartState.shippingSpeed) return "Not selected"
    
    const carrier = cartState.shippingCarrier.toUpperCase()
    let speed = ""
    
    if (cartState.shippingCarrier === "ups") {
      switch (cartState.shippingSpeed) {
        case "ground":
          speed = "Ground (Free)"
          break
        case "2-day":
          speed = "2-Day"
          break
        case "overnight":
          speed = "Overnight"
          break
        default:
          speed = cartState.shippingSpeed
      }
    } else if (cartState.shippingCarrier === "usps") {
      switch (cartState.shippingSpeed) {
        case "priority":
          speed = "Priority (Free)"
          break
        case "express":
          speed = "Express"
          break
        default:
          speed = cartState.shippingSpeed
      }
    }
    
    return `${carrier} ${speed}`
  }

  // Helper function to format payment method display
  const getPaymentDisplayText = () => {
    if (!cartState.paymentMethod) return "Not selected"
    
    switch (cartState.paymentMethod) {
      case "BTC":
        return "Bitcoin (BTC)"
      case "USDT":
        return "Tether (USDT)"
      case "ETH":
        return "Ethereum (ETH)"
      case "CashApp":
        return "Cash App (+3%)"
      case "Zelle":
        return "Zelle (+3%)"
      case "Cash in Mail":
        return "Cash in Mail"
      default:
        return cartState.paymentMethod
    }
  }

  const handleSubmitOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const orderData = {
      customer: {
        contact: formData.get("contact") as string,
        shippingName: formData.get("shippingName") as string,
        shippingAddress: formData.get("shippingAddress") as string,
        notes: formData.get("notes") as string,
      },
      items: cartState.items.map(item => ({
        ...item,
        unit: item.unit || (item.isQP ? 'QP' : 'lb'), // Ensure unit is included
        totalPrice: item.price * item.quantity // Use the price field directly
      })),
      shipping: {
        carrier: cartState.shippingCarrier,
        speed: cartState.shippingSpeed,
        upgradeCost: shippingUpgradeCost,
      },
      payment: {
        method: cartState.paymentMethod,
        upcharge: paymentUpcharge,
      },
      costs: {
        subtotal,
        volumeDiscount,
        shippingDiscount,
        total,
      },
      orderDate: new Date().toISOString(),
    }

    try {
      const response = await fetch("/api/send-telegram-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      })
      const data = await response.json()

      if (response.ok && data.success && data.telegramLink) {
        cartDispatch({ type: "CLEAR_CART" })
        window.location.href = data.telegramLink
      } else {
        setError(data.message || "Error submitting order.")
      }
    } catch (err) {
      console.error("Error submitting order:", err)
      setError("An unexpected error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (cartState.items.length === 0) {
    // Render a loading/redirecting state while useEffect does its job
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-red-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header variant="public" />
      <main className="max-w-4xl min-h-[calc(100dvh-496px)] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BackButton to="/cart" />
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalize Your Order</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Contact & Shipping Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitOrder} className="space-y-6">
                <div>
                  <Label htmlFor="contact">Phone # or Signal/Telegram Username *</Label>
                  <Input id="contact" name="contact" required />
                </div>
                <div>
                  <Label htmlFor="shippingName">Full Name (for Shipping) *</Label>
                  <Input id="shippingName" name="shippingName" required />
                </div>
                <div>
                  <Label htmlFor="shippingAddress">Full Shipping Address *</Label>
                  <Textarea id="shippingAddress" name="shippingAddress" required />
                </div>
                <div>
                  <Label htmlFor="notes">Special Instructions</Label>
                  <Textarea id="notes" name="notes" placeholder="Delivery notes, etc." />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit & Contact Admin"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Confirmation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Items Section */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-gray-700 uppercase tracking-wide">Items</h3>
                <div className="space-y-3 text-sm">
                  {cartState.items.map((item, index) => {
                    const unit = item.unit || (item.isQP ? 'QP' : 'lb')
                    return (
                      <div key={index} className="border-l-2 border-gray-200 pl-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <span className="font-medium">
                              {item.quantity} {unit} x {item.name}
                            </span>
                            {item.isQP && (
                              <span className="ml-2 inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                                QP Unit
                              </span>
                            )}
                            <div className="text-xs text-gray-600 mt-1">
                              ${item.price.toFixed(2)} per {unit}
                            </div>
                          </div>
                          <span className="font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <Separator />

              {/* Shipping & Payment Details */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-gray-700 uppercase tracking-wide">Shipping & Payment</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping Method:</span>
                    <span className="font-medium">{getShippingDisplayText()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium">{getPaymentDisplayText()}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Price Breakdown */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-gray-700 uppercase tracking-wide">Price Breakdown</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {volumeDiscount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Volume Discount</span>
                      <span>-${volumeDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  {shippingDiscount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Flower Shipping Coupon</span>
                      <span>-${shippingDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  {shippingUpgradeCost > 0 && (
                    <div className="flex justify-between">
                      <span>Shipping Upgrade</span>
                      <span>+${shippingUpgradeCost.toFixed(2)}</span>
                    </div>
                  )}
                  {paymentUpcharge > 0 && (
                    <div className="flex justify-between">
                      <span>Payment Upcharge (3%)</span>
                      <span>+${paymentUpcharge.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <Footer variant="public" />
    </div>
  )
}