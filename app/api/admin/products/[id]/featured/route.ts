import { NextResponse } from "next/server"
import { updateProduct } from "@/lib/db-operations"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { featured } = await request.json()
    
    const updatedProduct = await updateProduct(params.id, { featured })
    
    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      product: updatedProduct,
      message: `Product ${featured ? 'featured' : 'unfeatured'} successfully`
    })
  } catch (error) {
    console.error("Failed to update featured status:", error)
    return NextResponse.json(
      { success: false, message: "Failed to update featured status" },
      { status: 500 }
    )
  }
}