"use client"

import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus, Minus, ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useCartCalculations } from "@/hooks/use-cart-calculations"
import ProductImage from "@/components/ProductImage"
import Header from "@/app/components/header"
import Footer from "@/app/components/footer"
import BackButton from "@/components/BackButton"

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

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity > 0) {
      cartDispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
    }
  }

  const removeItem = (id: string) => {
    cartDispatch({ type: "REMOVE_ITEM", payload: { id } })
  }

  const handleCarrierChange = (value: "ups" | "usps") => {
    cartDispatch({ type: "SET_SHIPPING_CARRIER", payload: value })
    // Reset speed if carrier changes
    cartDispatch({ type: "SET_SHIPPING_SPEED", payload: value === "ups" ? 'ground' : 'priority' })
  }

  const handleSpeedChange = (value: any) => {
    cartDispatch({ type: "SET_SHIPPING_SPEED", payload: value })
  }

  const handlePaymentChange = (value: string) => {
    cartDispatch({ type: "SET_PAYMENT_METHOD", payload: value })
  }

  // Helper function to get price display
  const getPriceDisplay = (item: any) => {
    const unit = item.unit || (item.isQP ? 'QP' : 'lb')
    return (
      <div className="text-sm">
        <p className="font-medium">${item.price.toFixed(2)}/{unit}</p>
        {item.isQP && item.qpPrice && (
          <p className="text-xs text-gray-500">
            QP pricing applied
          </p>
        )}
      </div>
    )
  }

  // Check if all required fields are selected
  const isFormValid = shippingCarrier && shippingSpeed && paymentMethod

  // Handle checkout button click
  const handleCheckoutClick = (e: React.MouseEvent) => {
    if (!isFormValid) {
      e.preventDefault()
      console.log("Please complete all required fields")
    }
  }

  if (cartState.items.length === 0) {
    return (
      <div className="bg-gray-50">
        <Header variant="public" />
        <main className="flex min-h-[calc(100dvh-496px)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 items-center justify-center">
          <Card className="w-full max-w-md text-center">
            <CardHeader className="pb-4">
              <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <CardTitle className="text-xl sm:text-2xl">Your Cart is Empty</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Link href="/menu">
                <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                  Start Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer variant="public" />
      </div>
    )
  }

  return (
    <div className="bg-gray-50">
      <Header variant="public" />

      <main className="min-h-[calc(100dvh-496px)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <BackButton to="/menu" />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Your Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {cartState.items.map((item, index) => {
                    const unit = item.unit || (item.isQP ? 'QP' : 'lb')
                    return (
                      <div key={index} className="p-4 sm:p-6">
                        {/* Mobile Layout */}
                        <div className="block sm:hidden">
                          <div className="flex items-start gap-3 mb-3">
                            <ProductImage
                              src={item.image}
                              alt={item.name}
                              width={80}
                              height={80}
                              className="rounded-md object-cover flex-shrink-0"
                            />
                            <div className="flex-grow min-w-0">
                              <h3 className="font-semibold text-base leading-tight mb-1">{item.name}</h3>
                              <p className="text-sm text-gray-500 capitalize mb-1">{item.category}</p>
                              {getPriceDisplay(item)}
                              {item.isQP && (
                                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-1">
                                  QP Unit
                                </span>
                              )}
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => removeItem(item.id)}
                              className="flex-shrink-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="h-8 w-8"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <div className="flex flex-col items-center">
                                <Input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value, 10))}
                                  className="w-12 h-8 text-center text-sm"
                                />
                                <span className="text-xs text-gray-500">{unit}</span>
                              </div>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-8 w-8"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="font-semibold text-right">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {/* Desktop Layout */}
                        <div className="hidden sm:flex items-center gap-4">
                          <ProductImage
                            src={item.image}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="rounded-md object-cover flex-shrink-0"
                          />
                          <div className="flex-grow min-w-0">
                            <h3 className="font-semibold text-base lg:text-lg">{item.name}</h3>
                            <p className="text-sm text-gray-500 capitalize">{item.category}</p>
                            {getPriceDisplay(item)}
                            {item.isQP && (
                              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-1">
                                QP Unit
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-8 w-8 lg:h-10 lg:w-10"
                            >
                              <Minus className="h-3 w-3 lg:h-4 lg:w-4" />
                            </Button>
                            <div className="flex flex-col items-center">
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value, 10))}
                                className="w-12 lg:w-16 text-center h-8 lg:h-10"
                              />
                              <span className="text-xs text-gray-500">{unit}</span>
                            </div>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8 lg:h-10 lg:w-10"
                            >
                              <Plus className="h-3 w-3 lg:h-4 lg:w-4" />
                            </Button>
                          </div>
                          <p className="font-semibold w-16 lg:w-20 text-right">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <Button size="icon" variant="ghost" onClick={() => removeItem(item.id)}>
                            <X className="h-4 w-4 lg:h-5 lg:w-5" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Shipping Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Shipping Carrier <span className="text-red-500">*</span>
                  </Label>
                  <Select onValueChange={handleCarrierChange} value={shippingCarrier || ""}>
                    <SelectTrigger className={`h-10 ${!shippingCarrier ? 'border-red-300' : ''}`}>
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
                    <Label className="text-sm font-medium">
                      Shipping Speed <span className="text-red-500">*</span>
                    </Label>
                    <Select onValueChange={handleSpeedChange} value={shippingSpeed || ""}>
                      <SelectTrigger className={`h-10 ${!shippingSpeed ? 'border-red-300' : ''}`}>
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
                  <Label className="text-sm font-medium">
                    Payment Method <span className="text-red-500">*</span>
                  </Label>
                  <Select onValueChange={handlePaymentChange} value={paymentMethod || ""}>
                    <SelectTrigger className={`h-10 ${!paymentMethod ? 'border-red-300' : ''}`}>
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

                <div className="flex justify-between font-bold text-base sm:text-lg !mb-2">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                {/* Improved Checkout Button with proper validation */}
                {isFormValid ? (
                  <Link href="/checkout">
                    <Button className="w-full bg-green-600 hover:bg-green-700 h-11 text-sm sm:text-base">
                      Proceed to Checkout
                    </Button>
                  </Link>
                ) : (
                  <Button
                    className="w-full bg-gray-400 cursor-not-allowed h-11 text-sm sm:text-base"
                    disabled
                    onClick={handleCheckoutClick}
                  >
                    Proceed to Checkout
                  </Button>
                )}

                {/* Enhanced Error Message */}
                {!isFormValid && (
                  <div className="text-xs text-center text-red-500 mt-2 space-y-1">
                    <p className="font-medium">Please complete the following required fields:</p>
                    <ul className="text-left space-y-1">
                      {!shippingCarrier && <li>• Select a shipping carrier</li>}
                      {!shippingSpeed && <li>• Select a shipping speed</li>}
                      {!paymentMethod && <li>• Select a payment method</li>}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer variant="public" />
    </div>
  )
}