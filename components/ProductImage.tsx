"use client"

import { useState } from "react"
import Image from "next/image"

interface ProductImageProps {
  src?: string
  alt: string
  width: number
  height: number
  className?: string
}

export default function ProductImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = "" 
}: ProductImageProps) {
  const [imageError, setImageError] = useState(false)
  const [hasTriedFallback, setHasTriedFallback] = useState(false)

  // Create inline SVG placeholder to avoid 404s
  const placeholderSvg = `data:image/svg+xml;base64,${btoa(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <rect x="20%" y="35%" width="60%" height="30%" fill="#d1d5db" rx="8"/>
      <text x="50%" y="52%" font-family="Arial" font-size="16" text-anchor="middle" fill="#6b7280">
        Cannabis Product
      </text>
      <rect x="35%" y="15%" width="30%" height="15%" fill="#e5e7eb" rx="4"/>
    </svg>
  `)}`

  const handleImageError = () => {
    if (!hasTriedFallback) {
      setHasTriedFallback(true)
      setImageError(true)
    }
  }

  // Determine which image source to use
  const imageSrc = imageError || !src ? placeholderSvg : src

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleImageError}
    />
  )
}