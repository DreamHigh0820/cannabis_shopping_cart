// /lib/utils/imageUtils.ts
import { del } from '@vercel/blob'

export const deleteImageFromBlob = async (imageUrl: string): Promise<boolean> => {
  try {
    // Check if it's a Vercel Blob URL
    if (!imageUrl || !imageUrl.includes('blob.vercel-storage.com')) {
      console.log('Not a Vercel Blob URL, skipping deletion:', imageUrl)
      return true // Consider non-blob URLs as "successfully handled"
    }

    console.log('Deleting image from Vercel Blob:', imageUrl)

    await del(imageUrl, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    console.log('Image deleted successfully:', imageUrl)
    return true

  } catch (error) {
    console.error('Failed to delete image from blob storage:', error)
    
    // If image doesn't exist, consider it a success
    if (error instanceof Error && error.message.includes('not found')) {
      console.log('Image was already deleted or not found:', imageUrl)
      return true
    }
    
    return false
  }
}