"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, Loader2 } from "lucide-react"

interface ImageUploadProps {
  currentImage?: string
  onImageChange: (imageUrl: string) => void
  onFileChange: (file: File | null) => void
  label?: string
  required?: boolean
  uploading?: boolean
}

export default function ImageUpload({ 
  currentImage, 
  onImageChange, 
  onFileChange,
  label = "Product Image",
  required = false,
  uploading = false
}: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(currentImage || "")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Only JPEG, PNG, and WebP are allowed.')
      return
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      alert('File too large. Maximum size is 5MB.')
      return
    }

    // Show preview immediately but don't upload yet
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setPreviewUrl(result)
      setSelectedFile(file)
      onFileChange(file) // Pass file to parent component
      onImageChange("") // Clear any existing URL since we have a new file
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setPreviewUrl("")
    setSelectedFile(null)
    onImageChange("")
    onFileChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      
      {/* Image Preview */}
      {previewUrl ? (
        <div className="relative w-full max-w-sm">
          <div className="relative aspect-square w-full rounded-lg overflow-hidden border">
            <Image
              src={previewUrl}
              alt="Product preview"
              fill
              className="object-cover"
              sizes="(max-width: 384px) 100vw, 384px"
            />
            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            )}
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6"
            onClick={handleRemoveImage}
            disabled={uploading}
          >
            <X className="h-4 w-4" />
          </Button>
          
          {/* File Info */}
          {selectedFile && (
            <div className="text-xs text-gray-500 mt-2 space-y-1">
              <p>📄 Ready to upload: {selectedFile.name}</p>
              <p>📊 Size: {formatFileSize(selectedFile.size)}</p>
              <p>☁️ Will be stored in Vercel Blob</p>
            </div>
          )}
          
          {/* Existing Image Info */}
          {currentImage && !selectedFile && (
            <div className="text-xs text-gray-500 mt-2">
              <p>☁️ Stored in Vercel Blob</p>
            </div>
          )}
        </div>
      ) : (
        /* Upload Area */
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
          onClick={handleUploadClick}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 mb-2">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-500">
            PNG, JPG, WebP up to 5MB
          </p>
          <p className="text-xs text-blue-500 mt-1">
            ☁️ Stored in Vercel Blob
          </p>
        </div>
      )}

      {/* Hidden File Input */}
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      {/* Upload Button (Alternative) */}
      {!previewUrl && (
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleUploadClick}
          disabled={uploading}
          className="w-full"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Choose Image
            </>
          )}
        </Button>
      )}
    </div>
  )
}