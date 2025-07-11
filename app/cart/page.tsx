"use client"

import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus, Minus, ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useCartCalculations } from "@/hooks/use-cart-calculations"
import Header from "@/app/components/header"
import Footer from "@/app/components/footer"

export default function CartPage() {
  const { state: cartState, dispatch: cartDispatch } = useCart()
  const { shippingCarrier, shippingSpeed, paymentMethod } = cartState

  const { subtotal, volumeDiscount, shippingDiscount, shippingUpgradeCost, paymentUpcharge, total, qpFlowerCount } =
    useCartCalculations({
      items: cartState.items,
      shippingCarrier,
      shippingSpeed,
      paymentMethod,
    })

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity > 0) {
      cartDispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
    }
  }

  const removeItem = (id: number) => {
    cartDispatch({ type: "REMOVE_ITEM", payload: { id } })
  }

  const handleCarrierChange = (value: "ups" | "usps") => {
    cartDispatch({ type: "SET_SHIPPING_CARRIER", payload: value })
    // Reset speed if carrier changes
    cartDispatch({ type: "SET_SHIPPING_SPEED", payload: null })
  }

  const handleSpeedChange = (value: any) => {
    cartDispatch({ type: "SET_SHIPPING_SPEED", payload: value })
  }

  const handlePaymentChange = (value: string) => {
    cartDispatch({ type: "SET_PAYMENT_METHOD", payload: value })
  }

  if (cartState.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
            <CardTitle>Your Cart is Empty</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Link href="/menu">
              <Button className="bg-green-600 hover:bg-green-700">Start Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="bg-gray-50">
      <Header variant="public" />

      <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {cartState.items.map((item) => (
                    <div key={item.id} className="flex items-center p-4 gap-4">
                      <Image
                        // src={item.image || "/placeholder.svg"}
                        src={"https://i.ibb.co/fZhhwLS/Apple-Gelato.webp"}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="rounded-md object-cover"
                      />
                      <div className="flex-grow">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{item.category}</p>
                        <p className="text-sm font-medium">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value, 10))}
                          className="w-16 text-center"
                        />
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="font-semibold w-20 text-right">${(item.price * item.quantity).toFixed(2)}</p>
                      <Button size="icon" variant="ghost" onClick={() => removeItem(item.id)}>
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Shipping Selection */}
                <div className="space-y-2">
                  <Label>Shipping Carrier</Label>
                  <Select onValueChange={handleCarrierChange} value={shippingCarrier || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Carrier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ups">UPS</SelectItem>
                      <SelectItem value="usps">USPS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {shippingCarrier && (
                  <div className="space-y-2">
                    <Label>Shipping Speed</Label>
                    <Select onValueChange={handleSpeedChange} value={shippingSpeed || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Speed" />
                      </SelectTrigger>
                      <SelectContent>
                        {shippingCarrier === "ups" && (
                          <>
                            <SelectItem value="ground">UPS Ground (Free)</SelectItem>
                            <SelectItem value="2-day">UPS 2-Day</SelectItem>
                            <SelectItem value="overnight">UPS Overnight</SelectItem>
                          </>
                        )}
                        {shippingCarrier === "usps" && (
                          <>
                            <SelectItem value="priority">USPS Priority (Free)</SelectItem>
                            <SelectItem value="express">USPS Express</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Payment Selection */}
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Select onValueChange={handlePaymentChange} value={paymentMethod || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Payment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BTC">BTC</SelectItem>
                      <SelectItem value="USDT">USDT</SelectItem>
                      <SelectItem value="ETH">ETH</SelectItem>
                      <SelectItem value="CashApp">Cash App (+3%)</SelectItem>
                      <SelectItem value="Zelle">Zelle (+3%)</SelectItem>
                      <SelectItem value="Cash in Mail">Cash in Mail</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {volumeDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Volume Discount</span>
                      <span>-${volumeDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  {shippingDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
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

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <Link
                  href="/checkout"
                  className={!shippingCarrier || !shippingSpeed || !paymentMethod ? "pointer-events-none" : ""}
                >
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={!shippingCarrier || !shippingSpeed || !paymentMethod}
                  >
                    Proceed to Checkout
                  </Button>
                </Link>
                {!shippingCarrier ||
                  !shippingSpeed ||
                  (!paymentMethod && (
                    <p className="text-xs text-center text-red-500 mt-2">
                      Please select shipping and payment options to continue.
                    </p>
                  ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer variant="public" />
    </div>
  )
}
