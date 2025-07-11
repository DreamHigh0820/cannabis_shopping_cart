import { NextResponse } from "next/server"
import { getProducts, createProduct } from "@/lib/db-operations"
// This route should be protected by middleware

export async function GET() {
  try {
    const products = await getProducts()
    return NextResponse.json({ success: true, products: products })
  } catch (error) {
    console.error("Failed to fetch products:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch products", error }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const newProduct = await createProduct(body)
    return NextResponse.json({ success: true, product: newProduct }, { status: 201 })
  } catch (error) {
    console.error("Failed to create product:", error)
    return NextResponse.json({ success: false, message: "Failed to create product", error }, { status: 500 })
  }
}
