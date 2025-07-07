// import { type NextRequest, NextResponse } from "next/server"

// interface OrderItem {
//   id: number
//   name: string
//   category: string
//   price: number
//   quantity: number
//   thc?: string
//   cbd?: string
// }

// interface Customer {
//   name: string
//   phone: string
//   email?: string
//   address: string
//   city: string
//   zipCode: string
//   notes?: string
// }

// interface OrderData {
//   customer: Customer
//   items: OrderItem[]
//   total: number
//   orderDate: string
//   orderNumber?: string
// }

// export async function POST(request: NextRequest) {
//   try {
//     const orderData: OrderData = await request.json()

//     const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
//     const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

//     // Generate order number
//     const orderNumber = `DB-${Date.now().toString().slice(-6)}`
//     orderData.orderNumber = orderNumber

//     // For demo purposes or missing credentials
//     if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
//       console.log("🚀 Demo mode: Order would be sent to Telegram")
//       console.log("📋 Order Details:")
//       console.log(`Order #: ${orderNumber}`)
//       console.log(`Customer: ${orderData.customer.name}`)
//       console.log(`Phone: ${orderData.customer.phone}`)
//       console.log(`Total: $${orderData.total}`)
//       console.log("Items:", orderData.items.map((item) => `${item.name} x${item.quantity}`).join(", "))

//       return NextResponse.json({
//         success: true,
//         message: "Order submitted successfully (Demo mode)",
//         orderNumber,
//       })
//     }

//     // Format the order message with better styling
//     const orderMessage = formatOrderMessage(orderData)

//     // Send message to Telegram
//     const telegramResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         chat_id: TELEGRAM_CHAT_ID,
//         text: orderMessage,
//         parse_mode: "HTML",
//         disable_web_page_preview: true,
//       }),
//     })

//     if (!telegramResponse.ok) {
//       const errorData = await telegramResponse.json()
//       console.error("Telegram API Error:", errorData)
//       throw new Error(`Telegram API Error: ${errorData.description || "Unknown error"}`)
//     }

//     const telegramData = await telegramResponse.json()
//     console.log("✅ Order sent to Telegram successfully:", telegramData.message_id)

//     return NextResponse.json({
//       success: true,
//       message: "Order submitted successfully",
//       orderNumber,
//       telegramMessageId: telegramData.message_id,
//     })
//   } catch (error) {
//     console.error("❌ Error sending Telegram order:", error)

//     // Still return success for demo purposes, but log the error
//     return NextResponse.json({
//       success: true,
//       message: "Order received and logged",
//       error: error instanceof Error ? error.message : "Unknown error",
//     })
//   }
// }

// function formatOrderMessage(orderData: OrderData): string {
//   const { customer, items, total, orderNumber } = orderData

//   // Calculate subtotal and delivery fee
//   const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
//   const deliveryFee = 10

//   // Helper function to escape HTML characters
//   const escapeHtml = (text: string): string => {
//     return text
//       .replace(/&/g, '&amp;')
//       .replace(/</g, '&lt;')
//       .replace(/>/g, '&gt;')
//       .replace(/"/g, '&quot;')
//       .replace(/'/g, '&#39;')
//   }

//   return `
// 🛒 <b>NEW ORDER RECEIVED</b>
// ━━━━━━━━━━━━━━━━━━━━

// 📋 <b>Order #:</b> ${escapeHtml(orderNumber || '')}
// 🕐 <b>Time:</b> ${escapeHtml(new Date(orderData.orderDate).toLocaleString())}

// 👤 <b>CUSTOMER INFO</b>
// • <b>Name:</b> ${escapeHtml(customer.name)}
// • <b>Phone:</b> ${escapeHtml(customer.phone)}
// ${customer.email ? `• <b>Email:</b> ${escapeHtml(customer.email)}` : ""}

// 📍 <b>DELIVERY ADDRESS</b>
// ${escapeHtml(customer.address)}
// ${escapeHtml(customer.city)}, ${escapeHtml(customer.zipCode)}

// 🛍️ <b>ORDER ITEMS</b>
// ${items
//   .map(
//     (item) =>
//       `• <b>${escapeHtml(item.name)}</b> (${escapeHtml(item.category)})
//   Qty: ${item.quantity} × $${item.price.toFixed(2)} = $${(item.price * item.quantity).toFixed(2)}
//   ${item.thc ? `THC: ${escapeHtml(item.thc)} | CBD: ${escapeHtml(item.cbd || "N/A")}` : ""}`,
//   )
//   .join("\n\n")}

// 💰 <b>ORDER SUMMARY</b>
// • Subtotal: $${subtotal.toFixed(2)}
// • Delivery: $${deliveryFee.toFixed(2)}
// • <b>Total: $${total.toFixed(2)}</b>

// ${customer.notes ? `📝 <b>NOTES:</b>\n${escapeHtml(customer.notes)}` : ""}

// ━━━━━━━━━━━━━━━━━━━━
// ⚡ Please confirm this order ASAP
//   `.trim()
// }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// import { type NextRequest, NextResponse } from "next/server"

// interface OrderItem {
//   id: number
//   name: string
//   category: string
//   price: number
//   quantity: number
//   thc?: string
//   cbd?: string
// }

// interface Customer {
//   name: string
//   phone: string
//   email?: string
//   address: string
//   city: string
//   zipCode: string
//   notes?: string
// }

// interface OrderData {
//   customer: Customer
//   items: OrderItem[]
//   total: number
//   orderDate: string
//   orderNumber?: string
// }

// export async function POST(request: NextRequest) {
//   try {
//     const orderData: OrderData = await request.json()

//     const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
//     const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

//     // Generate order number
//     const orderNumber = `DB-${Date.now().toString().slice(-6)}`
//     orderData.orderNumber = orderNumber

//     // Format the order message
//     const orderMessage = formatOrderMessage(orderData)
    
//     // Create Telegram link with pre-filled message
//     const telegramLink = createTelegramLink(orderData, orderMessage)

//     // For demo purposes or missing credentials
//     if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
//       console.log("🚀 Demo mode: Order would be sent to Telegram")
//       console.log("📋 Order Details:")
//       console.log(`Order #: ${orderNumber}`)
//       console.log(`Customer: ${orderData.customer.name}`)
//       console.log(`Phone: ${orderData.customer.phone}`)
//       console.log(`Total: ${orderData.total}`)
//       console.log("Items:", orderData.items.map((item) => `${item.name} x${item.quantity}`).join(", "))

//       return NextResponse.json({
//         success: true,
//         message: "Order submitted successfully (Demo mode)",
//         orderNumber,
//         telegramLink,
//       })
//     }

//     // Option 1: Send directly to admin (your current approach)
//     const telegramResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         chat_id: TELEGRAM_CHAT_ID,
//         text: orderMessage,
//         parse_mode: "HTML",
//         disable_web_page_preview: true,
//       }),
//     })

//     if (!telegramResponse.ok) {
//       const errorData = await telegramResponse.json()
//       console.error("Telegram API Error:", errorData)
//       throw new Error(`Telegram API Error: ${errorData.description || "Unknown error"}`)
//     }

//     const telegramData = await telegramResponse.json()
//     console.log("✅ Order sent to Telegram successfully:", telegramData.message_id)

//     return NextResponse.json({
//       success: true,
//       message: "Order submitted successfully",
//       orderNumber,
//       telegramMessageId: telegramData.message_id,
//       telegramLink, // Include the link for user interaction
//     })
//   } catch (error) {
//     console.error("❌ Error sending Telegram order:", error)

//     // Still return success for demo purposes, but log the error
//     return NextResponse.json({
//       success: true,
//       message: "Order received and logged",
//       error: error instanceof Error ? error.message : "Unknown error",
//     })
//   }
// }

// function createTelegramLink(orderData: OrderData, orderMessage: string): string {
//   // Create a simplified message for the URL (Telegram links have character limits)
//   const { customer, items, total, orderNumber } = orderData
  
//   const shortMessage = `🛒 NEW ORDER: ${orderNumber}
// 👤 ${customer.name} - ${customer.phone}
// 📍 ${customer.address}, ${customer.city}
// 🛍️ ${items.length} items - Total: ${total.toFixed(2)}

// Items:
// ${items.map(item => `• ${item.name} x${item.quantity} (${(item.price * item.quantity).toFixed(2)})`).join('\n')}

// ${customer.notes ? `📝 Notes: ${customer.notes}` : ''}

// Please confirm this order!`

//   // URL encode the message
//   const encodedMessage = encodeURIComponent(shortMessage)
  
//   // Create Telegram link - you can use different approaches:
  
//   // Option 1: Link to a specific user/chat (replace USERNAME with actual admin username)
//   // return `https://t.me/YOUR_ADMIN_USERNAME?text=${encodedMessage}`
  
//   // Option 2: Link to your bot with pre-filled message
//   // return `https://t.me/cannabisss_order_bot?start=${encodedMessage}`
  
//   // Option 3: Generic Telegram link (opens Telegram app)
//   return `https://t.me/share/url?url=${encodeURIComponent('New Order Notification')}&text=${encodedMessage}`
// }

// function formatOrderMessage(orderData: OrderData): string {
//   const { customer, items, total, orderNumber } = orderData

//   // Calculate subtotal and delivery fee
//   const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
//   const deliveryFee = 10

//   // Helper function to escape HTML characters
//   const escapeHtml = (text: string): string => {
//     return text
//       .replace(/&/g, '&amp;')
//       .replace(/</g, '&lt;')
//       .replace(/>/g, '&gt;')
//       .replace(/"/g, '&quot;')
//       .replace(/'/g, '&#39;')
//   }

//   return `
// 🛒 <b>NEW ORDER RECEIVED</b>
// ━━━━━━━━━━━━━━━━━━━━

// 📋 <b>Order #:</b> ${escapeHtml(orderNumber || '')}
// 🕐 <b>Time:</b> ${escapeHtml(new Date(orderData.orderDate).toLocaleString())}

// 👤 <b>CUSTOMER INFO</b>
// • <b>Name:</b> ${escapeHtml(customer.name)}
// • <b>Phone:</b> ${escapeHtml(customer.phone)}
// ${customer.email ? `• <b>Email:</b> ${escapeHtml(customer.email)}` : ""}

// 📍 <b>DELIVERY ADDRESS</b>
// ${escapeHtml(customer.address)}
// ${escapeHtml(customer.city)}, ${escapeHtml(customer.zipCode)}

// 🛍️ <b>ORDER ITEMS</b>
// ${items
//   .map(
//     (item) =>
//       `• <b>${escapeHtml(item.name)}</b> (${escapeHtml(item.category)})
//   Qty: ${item.quantity} × ${item.price.toFixed(2)} = ${(item.price * item.quantity).toFixed(2)}
//   ${item.thc ? `THC: ${escapeHtml(item.thc)} | CBD: ${escapeHtml(item.cbd || "N/A")}` : ""}`,
//   )
//   .join("\n\n")}

// 💰 <b>ORDER SUMMARY</b>
// • Subtotal: ${subtotal.toFixed(2)}
// • Delivery: ${deliveryFee.toFixed(2)}
// • <b>Total: ${total.toFixed(2)}</b>

// ${customer.notes ? `📝 <b>NOTES:</b>\n${escapeHtml(customer.notes)}` : ""}

// ━━━━━━━━━━━━━━━━━━━━
// ⚡ Please confirm this order ASAP
//   `.trim()
// }

import { type NextRequest, NextResponse } from "next/server"

interface OrderItem {
  id: number
  name: string
  category: string
  price: number
  quantity: number
  thc?: string
  cbd?: string
}

interface Customer {
  name: string
  phone: string
  email?: string
  address: string
  city: string
  zipCode: string
  notes?: string
}

interface OrderData {
  customer: Customer
  items: OrderItem[]
  total: number
  orderDate: string
  orderNumber?: string
}

export async function POST(request: NextRequest) {
  try {
    const orderData: OrderData = await request.json()

    const ADMIN_TELEGRAM_USERNAME = process.env.ADMIN_TELEGRAM_USERNAME // Add this to your .env

    // Generate order number
    const orderNumber = `DB-${Date.now().toString().slice(-6)}`
    orderData.orderNumber = orderNumber

    console.log("orderData", orderData)
    
    // Create Telegram link for customer to contact admin directly
    const customerTelegramLink = createCustomerTelegramLink(orderData)

    // Log the generated link for debugging
    console.log("Generated Telegram Link:", customerTelegramLink)

    // For demo purposes or missing admin username
    if (!ADMIN_TELEGRAM_USERNAME) {
      console.log("⚠️ No admin username configured - using fallback link")
      console.log("📋 Order Details:")
      console.log(`Order #: ${orderNumber}`)
      console.log(`Customer: ${orderData.customer.name}`)
      console.log(`Phone: ${orderData.customer.phone}`)
      console.log(`Total: ${orderData.total}`)
      console.log("Items:", orderData.items.map((item) => `${item.name} x${item.quantity}`).join(", "))

      return NextResponse.json({
        success: true,
        message: "Order submitted successfully (Demo mode)",
        orderNumber,
        telegramLink: customerTelegramLink,
        debug: {
          hasAdminUsername: false,
          linkType: "fallback"
        }
      })
    }

    // Just log the order locally and return the customer Telegram link
    console.log("✅ Order processed successfully:", orderNumber)
    console.log("📋 Order Details:")
    console.log(`Customer: ${orderData.customer.name}`)
    console.log(`Phone: ${orderData.customer.phone}`)
    console.log(`Total: ${orderData.total}`)
    console.log("Items:", orderData.items.map((item) => `${item.name} x${item.quantity}`).join(", "))

    return NextResponse.json({
      success: true,
      message: "Order submitted successfully",
      orderNumber,
      telegramLink: customerTelegramLink,
      debug: {
        hasAdminUsername: true,
        adminUsername: ADMIN_TELEGRAM_USERNAME,
        linkType: "direct"
      }
    })
  } catch (error) {
    console.error("❌ Error sending Telegram order:", error)

    // Still return success for demo purposes, but log the error
    return NextResponse.json({
      success: true,
      message: "Order received and logged",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}

function createCustomerTelegramLink(orderData: OrderData): string {
  const { customer, items, total, orderNumber } = orderData
  
  // Create a simple message format like your working example
  const itemsText = items.map(item => 
    `${item.quantity}x ${item.name} - ${(item.price * item.quantity).toFixed(2)}`
  ).join('%0A')
  
  const customerMessage = `Order ${orderNumber}%0A%0A${itemsText}%0A%0ATotal: ${total.toFixed(2)}%0A%0ACustomer: ${customer.name}%0APhone: ${customer.phone}%0AAddress: ${customer.address}, ${customer.city} ${customer.zipCode}${customer.notes ? `%0ANotes: ${customer.notes}` : ''}`
  
  // Get admin username from environment variable
  const adminUsername = process.env.ADMIN_TELEGRAM_USERNAME

  console.log("Admin username from env:", adminUsername)
  
  if (adminUsername && adminUsername.trim() !== '') {
    // Remove @ symbol if present
    const cleanUsername = adminUsername.replace('@', '')
    // Direct link to admin's Telegram with pre-filled message (no additional encoding needed)
    const directLink = `https://t.me/${cleanUsername}?text=${customerMessage}`
    console.log("Creating direct link:", directLink)
    return directLink
  } else {
    // Fallback with simple format
    console.log("No admin username - creating fallback")
    return `https://t.me/?text=${customerMessage}`
  }
}