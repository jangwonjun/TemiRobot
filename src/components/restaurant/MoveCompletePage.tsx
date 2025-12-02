'use client'

import { useEffect } from 'react'

interface MoveCompletePageProps {
  tableNumber: number
  onComplete: () => void
}

export default function MoveCompletePage({ tableNumber, onComplete }: MoveCompletePageProps) {
  useEffect(() => {
    const speakArrivalMessage = async () => {
      try {
        // WebView에서 TemiInterface 사용 가능한지 확인
        const { isTemiWebViewAvailable, temiSpeak } = await import('@/lib/temi-webview-interface')
        
        const arrivalMessage = `${tableNumber}번 자리로 이동 완료되었습니다. 즐거운 식사 되세요!`
        
        if (isTemiWebViewAvailable()) {
          // Android WebView에서 TemiInterface 사용
          await temiSpeak(arrivalMessage)
        } else {
          // WebView가 아닌 경우 기존 API 사용
          const useMock = localStorage.getItem('temi_use_mock') !== 'false'
          const TemiApi = useMock 
            ? (await import('@/lib/temi-api-mock')).default
            : (await import('@/lib/temi-api')).default
          const temi = new TemiApi()
          await temi.speak(arrivalMessage)
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
    <div className="torder-background" style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(1rem, 3vw, 2rem)',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      {/* 로고 */}
      <div className="torder-logo" style={{ marginBottom: 'clamp(1rem, 3vh, 2rem)', fontSize: 'clamp(1.5rem, 3.5vw, 2rem)' }}>
        팡씨네 할머니집
      </div>

      {/* 제목 */}
      <h1 className="torder-subtitle" style={{
        fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
        fontWeight: '500',
        marginBottom: 'clamp(1rem, 3vh, 2rem)',
        textAlign: 'center',
        color: '#fff',
        opacity: 0.9
      }}>
        자리 이동 안내 종료 page
      </h1>

      {/* 메인 박스 */}
      <div className="torder-card" style={{
        border: 'none',
        borderRadius: 'clamp(12px, 2vw, 16px)',
        padding: 'clamp(2.5rem, 6vw, 4rem)',
        width: '100%',
        maxWidth: 'min(90vw, 600px)',
        backgroundColor: '#fff',
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        boxSizing: 'border-box'
      }}>
        <div style={{
          fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
          fontWeight: 'bold',
          color: '#2c3e50',
          marginBottom: 'clamp(1rem, 3vh, 2rem)'
        }}>
          {tableNumber}번 자리로
        </div>
        <div style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 'bold',
          color: '#27ae60'
        }}>
          이동 완료
        </div>
      </div>

      {/* 자동으로 다음 페이지로 */}
      <div style={{
        marginTop: 'clamp(1rem, 3vh, 2rem)',
        fontSize: 'clamp(0.9rem, 2vw, 1rem)',
        color: '#fff',
        opacity: 0.8
      }}>
        잠시 후 자동으로 돌아갑니다...
      </div>
    </div>
  )
}

