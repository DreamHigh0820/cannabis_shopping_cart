import { type NextRequest, NextResponse } from "next/server"
import { getProducts, getProductsByCategory } from "@/lib/db-operations"

// Force dynamic rendering if needed
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const category = searchParams.get("category")

    let products
    if (category && category !== "all") {
      products = await getProductsByCategory(category)
    } else {
      products = await getProducts()
    }

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}