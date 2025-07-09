"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Leaf, ShoppingCart, MessageCircle, Plus, Minus, Trash2, ArrowLeft } from "lucide-react"
import { useCart } from "@/lib/cart-context"

export default function CartPage() {
  const { state: cartState, dispatch: cartDispatch } = useCart()

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      cartDispatch({ type: "REMOVE_ITEM", payload: { id } })
    } else {
      cartDispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity: newQuantity } })
    }
  }

  const removeItem = (id: number) => {
    cartDispatch({ type: "REMOVE_ITEM", payload: { id } })
  }

  const deliveryFee = cartState.totalPrice > 0 ? 10 : 0
  const total = cartState.totalPrice + deliveryFee

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/menu">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {cartState.items.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-600 mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-6">Add some products to get started!</p>
              {/* <Link href="/menu"> */}
              <Link href="/">
                <Button className="bg-green-600 hover:bg-green-700">Browse Products</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Cart Items ({cartState.totalItems})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cartState.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <Image
                          // src={item.image || "/placeholder.svg"}
                          src={"https://i.ibb.co/fZhhwLS/Apple-Gelato.webp"}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-gray-600 capitalize">{item.category}</p>
                          {item.thc && (
                            <div className="flex space-x-4 text-xs text-gray-500 mt-1">
                              <span>THC: {item.thc}</span>
                              <span>CBD: {item.cbd}</span>
                            </div>
                          )}
                          <p className="text-lg font-bold text-green-600">${item.price}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-medium w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${cartState.totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>${deliveryFee.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-green-600">${total.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col mt-6 space-y-1">
                    {/* <Link href="/checkout"> */}
                    <Link href="">
                      <Button className="w-full bg-green-600 hover:bg-green-700">Proceed to Checkout</Button>
                    </Link>
                    <Link href="/menu">
                      <Button variant="outline" className="w-full bg-transparent">
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Delivery Information</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Same-day delivery available</li>
                    <li>• Free delivery on orders over $100</li>
                    <li>• Discrete packaging guaranteed</li>
                    <li>• Contact us for delivery areas</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
