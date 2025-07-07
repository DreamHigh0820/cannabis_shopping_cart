// "use client"

// import type React from "react"

// import { useState } from "react"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Separator } from "@/components/ui/separator"
// import { Leaf, ArrowLeft, MessageCircle, Phone, MapPin } from "lucide-react"
// import { useCart } from "@/lib/cart-context"

// export default function CheckoutPage() {
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [orderSubmitted, setOrderSubmitted] = useState(false)

//   const { state: cartState, dispatch: cartDispatch } = useCart()

//   const deliveryFee = cartState.totalPrice > 0 ? 10 : 0
//   const total = cartState.totalPrice + deliveryFee

//   const handleSubmitOrder = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     setIsSubmitting(true)

//     const formData = new FormData(e.currentTarget)
//     const orderData = {
//       customer: {
//         name: formData.get("name"),
//         phone: formData.get("phone"),
//         email: formData.get("email"),
//         address: formData.get("address"),
//         city: formData.get("city"),
//         zipCode: formData.get("zipCode"),
//         notes: formData.get("notes"),
//       },
//       items: cartState.items,
//       total: total,
//       orderDate: new Date().toISOString(),
//     }

//     try {
//       // Send order to Telegram
//       const response = await fetch("/api/send-telegram-order", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(orderData),
//       })

//       if (response.ok) {
//         setOrderSubmitted(true)
//         // Clear cart after successful order
//         cartDispatch({ type: "CLEAR_CART" })
//       } else {
//         alert("Error submitting order. Please try again.")
//       }
//     } catch (error) {
//       console.error("Error submitting order:", error)
//       alert("Error submitting order. Please try again.")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   // Redirect to cart if empty
//   if (cartState.items.length === 0 && !orderSubmitted) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <Card className="w-full max-w-md">
//           <CardContent className="text-center py-12">
//             <h2 className="text-2xl font-semibold text-gray-600 mb-2">Your cart is empty</h2>
//             <p className="text-gray-500 mb-6">Add some products before checkout!</p>
//             <Link href="/menu">
//               <Button className="bg-green-600 hover:bg-green-700">Browse Products</Button>
//             </Link>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   if (orderSubmitted) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <Card className="w-full max-w-md">
//           <CardHeader className="text-center">
//             <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
//               <MessageCircle className="h-8 w-8 text-green-600" />
//             </div>
//             <CardTitle className="text-2xl text-green-600">Order Submitted!</CardTitle>
//           </CardHeader>
//           <CardContent className="text-center">
//             <p className="text-gray-600 mb-6">
//               Your order has been received! In a production environment, this would be sent to our team via Telegram.
//               We'll contact you shortly to confirm your order and arrange delivery.
//             </p>
//             <div className="space-y-3">
//               <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
//                 <Phone className="h-4 w-4" />
//                 <span>We'll call you within 30 minutes</span>
//               </div>
//               <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
//                 <MessageCircle className="h-4 w-4" />
//                 <span>Order confirmation via Telegram</span>
//               </div>
//               <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
//                 <MapPin className="h-4 w-4" />
//                 <span>Same-day delivery available</span>
//               </div>
//             </div>
//             <div className="mt-6 space-y-3">
//               <Link href="/menu">
//                 <Button className="w-full bg-green-600 hover:bg-green-700">Continue Shopping</Button>
//               </Link>
//               <Link href="/">
//                 <Button variant="outline" className="w-full bg-transparent">
//                   Return to Home
//                 </Button>
//               </Link>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center space-x-2">
//               <Leaf className="h-8 w-8 text-green-600" />
//               <Link href="/" className="text-2xl font-bold text-gray-900">
//                 DoughBoy
//               </Link>
//             </div>
//             <nav className="hidden md:flex space-x-8">
//               <Link href="/" className="text-gray-700 hover:text-green-600">
//                 Home
//               </Link>
//               <Link href="/menu" className="text-gray-700 hover:text-green-600">
//                 Menu
//               </Link>
//               <Link href="/blog" className="text-gray-700 hover:text-green-600">
//                 Blog
//               </Link>
//               <Link href="/about" className="text-gray-700 hover:text-green-600">
//                 About
//               </Link>
//               <Link href="/contact" className="text-gray-700 hover:text-green-600">
//                 Contact
//               </Link>
//             </nav>
//             <div className="flex items-center space-x-3">
//               <Link href="/cart">
//                 <Button variant="outline" size="sm">
//                   <ArrowLeft className="h-4 w-4 mr-2" />
//                   Back to Cart
//                 </Button>
//               </Link>
//               <Link href="/contact">
//                 <Button size="sm" className="bg-green-600 hover:bg-green-700">
//                   <MessageCircle className="h-4 w-4 mr-2" />
//                   Contact
//                 </Button>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Customer Information Form */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Customer Information</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleSubmitOrder} className="space-y-6">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="name">Full Name *</Label>
//                     <Input id="name" name="name" required />
//                   </div>
//                   <div>
//                     <Label htmlFor="phone">Phone Number *</Label>
//                     <Input id="phone" name="phone" type="tel" required />
//                   </div>
//                 </div>

//                 <div>
//                   <Label htmlFor="email">Email Address</Label>
//                   <Input id="email" name="email" type="email" />
//                 </div>

//                 <div>
//                   <Label htmlFor="address">Delivery Address *</Label>
//                   <Input id="address" name="address" required />
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="city">City *</Label>
//                     <Input id="city" name="city" required />
//                   </div>
//                   <div>
//                     <Label htmlFor="zipCode">ZIP Code *</Label>
//                     <Input id="zipCode" name="zipCode" required />
//                   </div>
//                 </div>

//                 <div>
//                   <Label htmlFor="notes">Special Instructions</Label>
//                   <Textarea
//                     id="notes"
//                     name="notes"
//                     placeholder="Any special delivery instructions or notes..."
//                     rows={3}
//                   />
//                 </div>

//                 <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
//                   {isSubmitting ? "Submitting Order..." : "Submit Order"}
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>

//           {/* Order Summary */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Order Summary</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {cartState.items.map((item) => (
//                   <div key={item.id} className="flex justify-between items-center">
//                     <div>
//                       <p className="font-medium">{item.name}</p>
//                       <p className="text-sm text-gray-600 capitalize">{item.category}</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
//                       <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
//                     </div>
//                   </div>
//                 ))}

//                 <Separator />

//                 <div className="flex justify-between items-center">
//                   <span>Subtotal</span>
//                   <span>${cartState.totalPrice.toFixed(2)}</span>
//                 </div>

//                 <div className="flex justify-between items-center">
//                   <span>Delivery Fee</span>
//                   <span>${deliveryFee.toFixed(2)}</span>
//                 </div>

//                 <Separator />

//                 <div className="flex justify-between items-center text-lg font-bold">
//                   <span>Total</span>
//                   <span className="text-green-600">${total.toFixed(2)}</span>
//                 </div>
//               </div>

//               <div className="mt-6 p-4 bg-blue-50 rounded-lg">
//                 <h3 className="font-semibold text-blue-900 mb-2">Order Process</h3>
//                 <ul className="text-sm text-blue-800 space-y-1">
//                   <li>• Your order will be sent to our team via Telegram</li>
//                   <li>• We'll contact you within 30 minutes to confirm</li>
//                   <li>• Payment is collected upon delivery</li>
//                   <li>• Same-day delivery available</li>
//                 </ul>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }

"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Leaf, ArrowLeft, MessageCircle, Phone, MapPin } from "lucide-react"
import { useCart } from "@/lib/cart-context"

export default function CheckoutPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderSubmitted, setOrderSubmitted] = useState(false)
  const [telegramLink, setTelegramLink] = useState<string>("")
  const [orderNumber, setOrderNumber] = useState<string>("")

  const { state: cartState, dispatch: cartDispatch } = useCart()

  const deliveryFee = cartState.totalPrice > 0 ? 10 : 0
  const total = cartState.totalPrice + deliveryFee

  const handleSubmitOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const orderData = {
      customer: {
        name: formData.get("name"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        address: formData.get("address"),
        city: formData.get("city"),
        zipCode: formData.get("zipCode"),
        notes: formData.get("notes"),
      },
      items: cartState.items,
      total: total,
      orderDate: new Date().toISOString(),
    }

    try {
      // Send order to Telegram
      const response = await fetch("/api/send-telegram-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        const result = await response.json()
        
        // Store the Telegram link and order number from backend response
        setTelegramLink(result.telegramLink)
        setOrderNumber(result.orderNumber)
        setOrderSubmitted(true)
        
        // Debug logging
        console.log("Backend response:", result)
        console.log("Telegram link:", result.telegramLink)
        
        // Clear cart after successful order
        cartDispatch({ type: "CLEAR_CART" })
        
        // Optional: Auto-redirect to Telegram after a short delay
        // setTimeout(() => {
        //   if (result.telegramLink) {
        //     window.open(result.telegramLink, '_blank')
        //   }
        // }, 2000)
        
      } else {
        alert("Error submitting order. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting order:", error)
      alert("Error submitting order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle opening Telegram link
  const handleOpenTelegram = () => {
    if (telegramLink) {
      window.open(telegramLink, '_blank')
    }
  }

  // Redirect to cart if empty
  if (cartState.items.length === 0 && !orderSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some products before checkout!</p>
            <Link href="/menu">
              <Button className="bg-green-600 hover:bg-green-700">Browse Products</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (orderSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <MessageCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Order Submitted!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Your order <strong>#{orderNumber}</strong> has been received!
            </p>
            
            {/* Main CTA - Open Telegram */}
            {telegramLink && (
              <div className="mb-6">
                <Button 
                  onClick={handleOpenTelegram}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3"
                  size="lg"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Open Telegram to Confirm Order
                </Button>
                <p className="text-sm text-gray-600 mt-2">
                  Click above to send your order details via Telegram
                </p>
              </div>
            )}

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>We'll call you within 30 minutes</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <MessageCircle className="h-4 w-4" />
                <span>Order confirmation via Telegram</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>Same-day delivery available</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link href="/menu">
                <Button className="w-full bg-green-600 hover:bg-green-700">Continue Shopping</Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full bg-transparent">
                  Return to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <Link href="/" className="text-2xl font-bold text-gray-900">
                DoughBoy
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-green-600">
                Home
              </Link>
              <Link href="/menu" className="text-gray-700 hover:text-green-600">
                Menu
              </Link>
              <Link href="/blog" className="text-gray-700 hover:text-green-600">
                Blog
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-green-600">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-green-600">
                Contact
              </Link>
            </nav>
            <div className="flex items-center space-x-3">
              <Link href="/cart">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Cart
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Information Form */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitOrder} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" name="phone" type="tel" required />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" />
                </div>

                <div>
                  <Label htmlFor="address">Delivery Address *</Label>
                  <Input id="address" name="address" required />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" name="city" required />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input id="zipCode" name="zipCode" required />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Special Instructions</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Any special delivery instructions or notes..."
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting Order..." : "Submit Order"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartState.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600 capitalize">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span>${cartState.totalPrice.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>

                <Separator />

                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span className="text-green-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Order Process</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Your order will be sent to our team via Telegram</li>
                  <li>• We'll contact you within 30 minutes to confirm</li>
                  <li>• Payment is collected upon delivery</li>
                  <li>• Same-day delivery available</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}