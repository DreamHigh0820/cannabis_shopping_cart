// /app/api/admin/products/[id]/route.ts
import { NextResponse } from "next/server"
import { getProductById, updateProduct, deleteProduct } from "@/lib/db-operations"
import { deleteImageFromBlob } from "@/lib/utils/imageUtils"

// Updated to work with Vercel Blob storage for both images and media
async function deleteFileFromBlob(fileUrl: string): Promise<boolean> {
  if (!fileUrl) return true
  
  try {
    // Handle both old filesystem URLs and new Vercel Blob URLs
    if (fileUrl.startsWith('/images/products/')) {
      // Legacy local filesystem file - log but don't try to delete
      console.log(`Legacy filesystem file detected (not deleting): ${fileUrl}`)
      return true
    } else if (fileUrl.includes('blob.vercel-storage.com')) {
      // Vercel Blob storage file - delete using Blob API
      return await deleteImageFromBlob(fileUrl) // This function works for any file type
    } else {
      // Unknown file URL format
      console.log(`Unknown file URL format (skipping deletion): ${fileUrl}`)
      return true
    }
  } catch (error) {
    console.error(`Error deleting file ${fileUrl}:`, error)
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
    
    // Get the current product to check if images or media are being changed
    const currentProduct = await getProductById(params.id)
    
    if (!currentProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      )
    }
    
    // Check if primary image is being updated
    const oldImageUrl = currentProduct.image
    const newImageUrl = body.image
    const imageChanged = oldImageUrl !== newImageUrl
    
    // Check if second image is being updated
    const oldImage2Url = currentProduct.image2
    const newImage2Url = body.image2
    const image2Changed = oldImage2Url !== newImage2Url
    
    // Check if media is being updated
    const oldMediaUrl = currentProduct.media
    const newMediaUrl = body.media
    const mediaChanged = oldMediaUrl !== newMediaUrl
    
    // Update the product
    const updatedProduct = await updateProduct(params.id, body)
    
    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, message: "Failed to update product" },
        { status: 500 }
      )
    }
    
    // Delete old files if they were changed and old files exist
    let oldImageDeleted = true
    let oldImage2Deleted = true
    let oldMediaDeleted = true
    let deletionMessages: string[] = []
    
    if (imageChanged && oldImageUrl) {
      console.log('Primary image changed, deleting old image:', oldImageUrl)
      oldImageDeleted = await deleteFileFromBlob(oldImageUrl)
      if (!oldImageDeleted) {
        console.warn('Failed to delete old primary image:', oldImageUrl)
        deletionMessages.push("old primary image deletion failed")
      } else {
        deletionMessages.push("old primary image removed")
      }
    }
    
    if (image2Changed && oldImage2Url) {
      console.log('Second image changed, deleting old second image:', oldImage2Url)
      oldImage2Deleted = await deleteFileFromBlob(oldImage2Url)
      if (!oldImage2Deleted) {
        console.warn('Failed to delete old second image:', oldImage2Url)
        deletionMessages.push("old second image deletion failed")
      } else {
        deletionMessages.push("old second image removed")
      }
    }
    
    if (mediaChanged && oldMediaUrl) {
      console.log('Media changed, deleting old media:', oldMediaUrl)
      oldMediaDeleted = await deleteFileFromBlob(oldMediaUrl)
      if (!oldMediaDeleted) {
        console.warn('Failed to delete old media:', oldMediaUrl)
        deletionMessages.push("old media deletion failed")
      } else {
        deletionMessages.push("old media removed")
      }
    }
    
    // Create appropriate message
    let message = "Product updated"
    if (imageChanged || image2Changed || mediaChanged) {
      if (deletionMessages.length > 0) {
        message += " and " + deletionMessages.join(", ")
      }
    }
    
    return NextResponse.json({
      success: true,
      product: updatedProduct,
      message,
      oldImageDeleted,
      oldImage2Deleted,
      oldMediaDeleted
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
    // Get the product first to access the image, image2, and media URLs
    const product = await getProductById(params.id)
    
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      )
    }
    
    // Store URLs before deletion
    const imageUrl = product.image
    const image2Url = product.image2
    const mediaUrl = product.media
    
    // Delete the product from database first
    const success = await deleteProduct(params.id)
    
    if (!success) {
      return NextResponse.json(
        { success: false, message: "Failed to delete product" },
        { status: 500 }
      )
    }
    
    // Delete associated files
    let imageDeleted = true
    let image2Deleted = true
    let mediaDeleted = true
    let deletionMessages: string[] = []
    
    if (imageUrl) {
      console.log('Deleting product primary image:', imageUrl)
      imageDeleted = await deleteFileFromBlob(imageUrl)
      if (!imageDeleted) {
        console.warn('Failed to delete product primary image:', imageUrl)
        deletionMessages.push("primary image deletion failed")
      } else {
        deletionMessages.push("primary image deleted")
      }
    }
    
    if (image2Url) {
      console.log('Deleting product second image:', image2Url)
      image2Deleted = await deleteFileFromBlob(image2Url)
      if (!image2Deleted) {
        console.warn('Failed to delete product second image:', image2Url)
        deletionMessages.push("second image deletion failed")
      } else {
        deletionMessages.push("second image deleted")
      }
    }
    
    if (mediaUrl) {
      console.log('Deleting product media:', mediaUrl)
      mediaDeleted = await deleteFileFromBlob(mediaUrl)
      if (!mediaDeleted) {
        console.warn('Failed to delete product media:', mediaUrl)
        deletionMessages.push("media deletion failed")
      } else {
        deletionMessages.push("media deleted")
      }
    }
    
    // Create appropriate message
    let message = "Product deleted successfully"
    if (deletionMessages.length > 0) {
      message += " (" + deletionMessages.join(", ") + ")"
    }
    
    return NextResponse.json({
      success: true,
      message,
      imageDeleted,
      image2Deleted,
      mediaDeleted
    })
  } catch (error) {
    console.error("Failed to delete product:", error)
    return NextResponse.json(
      { success: false, message: "Failed to delete product" },
      { status: 500 }
    )
  }
}