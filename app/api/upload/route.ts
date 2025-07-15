// /app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export async function POST(request: NextRequest) {
  try {
    // Check if BLOB_READ_WRITE_TOKEN is available
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('BLOB_READ_WRITE_TOKEN is not set')
      return NextResponse.json({ 
        success: false, 
        message: 'Server configuration error: Missing blob storage token' 
      }, { status: 500 })
    }

    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ 
        success: false, 
        message: 'No file uploaded' 
      }, { status: 400 })
    }

    console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type)

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' 
      }, { status: 400 })
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        success: false, 
        message: 'File too large. Maximum size is 5MB.' 
      }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).substring(2, 8)
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filename = `products/${timestamp}-${randomSuffix}-${originalName}`

    console.log('Uploading to Vercel Blob with filename:', filename)

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: true, // This ensures uniqueness even if filename conflicts
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    console.log('Upload successful:', blob.url)

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      imageUrl: blob.url
    })

  } catch (error) {
    console.error('Upload error details:', error)
    
    // More specific error handling
    if (error instanceof Error) {
      if (error.message.includes('token')) {
        return NextResponse.json({ 
          success: false, 
          message: 'Authentication error with blob storage' 
        }, { status: 500 })
      }
      
      return NextResponse.json({ 
        success: false, 
        message: `Upload failed: ${error.message}` 
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to upload file' 
    }, { status: 500 })
  }
}