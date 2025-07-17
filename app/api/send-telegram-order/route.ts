import { type NextRequest, NextResponse } from "next/server"
import type { Product } from "@/lib/models/Product"

// This interface now matches the data structure sent from the client
interface OrderData {
  customer: {
    contact: string
    shippingName: string
    shippingAddress: string
    notes: string
  }
  shipping: {
    carrier: string
    speed: string
    upgradeCost: number
  }
  payment: {
    method: string
    upcharge: number
  }
  items: (Product & { quantity: number })[]
  costs: {
    subtotal: number
    volumeDiscount: number
    shippingDiscount: number
    total: number
  }
  orderDate: string
}

function createCustomerTelegramLink(orderData: OrderData): string {
  const { customer, items, costs, shipping, payment } = orderData
  const orderNumber = `DB-${Date.now().toString().slice(-6)}`

  const itemsText = items.map((item) =>
    `${item.quantity}x ${item.name} ($ ${item.price.toFixed(2)})`
  ).join("\n")

  console.log("itemsText", itemsText)

  // Correctly calculate total discount from volume and shipping discounts
  const totalDiscount = costs.volumeDiscount + costs.shippingDiscount

  // Using encodeURIComponent for proper URL encoding of the message text
  const message = encodeURIComponent(`
NEW ORDER: #${orderNumber}
--------------------
CUSTOMER INFO
Contact: ${customer.contact}
Name: ${customer.shippingName}
Address: ${customer.shippingAddress}
Notes: ${customer.notes}
--------------------
ITEMS
${itemsText}
--------------------
COSTS
Subtotal: ${costs.subtotal.toFixed(2)}
Shipping Upgrade: ${shipping.upgradeCost.toFixed(2)}
Discount: -${totalDiscount.toFixed(2)}
Payment Upcharge: ${payment.upcharge.toFixed(2)}
Total: ${costs.total.toFixed(2)}
--------------------
SHIPPING & PAYMENT
Carrier: ${shipping.carrier}
Speed: ${shipping.speed}
Payment: ${payment.method}
--------------------
Please confirm this order.
  `)

  const adminUsername = process.env.ADMIN_TELEGRAM_USERNAME?.replace("@", "")

  if (adminUsername) {
    return `https://t.me/${adminUsername}?text=${message}`
  } else {
    // Fallback if no admin username is set
    return `https://t.me/?text=${message}`
  }
}

export async function POST(request: NextRequest) {
  try {
    const orderData: OrderData = await request.json()

    console.log("orderData", orderData)

    // Updated validation to check for the correct cost structure
    if (!orderData.costs || typeof orderData.costs.total !== "number") {
      throw new Error("Invalid order data: Missing or invalid cost information.")
    }

    // Additional validation for items
    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      throw new Error("Invalid order data: Missing or invalid items.")
    }

    const customerTelegramLink = createCustomerTelegramLink(orderData)

    return NextResponse.json({
      success: true,
      message: "Order submitted successfully. Please contact admin via the provided link.",
      telegramLink: customerTelegramLink,
    })
  } catch (error) {
    console.error("❌ Error processing order:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred."
    return NextResponse.json(
      {
        success: false,
        message: `Failed to process order: ${errorMessage}`,
      },
      { status: 500 },
    )
  }
}
