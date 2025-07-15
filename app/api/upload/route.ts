// /app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ 
        success: false, 
        message: 'No file uploaded' 
      }, { status: 400 })
    }

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

    // Check if we're in production (Vercel) or local development
    // You can also force Vercel Blob usage locally by setting FORCE_BLOB=true
    const isProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production' || process.env.FORCE_BLOB === 'true'

    let imageUrl: string

    if (isProduction) {
      // Use Vercel Blob in production
      const blob = await put(file.name, file, {
        access: 'public',
      })
      imageUrl = blob.url
    } else {
      // Use local file system in development
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Create unique filename
      const fileExtension = file.name.split('.').pop()
      const uniqueFilename = `${uuidv4()}.${fileExtension}`
      
      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), 'public', 'images', 'products')
      try {
        await mkdir(uploadsDir, { recursive: true })
      } catch (error) {
        // Directory might already exist, that's ok
      }

      // Save file
      const filePath = join(uploadsDir, uniqueFilename)
      await writeFile(filePath, buffer)

      // Return the public URL
      imageUrl = `/images/products/${uniqueFilename}`
    }

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      imageUrl: imageUrl
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to upload file' 
    }, { status: 500 })
  }
}