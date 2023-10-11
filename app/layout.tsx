import { Providers } from '@/context/Providers'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import WalletSelector from '@/components/WalletSelector'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Loockle',
  description: 'Lock & Rank information, on Bitcoin.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="light">
      <Script src="https://one.relayx.io/relayone.js"/>
      <body className={inter.className}>
        <Providers>
          <Navbar/>
          {children}
          <dialog id="wallet_selector" className="modal">
            <div className="modal-box">
              <WalletSelector/>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
        </Providers>
      </body>
    </html>
  )
}
