import { NextResponse } from "next/server"
import { getProducts, createProduct } from "@/lib/db-operations"

// Admin products API - returns wrapped response format
export async function GET() {
  try {
    const products = await getProducts()
    // Return products wrapped in success object for admin
    return NextResponse.json({ 
      success: true, 
      products: products 
    })
  } catch (error) {
    console.error("Failed to fetch products:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" }, 
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'category', 'price', 'strain', 'cost']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, message: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }
    
    const newProduct = await createProduct(body)
    return NextResponse.json({ 
      success: true, 
      product: newProduct 
    }, { status: 201 })
  } catch (error) {
    console.error("Failed to create product:", error)
    return NextResponse.json(
      { success: false, message: "Failed to create product" }, 
      { status: 500 }
    )
  }
}