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
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      {/* 로고 */}
      <div className="torder-logo" style={{ marginBottom: '2rem', fontSize: '2rem' }}>
        팡씨네 할머니집
      </div>

      {/* 제목 */}
      <h1 className="torder-subtitle" style={{
        fontSize: '1.5rem',
        fontWeight: '500',
        marginBottom: '2rem',
        textAlign: 'center',
        color: '#fff',
        opacity: 0.9
      }}>
        자리 이동 안내 종료 page
      </h1>

      {/* 메인 박스 */}
      <div className="torder-card" style={{
        border: 'none',
        borderRadius: '16px',
        padding: '4rem',
        width: '100%',
        maxWidth: '600px',
        backgroundColor: '#fff',
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#2c3e50',
          marginBottom: '2rem'
        }}>
          {tableNumber}번 자리로
        </div>
        <div style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          color: '#27ae60'
        }}>
          이동 완료
        </div>
      </div>

      {/* 자동으로 다음 페이지로 */}
      <div style={{
        marginTop: '2rem',
        fontSize: '1rem',
        color: '#666'
      }}>
        잠시 후 자동으로 돌아갑니다...
      </div>
    </div>
  )
}

