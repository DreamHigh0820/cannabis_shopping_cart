// /app/api/admin/delete-image/route.ts
import { NextResponse } from "next/server"
import { del } from '@vercel/blob'

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json()
    
    if (!imageUrl) {
      return NextResponse.json(
        { success: false, message: "Image URL is required" },
        { status: 400 }
      )
    }
    
    // Only delete Vercel Blob URLs
    if (!imageUrl.includes('blob.vercel-storage.com')) {
      return NextResponse.json(
        { success: false, message: "Can only delete Vercel Blob storage images" },
        { status: 400 }
      )
    }
    
    try {
      // Delete from Vercel Blob
      await del(imageUrl)
      
      return NextResponse.json({
        success: true,
        message: "Image deleted successfully"
      })
    } catch (error) {
      console.error("Failed to delete image:", error)
      return NextResponse.json(
        { success: false, message: "Failed to delete image" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Delete image error:", error)
    return NextResponse.json(
      { success: false, message: "Failed to process request" },
      { status: 500 }
    )
  }
}