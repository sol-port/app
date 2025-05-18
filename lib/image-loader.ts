import { APP_CONFIG } from "@/lib/config"

// Base APP URL from config
const BASE_URL = APP_CONFIG.baseUrl

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
    return `${BASE_URL}${src}?w=${width}&q=${quality}`
  }

  // On development, use the base URL from environment variables
  // (e.g., http://localhost:3000)
  return `/${src}?w=${width}&q=${quality}`
}
