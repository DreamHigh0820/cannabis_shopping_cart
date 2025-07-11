"use client"

import { useMemo } from "react"
import type { CartState } from "@/lib/cart-context"

// Define constants for "magic numbers"
const QP_FLOWER_SHIPPING_FEE = 100
const QP_FLOWER_DISCOUNT_THRESHOLD = 4 // 1-4 QPs get one shipping fee
const VAPE_2DAY_SHIPPING_RATE = 0.5
const VAPE_OVERNIGHT_SHIPPING_RATE = 1
const FLOWER_2DAY_SHIPPING_RATE = 50
const FLOWER_OVERNIGHT_SHIPPING_RATE = 100
const PAYMENT_UPCHARGE_RATE = 0.03

// Pound volume discount tiers
const POUND_DISCOUNT_TIERS = [
  { min: 7, discount: 100 },
  { min: 4, discount: 75 },
  { min: 1, discount: 50 },
]

export const useCartCalculations = (cartState: CartState) => {
  const calculations = useMemo(() => {
    const { items, shippingCarrier, shippingSpeed, paymentMethod } = cartState

    const qpFlowerCount = items.reduce(
      (count, item) => (item.category === "flower" && item.name.includes("QP") ? count + item.quantity : count),
      0,
    )
    const vapeCount = items.reduce((count, item) => (item.category === "vape" ? count + item.quantity : count), 0)
    const poundFlowerCount = items.reduce(
      (count, item) => (item.category === "flower" && item.name.includes("Pound") ? count + item.quantity : count),
      0,
    )

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    // 1. Volume Discount for Pounds
    let volumeDiscount = 0
    if (poundFlowerCount > 0) {
      const tier = POUND_DISCOUNT_TIERS.find((t) => poundFlowerCount >= t.min)
      if (tier) {
        volumeDiscount = tier.discount * poundFlowerCount
      }
    }

    // 2. Shipping Discount for QP Flowers
    // This is the "auto coupon" logic.
    let shippingDiscount = 0
    if (qpFlowerCount > 0) {
      const shippingSets = Math.ceil(qpFlowerCount / QP_FLOWER_DISCOUNT_THRESHOLD)
      const expectedShippingCost = shippingSets * QP_FLOWER_SHIPPING_FEE
      // The base price includes $100 shipping per QP. We need to refund the difference.
      const includedShippingCost = qpFlowerCount * QP_FLOWER_SHIPPING_FEE
      shippingDiscount = includedShippingCost - expectedShippingCost
    }

    // 3. Shipping Upgrade Costs
    let shippingUpgradeCost = 0
    if (shippingCarrier && shippingSpeed) {
      if (shippingSpeed === "2-day") {
        shippingUpgradeCost += vapeCount * VAPE_2DAY_SHIPPING_RATE
        shippingUpgradeCost += (qpFlowerCount + poundFlowerCount) * FLOWER_2DAY_SHIPPING_RATE
      } else if (shippingSpeed === "overnight") {
        shippingUpgradeCost += vapeCount * VAPE_OVERNIGHT_SHIPPING_RATE
        shippingUpgradeCost += (qpFlowerCount + poundFlowerCount) * FLOWER_OVERNIGHT_SHIPPING_RATE
      }
    }

    // 4. Payment Upcharge
    const priceAfterDiscounts = subtotal - volumeDiscount - shippingDiscount + shippingUpgradeCost
    let paymentUpcharge = 0
    if (paymentMethod === "CashApp" || paymentMethod === "Zelle") {
      paymentUpcharge = priceAfterDiscounts * PAYMENT_UPCHARGE_RATE
    }

    // 5. Final Total
    const total = priceAfterDiscounts + paymentUpcharge

    return {
      subtotal,
      volumeDiscount,
      shippingDiscount,
      shippingUpgradeCost,
      paymentUpcharge,
      total,
      qpFlowerCount, // returning this for potential display/debug
    }
  }, [cartState])

  return calculations
}
