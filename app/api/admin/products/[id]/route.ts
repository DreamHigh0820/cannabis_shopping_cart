// /app/api/admin/products/[id]/route.ts
import { NextResponse } from "next/server"
import { getProductById, updateProduct, deleteProduct } from "@/lib/db-operations"
import { deleteImageFromBlob } from "@/lib/utils/imageUtils"

// Updated to work with Vercel Blob storage instead of filesystem
async function deleteImageFile(imageUrl: string): Promise<boolean> {
  if (!imageUrl) return true
  
  try {
    // Handle both old filesystem URLs and new Vercel Blob URLs
    if (imageUrl.startsWith('/images/products/')) {
      // Legacy local filesystem image - log but don't try to delete
      console.log(`Legacy filesystem image detected (not deleting): ${imageUrl}`)
      return true
    } else if (imageUrl.includes('blob.vercel-storage.com')) {
      // Vercel Blob storage image - delete using Blob API
      return await deleteImageFromBlob(imageUrl)
    } else {
      // Unknown image URL format
      console.log(`Unknown image URL format (skipping deletion): ${imageUrl}`)
      return true
    }
  } catch (error) {
    console.error(`Error deleting image ${imageUrl}:`, error)
    return false
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
    let oldImageDeleted = true
    if (imageChanged && oldImageUrl) {
      console.log('Image changed, deleting old image:', oldImageUrl)
      oldImageDeleted = await deleteImageFile(oldImageUrl)
      if (!oldImageDeleted) {
        console.warn('Failed to delete old image:', oldImageUrl)
      }
    }
    
    return NextResponse.json({
      success: true,
      product: updatedProduct,
      message: imageChanged 
        ? (oldImageDeleted ? "Product updated and old image removed" : "Product updated (old image deletion failed)")
        : "Product updated",
      oldImageDeleted
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
    
    // Store image URL before deletion
    const imageUrl = product.image
    
    // Delete the product from database first
    const success = await deleteProduct(params.id)
    
    if (!success) {
      return NextResponse.json(
        { success: false, message: "Failed to delete product" },
        { status: 500 }
      )
    }
    
    // Delete associated image file
    let imageDeleted = true
    if (imageUrl) {
      console.log('Deleting product image:', imageUrl)
      imageDeleted = await deleteImageFile(imageUrl)
      if (!imageDeleted) {
        console.warn('Failed to delete product image:', imageUrl)
      }
    }
    
    return NextResponse.json({
      success: true,
      message: imageDeleted 
        ? "Product and associated image deleted successfully"
        : "Product deleted successfully (image deletion failed)",
      imageDeleted
    })
  } catch (error) {
    console.error("Failed to delete product:", error)
    return NextResponse.json(
      { success: false, message: "Failed to delete product" },
      { status: 500 }
    )
  }
}