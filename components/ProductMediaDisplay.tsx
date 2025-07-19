"use client"

import { useState } from "react"
import ProductImage from "@/components/ProductImage"
import { ChevronLeft, ChevronRight, Play, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Product {
  _id: string
  name: string
  image: string
  image2?: string
  media?: string
  category: string
}

interface ProductMediaDisplayProps {
  product: Product
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  // Helper functions from original component
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
  
  // Determine what to show based on available content
  const hasSecondImage = product.image2 && product.image2.trim() !== ""
  const hasMedia = product.media && product.media.trim() !== ""
  
  // If there's a second image, prioritize showing both images instead of media
  // Unless there's no second image, then show original side-by-side design
  const showImageCarousel = hasSecondImage
  const showSideBySide = !hasSecondImage && hasMedia
  
  // Create array of images for carousel
  const images = showImageCarousel 
    ? [product.image, product.image2].filter(Boolean) as string[]
    : [product.image]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  // Show image carousel when second image exists
  if (showImageCarousel) {
    return (
      <div className={`relative ${className}`}>
        <ProductImage
          src={images[currentImageIndex]}
          alt={`${product.name} - Image ${currentImageIndex + 1}`}
          width={imageWidth}
          height={imageHeight}
          className="w-full h-full object-cover rounded-t-lg"
        />
        
        {/* Navigation buttons */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 h-8 w-8"
          onClick={prevImage}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 h-8 w-8"
          onClick={nextImage}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        {/* Dots indicator */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
        
        {/* Image counter */}
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          {currentImageIndex + 1} / {images.length}
        </div>
      </div>
    )
  }

  // Show original side-by-side design when media exists but no second image
  if (showSideBySide) {
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

  // Fallback: Show full-width single image (original behavior)
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