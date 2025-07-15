// /app/api/admin/delete-image/route.ts
import { NextResponse } from "next/server"
import { del } from '@vercel/blob'
import { unlink } from "fs/promises"
import { join } from "path"

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json()
    
    if (!imageUrl) {
      return NextResponse.json(
        { success: false, message: "Image URL is required" },
        { status: 400 }
      )
    }
    
    const isProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production' || process.env.FORCE_BLOB === 'true'
    
    try {
      if (isProduction) {
        // In production, only delete Vercel Blob URLs
        if (imageUrl.startsWith('https://') && imageUrl.includes('blob.vercel-storage.com')) {
          await del(imageUrl)
        }
      } else {
        // In development, delete local files
        if (imageUrl.startsWith('/images/products/')) {
          const filename = imageUrl.replace('/images/products/', '')
          const filePath = join(process.cwd(), 'public', 'images', 'products', filename)
          await unlink(filePath)
        }
      }
      
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