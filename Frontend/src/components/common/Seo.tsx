import { useEffect } from 'react'

interface SeoProps {
  title: string
  description: string
  /** Share image (public path, already resolved with asset()). Pages without one clear any earlier og:image. */
  image?: string
}

/** Updates the document title and meta tags for the current page. */
export default function Seo({ title, description, image }: SeoProps) {
  useEffect(() => {
    document.title = title
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', description)
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute('content', title)
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute('content', description)

    let ogImage = document.querySelector<HTMLMetaElement>('meta[property="og:image"]')
    if (image) {
      if (!ogImage) {
        ogImage = document.createElement('meta')
        ogImage.setAttribute('property', 'og:image')
        document.head.append(ogImage)
      }
      ogImage.content = new URL(image, window.location.origin).href
    } else {
      ogImage?.remove()
    }
  }, [title, description, image])
  return null
}
