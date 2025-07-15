"use client"

import { useMemo } from "react"
import type { CartItem } from "@/lib/cart-context"

interface CalculationInputs {
  items: CartItem[]
  shippingCarrier: "ups" | "usps" | null
  shippingSpeed: "ground" | "2-day" | "overnight" | "priority" | "express" | null
  paymentMethod: string | null
}

export function useCartCalculations({ items, shippingCarrier, shippingSpeed, paymentMethod }: CalculationInputs) {
  return useMemo(() => {
    // Calculate subtotal using the price field (which now contains the effective price)
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

    // Volume Discount for "Flower by the Pound" (Flower category items that are NOT QP)
    const poundItems = items.filter((item) => 
      item.category.toLowerCase() === "flower" && !item.isQP
    )
    const poundItemCount = poundItems.reduce((acc, item) => acc + item.quantity, 0)
    let volumeDiscount = 0
    if (poundItemCount > 0) {
      const discountPerUnit = poundItemCount >= 7 ? 100 : poundItemCount >= 4 ? 75 : poundItemCount >= 1 ? 50 : 0
      volumeDiscount = poundItemCount * discountPerUnit
    }

    // Shipping Coupon for QP Flowers (Flower category items that ARE QP)
    const qpFlowerItems = items.filter((item) => 
      item.category.toLowerCase() === "flower" && item.isQP
    )
    const qpFlowerCount = qpFlowerItems.reduce((acc, item) => acc + item.quantity, 0)
    const requiredShippingCharges = Math.ceil(qpFlowerCount / 4)
    const paidShippingCharges = qpFlowerCount
    const shippingCoupon = (paidShippingCharges - requiredShippingCharges) * 100
    const shippingDiscount = qpFlowerCount > 0 ? Math.max(0, shippingCoupon) : 0

    // Shipping Speed Upgrade Cost
    let shippingUpgradeCost = 0
    if (shippingCarrier && shippingSpeed) {
      items.forEach((item) => {
        const category = item.category.toLowerCase()
        
        if (category === "flower") {
          if (shippingCarrier === "ups" && shippingSpeed === "2-day") shippingUpgradeCost += 50 * item.quantity
          if (shippingCarrier === "ups" && shippingSpeed === "overnight") shippingUpgradeCost += 100 * item.quantity
          if (shippingCarrier === "usps" && shippingSpeed === "express") shippingUpgradeCost += 50 * item.quantity
        } else if (category === "vape") {
          if (shippingCarrier === "ups" && shippingSpeed === "2-day") shippingUpgradeCost += 0.5 * item.quantity
          if (shippingCarrier === "ups" && shippingSpeed === "overnight") shippingUpgradeCost += 1 * item.quantity
          if (shippingCarrier === "usps" && shippingSpeed === "express") shippingUpgradeCost += 0.5 * item.quantity
        }
      })
    }

    const totalBeforeUpcharge = subtotal - volumeDiscount - shippingDiscount + shippingUpgradeCost

    // Payment Method Upcharge (3% for CashApp or Zelle)
    let paymentUpcharge = 0
    if (paymentMethod === "CashApp" || paymentMethod === "Zelle") {
      paymentUpcharge = totalBeforeUpcharge * 0.03
    }

    const total = totalBeforeUpcharge + paymentUpcharge

    return {
      subtotal,
      volumeDiscount,
      shippingDiscount,
      shippingUpgradeCost,
      paymentUpcharge,
      total,
      qpFlowerCount,
    }
  }, [items, shippingCarrier, shippingSpeed, paymentMethod])
}