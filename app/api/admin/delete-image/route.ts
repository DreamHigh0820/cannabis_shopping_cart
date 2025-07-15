import { NextResponse } from "next/server"
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
    
    // Only delete files that are stored locally (start with /images/products/)
    if (!imageUrl.startsWith('/images/products/')) {
      return NextResponse.json(
        { success: false, message: "Can only delete local uploaded images" },
        { status: 400 }
      )
    }
    
    try {
      const filename = imageUrl.replace('/images/products/', '')
      const filePath = join(process.cwd(), 'public', 'images', 'products', filename)
      await unlink(filePath)
      
      return NextResponse.json({
        success: true,
        message: "Image deleted successfully"
      })
    } catch (error) {
      console.error("Failed to delete image file:", error)
      return NextResponse.json(
        { success: false, message: "Failed to delete image file" },
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