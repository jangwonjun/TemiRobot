import type { Metadata } from 'next'
import './globals.css'
import VersionInfo from '@/components/VersionInfo'

export const metadata: Metadata = {
  title: '팡씨네 할머니집',
  description: '테미 로봇을 활용한 식당 자리 안내 시스템',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        {children}
        <VersionInfo />
      </body>
    </html>
  )
}

