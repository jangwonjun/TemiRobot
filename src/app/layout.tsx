import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '테미 로봇 제어 시스템',
  description: '테미 로봇을 제어하고 관리하는 웹 애플리케이션',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}

