// /app/api/admin/delete-media/route.ts
import { NextResponse } from "next/server"
import { del } from '@vercel/blob'

export async function POST(request: Request) {
  try {
    const { mediaUrl } = await request.json()
    
    if (!mediaUrl) {
      return NextResponse.json(
        { success: false, message: "Media URL is required" },
        { status: 400 }
      )
    }
    
    // Only delete Vercel Blob URLs
    if (!mediaUrl.includes('blob.vercel-storage.com')) {
      return NextResponse.json(
        { success: false, message: "Can only delete Vercel Blob storage media" },
        { status: 400 }
      )
    }
    
    try {
      // Delete from Vercel Blob
      await del(mediaUrl)
      
      return NextResponse.json({
        success: true,
        message: "Media deleted successfully"
      })
    } catch (error) {
      console.error("Failed to delete media:", error)
      return NextResponse.json(
        { success: false, message: "Failed to delete media" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Delete media error:", error)
    return NextResponse.json(
      { success: false, message: "Failed to process request" },
      { status: 500 }
    )
  }
}