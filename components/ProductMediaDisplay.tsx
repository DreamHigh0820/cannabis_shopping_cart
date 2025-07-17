"use client"

import ProductImage from "@/components/ProductImage"
import { Play, Volume2 } from "lucide-react"

interface ProductMediaDisplayProps {
  product: {
    image: string
    media?: string
    name: string
  }
  className?: string
  imageWidth?: number
  imageHeight?: number
}

export default function ProductMediaDisplay({
  product,
  className = "",
  imageWidth = 400,
  imageHeight = 400
}: ProductMediaDisplayProps) {
  const isVideo = (url?: string) => {
    if (!url) return false
    return url.includes('.mp4') || url.includes('.avi') || url.includes('.mov') || 
           url.includes('.wmv') || url.includes('.webm') || url.includes('video')
  }

  const isAudio = (url?: string) => {
    if (!url) return false
    return url.includes('.mp3') || url.includes('.wav') || url.includes('.ogg') || 
           url.includes('.m4a') || url.includes('.aac') || url.includes('audio')
  }

  // If no media, show full-width image
  if (!product.media) {
    return (
      <div className={className}>
        <ProductImage
          src={product.image}
          alt={product.name}
          width={imageWidth}
          height={imageHeight}
          className="w-full h-full object-cover rounded-t-lg"
        />
      </div>
    )
  }

  // Show image and media side by side
  return (
    <div className={`grid grid-cols-2 gap-1 ${className}`}>
      {/* Left: Image */}
      <div className="relative h-52">
        <ProductImage
          src={product.image}
          alt={product.name}
          width={imageWidth / 2}
          height={imageHeight}
          className="w-full h-full object-cover rounded-tl-lg"
        />
      </div>

      {/* Right: Media */}
      <div className="relative h-52 bg-gray-900 rounded-tr-lg overflow-hidden">
        {isVideo(product.media) ? (
          <>
            <video
              src={product.media}
              className="w-full h-full object-cover"
              muted
              loop
              playsInline
              preload="metadata"
              onMouseEnter={(e) => {
                const video = e.target as HTMLVideoElement
                video.play().catch(() => {
                  // Ignore autoplay errors
                })
              }}
              onMouseLeave={(e) => {
                const video = e.target as HTMLVideoElement
                video.pause()
                video.currentTime = 0
              }}
            />
            {/* Video overlay indicator */}
            <div className="absolute top-1 right-1 bg-black bg-opacity-60 rounded-full p-1">
              <Play className="h-2 w-2 sm:h-3 sm:w-3 text-white fill-white" />
            </div>
          </>
        ) : isAudio(product.media) ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600 p-2">
            <Volume2 className="h-4 w-4 sm:h-6 sm:w-6 text-white mb-1" />
            <div className="w-full">
              <audio
                src={product.media}
                controls
                className="w-full h-6 sm:h-8"
                preload="metadata"
              />
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-500 text-xs">Media</span>
          </div>
        )}
      </div>
    </div>
  )
}