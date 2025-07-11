import { NextResponse } from "next/server"
import { getProductById, updateProduct, deleteProduct } from "@/lib/db-operations"
// This route should be protected by middleware

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const product = await getProductById(params.id)
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, product: product })
  } catch (error) {
    console.error("Failed to fetch product:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch product", error }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const updatedProduct = await updateProduct(params.id, body)
    if (!updatedProduct) {
      return NextResponse.json({ success: false, message: "Product not found or failed to update" }, { status: 404 })
    }
    return NextResponse.json({ success: true, product: updatedProduct })
  } catch (error) {
    console.error("Failed to update product:", error)
    return NextResponse.json({ success: false, message: "Failed to update product", error }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const success = await deleteProduct(params.id)
    if (!success) {
      return NextResponse.json({ success: false, message: "Product not found or failed to delete" }, { status: 404 })
    }
    return NextResponse.json({ success: true, message: "Product deleted successfully" })
  } catch (error) {
    console.error("Failed to delete product:", error)
    return NextResponse.json({ success: false, message: "Failed to delete product", error }, { status: 500 })
  }
}
