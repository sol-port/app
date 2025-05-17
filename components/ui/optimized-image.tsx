"use client"

import { useState } from "react"
import Image, { type ImageProps } from "next/image"
import { imageLoader, getPlaceholderImage } from "@/lib/image-loader"
import { cn } from "@/lib/utils"

interface OptimizedImageProps extends Omit<ImageProps, "loader"> {
  fallbackText?: string
  className?: string
  imgClassName?: string
}

export function OptimizedImage({
  src,
  alt,
  width = 100,
  height = 100,
  fallbackText,
  className,
  imgClassName,
  ...props
}: OptimizedImageProps) {
  const [error, setError] = useState(false)

  const imageSrc = error ? getPlaceholderImage(Number(width), Number(height), fallbackText || alt) : src

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={imageSrc || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        loader={imageLoader}
        onError={() => setError(true)}
        className={cn("object-cover", imgClassName)}
        {...props}
      />
    </div>
  )
}
