import { NextResponse } from "next/server"
import { getProductById, updateProduct, deleteProduct } from "@/lib/db-operations"
import { unlink } from "fs/promises"
import { join } from "path"

// Helper function to delete image file from filesystem
async function deleteImageFile(imageUrl: string): Promise<void> {
  if (!imageUrl) return
  
  try {
    // Only delete files that are stored locally (start with /images/products/)
    if (imageUrl.startsWith('/images/products/')) {
      const filename = imageUrl.replace('/images/products/', '')
      const filePath = join(process.cwd(), 'public', 'images', 'products', filename)
      await unlink(filePath)
      console.log(`Deleted image file: ${filename}`)
    }
  } catch (error) {
    // File might not exist or already deleted - this is okay
    console.log(`Could not delete image file ${imageUrl}:`, error)
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const product = await getProductById(params.id)
    
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      product: product
    })
  } catch (error) {
    console.error("Failed to fetch product:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch product" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    
    // Get the current product to check if image is being changed
    const currentProduct = await getProductById(params.id)
    
    if (!currentProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      )
    }
    
    // Check if image is being updated
    const oldImageUrl = currentProduct.image
    const newImageUrl = body.image
    const imageChanged = oldImageUrl !== newImageUrl
    
    // Update the product
    const updatedProduct = await updateProduct(params.id, body)
    
    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, message: "Failed to update product" },
        { status: 500 }
      )
    }
    
    // Delete old image file if image was changed and old image exists
    if (imageChanged && oldImageUrl) {
      await deleteImageFile(oldImageUrl)
    }
    
    return NextResponse.json({
      success: true,
      product: updatedProduct,
      message: imageChanged ? "Product updated and old image removed" : "Product updated"
    })
  } catch (error) {
    console.error("Failed to update product:", error)
    return NextResponse.json(
      { success: false, message: "Failed to update product" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Get the product first to access the image URL
    const product = await getProductById(params.id)
    
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      )
    }
    
    // Delete the product from database
    const success = await deleteProduct(params.id)
    
    if (!success) {
      return NextResponse.json(
        { success: false, message: "Failed to delete product" },
        { status: 500 }
      )
    }
    
    // Delete associated image file
    if (product.image) {
      await deleteImageFile(product.image)
    }
    
    return NextResponse.json({
      success: true,
      message: "Product and associated image deleted successfully"
    })
  } catch (error) {
    console.error("Failed to delete product:", error)
    return NextResponse.json(
      { success: false, message: "Failed to delete product" },
      { status: 500 }
    )
  }
}