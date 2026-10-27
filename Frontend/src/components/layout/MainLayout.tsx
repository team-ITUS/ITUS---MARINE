import type { ReactNode } from 'react'
import ScrollToTopButton from '@/components/common/ScrollToTopButton'
import Footer from './Footer'
import Header from './Header'

/** Header + page content + footer, shared by every page. */
export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <ScrollToTopButton />
    </>
  )
}
