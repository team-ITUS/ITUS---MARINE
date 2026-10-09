import { useEffect } from 'react'

interface SeoProps {
  title: string
  description: string
}

/** Updates the document title and meta tags for the current page. */
export default function Seo({ title, description }: SeoProps) {
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
  }, [title, description])
  return null
}
