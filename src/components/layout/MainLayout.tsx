import type { ReactNode } from 'react'
import Footer from './Footer'
import Header from './Header'

/** Header + page content + footer, shared by every page. */
export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}
