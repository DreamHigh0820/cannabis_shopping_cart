import { NextResponse } from "next/server"
import { readdir, unlink, stat } from "fs/promises"
import { join } from "path"
import { getProducts } from "@/lib/db-operations"

export async function POST() {
  try {
    const uploadsDir = join(process.cwd(), 'public', 'images', 'products')
    
    // Get all product images from database
    const products = await getProducts()
    const usedImages = new Set(
      products
        .map(product => product.image)
        .filter(Boolean)
        .filter(imagePath => imagePath.startsWith('/images/products/')) // Only local images
        .map(imagePath => imagePath.replace('/images/products/', ''))
    )

    // Get all files in upload directory
    let filesInDirectory: string[] = []
    try {
      filesInDirectory = await readdir(uploadsDir)
      // Filter only image files
      filesInDirectory = filesInDirectory.filter(file => 
        /\.(jpg|jpeg|png|webp|gif)$/i.test(file)
      )
    } catch (error) {
      // Directory doesn't exist, nothing to clean
      return NextResponse.json({
        success: true,
        message: "No upload directory found, nothing to clean",
        deletedFiles: [],
        keptFiles: 0
      })
    }

    // Find orphaned files
    const orphanedFiles: string[] = []
    for (const filename of filesInDirectory) {
      if (!usedImages.has(filename)) {
        orphanedFiles.push(filename)
      }
    }

    // Delete orphaned files
    const deletedFiles: string[] = []
    for (const filename of orphanedFiles) {
      try {
        const filePath = join(uploadsDir, filename)
        await unlink(filePath)
        deletedFiles.push(filename)
      } catch (error) {
        console.error(`Failed to delete ${filename}:`, error)
      }
    }

    const keptFiles = filesInDirectory.length - deletedFiles.length

    return NextResponse.json({
      success: true,
      message: `Cleanup completed. Deleted ${deletedFiles.length} orphaned files, kept ${keptFiles} active files.`,
      deletedFiles,
      keptFiles,
      details: {
        totalFilesFound: filesInDirectory.length,
        usedImagesInDB: usedImages.size,
        orphanedFiles: deletedFiles
      }
    })

  } catch (error) {
    console.error("Cleanup error:", error)
    return NextResponse.json(
      { success: false, message: "Failed to cleanup images" },
    { status: 500 }
    )
  }
}