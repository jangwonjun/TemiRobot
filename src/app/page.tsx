'use client'

// 메인 페이지를 식당 페이지로 리다이렉트
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace('/restaurant')
  }, [router])
  
  return null
}
