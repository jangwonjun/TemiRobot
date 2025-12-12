'use client'

import { useEffect } from 'react'
import { temi } from '@/lib/temi-api-unified'

interface MoveCompletePageProps {
  tableNumber: number
  onComplete: () => void
}

export default function MoveCompletePage({ tableNumber, onComplete }: MoveCompletePageProps) {
  useEffect(() => {
    const speakArrivalMessage = async () => {
      try {
        // 통합 API 사용 (정적 import로 변경하여 청크 로드 에러 방지)
        const arrivalMessage = `${tableNumber}번 자리로 이동 완료되었습니다.`

        if (temi.isAvailable()) {
          // Android WebView에서 통합 API 사용
          await temi.speak(arrivalMessage)
        } else {
          // WebView가 아닌 경우 기존 API 사용 (Mock 환경)
          const useMock = localStorage.getItem('temi_use_mock') !== 'false'
          const TemiApi = useMock
            ? (await import('@/lib/temi-api-mock')).default
            : (await import('@/lib/temi-api')).default
          const temiApi = new TemiApi()
          await temiApi.speak(arrivalMessage)
        }
      } catch (error) {
        console.error('음성 안내 실패:', error)
      }
    }

    speakArrivalMessage()

    // 2초 후 자동으로 다음 페이지로
    const timer = setTimeout(() => {
      onComplete()
    }, 2000)

    return () => clearTimeout(timer)
  }, [tableNumber, onComplete])

  return (
    <div className="hanji-background" style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      {/* 상단 타이틀 */}
      <div style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        marginBottom: '3rem',
        color: '#3e2723'
      }}>
        이동 완료
      </div>

      {/* 메인 박스 */}
      <div className="cream-paper" style={{
        padding: '4rem',
        width: '100%',
        maxWidth: '600px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#1a1a1a',
        }}>
          {tableNumber}번 자리 도착!
        </div>
      </div>

      {/* 자동으로 다음 페이지로 */}
      <div style={{
        marginTop: '2rem',
        fontSize: '1.2rem',
        color: '#5d4037'
      }}>
        잠시 후 자동으로 돌아갑니다...
      </div>
    </div>
  )
}

