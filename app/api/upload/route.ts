// /app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      )
    }

    // Define allowed file types for both images and media
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const allowedMediaTypes = [
      'video/mp4', 'video/avi', 'video/quicktime', 'video/x-quicktime', 'video/wmv', 'video/webm',
      'audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/aac', 'audio/x-m4a'
    ]
    
    const allAllowedTypes = [...allowedImageTypes, ...allowedMediaTypes]

    // Validate file type
    if (!allAllowedTypes.includes(file.type)) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Invalid file type: ${file.type}. Allowed types: Images (JPEG, PNG, WebP) and Media (MP4, AVI, MOV, WMV, WebM, MP3, WAV, OGG, M4A, AAC)` 
        },
        { status: 400 }
      )
    }

    // Set file size limits based on type
    let maxSize: number
    if (allowedImageTypes.includes(file.type)) {
      maxSize = 5 * 1024 * 1024 // 5MB for images
    } else {
      maxSize = 50 * 1024 * 1024 // 50MB for media files
    }

    // Validate file size
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024)
      return NextResponse.json(
        { 
          success: false, 
          message: `File too large. Maximum size is ${maxSizeMB}MB for ${allowedImageTypes.includes(file.type) ? 'images' : 'media files'}` 
        },
        { status: 400 }
      )
    }

    // Generate filename with proper extension
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'bin'
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const filename = `${timestamp}-${randomString}.${fileExtension}`

    try {
      // Upload to Vercel Blob
      const blob = await put(filename, file, {
        access: 'public'
      })

      return NextResponse.json({
        success: true,
        imageUrl: blob.url, // Keep same property name for compatibility
        message: `${allowedImageTypes.includes(file.type) ? 'Image' : 'Media file'} uploaded successfully`
      })
    } catch (uploadError) {
      console.error('Vercel Blob upload error:', uploadError)
      return NextResponse.json(
        { success: false, message: 'Failed to upload file to storage' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Upload API error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to process upload request' },
      { status: 500 }
    )
  }
}