"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, Loader2, Video, Music } from "lucide-react"

interface MediaUploadProps {
  currentMedia?: string
  onMediaChange: (mediaUrl: string) => void
  onFileChange: (file: File | null) => void
  label?: string
  required?: boolean
  uploading?: boolean
}

export default function MediaUpload({ 
  currentMedia, 
  onMediaChange, 
  onFileChange,
  label = "Product Media",
  required = false,
  uploading = false
}: MediaUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(currentMedia || "")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileType, setFileType] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Cleanup object URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  // Set initial preview URL for existing media
  useEffect(() => {
    if (currentMedia && !selectedFile) {
      setPreviewUrl(currentMedia)
    }
  }, [currentMedia, selectedFile])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = [
      'video/mp4', 'video/avi', 'video/quicktime', 'video/x-quicktime', 'video/wmv', 'video/webm',
      'audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/aac', 'audio/x-m4a'
    ]
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Only video (MP4, AVI, MOV, WMV, WebM) and audio (MP3, WAV, OGG, M4A, AAC) files are allowed.')
      return
    }

    // Validate file size (50MB limit for media files)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      alert('File too large. Maximum size is 50MB.')
      return
    }

    // Create preview URL for the selected file
    const fileUrl = URL.createObjectURL(file)
    setPreviewUrl(fileUrl)
    setSelectedFile(file)
    setFileType(file.type)
    onFileChange(file) // Pass file to parent component
    onMediaChange("") // Clear any existing URL since we have a new file
  }

  const handleRemoveMedia = () => {
    // Clean up object URL if it exists
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl("")
    setSelectedFile(null)
    setFileType("")
    onMediaChange("")
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

  const getMediaUrl = () => {
    return previewUrl || currentMedia || ""
  }

  const isVideo = () => {
    const url = getMediaUrl()
    const type = fileType || ""
    return type.startsWith('video/') || 
           url.includes('.mp4') || url.includes('.avi') || url.includes('.mov') || 
           url.includes('.wmv') || url.includes('.webm')
  }

  const isAudio = () => {
    const url = getMediaUrl()
    const type = fileType || ""
    return type.startsWith('audio/') || 
           url.includes('.mp3') || url.includes('.wav') || url.includes('.ogg') || 
           url.includes('.m4a') || url.includes('.aac')
  }

  const getFileName = () => {
    if (selectedFile) return selectedFile.name
    if (currentMedia) {
      // Extract filename from URL
      const urlParts = currentMedia.split('/')
      return urlParts[urlParts.length - 1]
    }
    return ""
  }

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      
      {/* Media Preview */}
      {getMediaUrl() ? (
        <div className="relative w-full max-w-lg">
          <div className="relative w-full rounded-2xl overflow-hidden border bg-gray-50">
            {isVideo() ? (
              <video
                src={getMediaUrl()}
                controls
                className="w-full h-auto max-h-80 rounded-2xl"
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
            ) : isAudio() ? (
              <div className="p-6">
                <div className="flex flex-col items-center space-y-4">
                  <Music className="h-12 w-12 text-green-500" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900">
                      {getFileName()}
                    </p>
                    {selectedFile && (
                      <p className="text-xs text-gray-500">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    )}
                  </div>
                  <audio
                    src={getMediaUrl()}
                    controls
                    className="w-full max-w-sm"
                    preload="metadata"
                  >
                    Your browser does not support the audio tag.
                  </audio>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <Upload className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {getFileName()}
                    </p>
                    {selectedFile && (
                      <p className="text-xs text-gray-500">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-2xl">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            )}
          </div>
          
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6"
            onClick={handleRemoveMedia}
            disabled={uploading}
          >
            <X className="h-4 w-4" />
          </Button>
          
          {/* File Info */}
          {selectedFile && (
            <div className="text-xs text-gray-500 mt-2 space-y-1">
              <p>📄 Ready to upload: {selectedFile.name}</p>
              <p>📊 Size: {formatFileSize(selectedFile.size)}</p>
              <p>🎬 Type: {fileType}</p>
              <p>☁️ Will be stored in Vercel Blob</p>
            </div>
          )}
          
          {/* Existing Media Info */}
          {currentMedia && !selectedFile && (
            <div className="text-xs text-gray-500 mt-2">
              <p>☁️ Stored in Vercel Blob</p>
            </div>
          )}
        </div>
      ) : (
        /* Upload Area */
        <div 
          className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
          onClick={handleUploadClick}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 mb-2">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-500">
            Video: MP4, AVI, MOV, WMV, WebM<br />
            Audio: MP3, WAV, OGG, M4A, AAC<br />
            Up to 50MB
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
        accept="video/*,audio/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      {/* Upload Button (Alternative) */}
      {!getMediaUrl() && (
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
              Choose Media File
            </>
          )}
        </Button>
      )}
    </div>
  )
}