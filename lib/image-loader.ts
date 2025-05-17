type ImageLoaderProps = {
  src: string
  width: number
  quality?: number
}
export const imageLoader = ({ src, width, quality = 75 }: ImageLoaderProps): string => {
  // external image
  if (src.startsWith("http")) {
    return src
  }

  // In public directory
  if (src.startsWith("/")) {
    // On production, use the base URL from environment variables
    // (e.g., https://example.com)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ""
    return `${baseUrl}${src}?w=${width}&q=${quality}`
  }

  // On development, use the base URL from environment variables
  // (e.g., http://localhost:3000)
  return `/${src}?w=${width}&q=${quality}`
}

export const getPlaceholderImage = (width: number, height: number, text?: string): string => {
  const encodedText = text ? encodeURIComponent(text) : "No+Image"
  return `/placeholder.svg?height=${height}&width=${width}&query=${encodedText}`
}
