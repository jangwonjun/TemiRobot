'use client'

import { useState, useEffect } from 'react'
import '@/app/restaurant/globals.css'
import MainPage from '@/components/restaurant/MainPage'
import PersonSelectPage from '@/components/restaurant/PersonSelectPage'
import MovingGuidePage from '@/components/restaurant/MovingGuidePage'
import MoveCompletePage from '@/components/restaurant/MoveCompletePage'
import AutoReturnPage from '@/components/restaurant/AutoReturnPage'
import MenuRecommendPage from '@/components/restaurant/MenuRecommendPage'

type PageType =
  | 'main'
  | 'person-select'
  | 'moving'
  | 'move-complete'
  | 'auto-return'
  | 'menu-recommend'

export default function RestaurantPage() {
  const [currentPage, setCurrentPage] = useState<PageType>('main')
  const [selectedTable, setSelectedTable] = useState<number | null>(null)
  const [partySize, setPartySize] = useState<number>(1)
  const [remainingSeats, setRemainingSeats] = useState<number>(8)
  const [occupiedSeats, setOccupiedSeats] = useState<number[]>([])
  const [alertMessage, setAlertMessage] = useState<string | null>(null)
  const [isMoving, setIsMoving] = useState<boolean>(false)
  const [selectedCapacity, setSelectedCapacity] = useState<number | null>(null)

  /**
   * 인원수에 따라 좌석 번호(1~4)를 결정
   * 1~2명 -> 1번좌석
   * 3~4명 -> 2번좌석
   * 5~6명 -> 3번좌석
   * 7~8명 -> 4번좌석
   */
  const getSeatNumber = (partySize: number): number => {
    if (partySize <= 2) return 1
    if (partySize <= 4) return 2
    if (partySize <= 6) return 3
    return 4
  }

  const handleTableSelect = (capacity: number) => {
    // 테이블 용량 선택 시 용량 저장하고 인원수 선택 페이지로 이동
    setSelectedCapacity(capacity)
    setCurrentPage('person-select')
  }

  // 도착 이벤트 핸들러 등록
  useEffect(() => {
    // 전역 함수로 등록하여 Android에서 호출 가능하도록
    if (typeof window !== 'undefined') {
      (window as any).onTemiArrived = (location: string) => {
        console.log('도착 이벤트 수신:', location)
        setIsMoving(false)
        setCurrentPage('move-complete')
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).onTemiArrived
      }
    }
  }, [])

  const handlePersonConfirm = async (size: number) => {
    setPartySize(size)
    
    // 인원수에 따라 좌석 번호 결정 (1~4번)
    const seatNumber = getSeatNumber(size)
    console.log(`인원수: ${size}명 -> 좌석 번호: ${seatNumber}번`)
    
    // 좌석이 이미 사용 중인지 확인
    if (occupiedSeats.includes(seatNumber)) {
      setAlertMessage(`${seatNumber}번 좌석이 현재 사용 중입니다.`)
      setTimeout(() => setAlertMessage(null), 3000)
      return
    }

    // 좌석 사용 처리
    setOccupiedSeats(prev => [...prev, seatNumber])
    setRemainingSeats((prev) => Math.max(0, prev - 1))
    setSelectedTable(seatNumber)
    setIsMoving(true)
    setCurrentPage('moving')

    try {
      // WebView에서 TemiInterface 사용 가능한지 확인
      const { isTemiWebViewAvailable, temiGoTo, temiSpeak } = await import('@/lib/temi-webview-interface')

      if (isTemiWebViewAvailable()) {
        // Android WebView에서 TemiInterface 사용
        // 좌석 번호(1~4)를 그대로 waypoint로 사용 (SDK에서 1~4로 매핑되어 있음)
        const waypoint = seatNumber.toString()
        const guideMessage = `${seatNumber}번 좌석으로 안내해드리겠습니다.`

        // 안내 메시지 먼저
        await temiSpeak(guideMessage)

        // 좌석으로 이동 (waypoint는 "1", "2", "3", "4" 중 하나)
        await temiGoTo(waypoint)

        console.log(`좌석 ${seatNumber}번(waypoint: ${waypoint})으로 이동 시작`)
        
        // 도착 이벤트를 기다림 (타임아웃: 30초)
        // 도착 이벤트가 오지 않으면 타임아웃으로 처리
        setTimeout(() => {
          if (isMoving) {
            console.log('도착 타임아웃 - 자동으로 완료 페이지로 이동')
            setIsMoving(false)
            setCurrentPage('move-complete')
          }
        }, 30000)
      } else {
        // WebView가 아닌 경우 기존 API 사용
        const useMock = localStorage.getItem('temi_use_mock') !== 'false'
        const TemiApi = useMock
          ? (await import('@/lib/temi-api-mock')).default
          : (await import('@/lib/temi-api')).default
        const temi = new TemiApi()

        const waypointId = `table-${seatNumber}-waypoint`
        await temi.moveToLocation(waypointId)

        const guideMessage = `${seatNumber}번 좌석으로 안내해드리겠습니다.`
        await temi.speak(guideMessage)
        
        // Mock 환경에서는 5초 후 완료
        setTimeout(() => {
          setIsMoving(false)
          setCurrentPage('move-complete')
        }, 5000)
      }
    } catch (error) {
      console.error('로봇 이동 실패:', error)
      setIsMoving(false)
      // 에러가 있어도 이동 완료 페이지로
      setTimeout(() => {
        setCurrentPage('move-complete')
      }, 3000)
    }
  }

  const handleMoveComplete = () => {
    setCurrentPage('auto-return')

    // 5초 후 메인 페이지로 복귀
    setTimeout(() => {
      setCurrentPage('main')
      setSelectedTable(null)
      setPartySize(1)
    }, 5000)
  }

  const handleMenuRecommend = () => {
    setCurrentPage('menu-recommend')
  }

  const handleBackToMain = () => {
    setCurrentPage('main')
    setSelectedTable(null)
    setPartySize(1)
    setSelectedCapacity(null)
  }

  const handleResetSeats = () => {
    setRemainingSeats(8)
    setOccupiedSeats([])
    setSelectedTable(null)
    setPartySize(1)
  }

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'fixed', top: 0, left: 0 }}>
      {currentPage === 'main' && (
        <MainPage
          onTableSelect={handleTableSelect}
          onMenuRecommend={handleMenuRecommend}
          remainingSeats={remainingSeats}
          onResetSeats={handleResetSeats}
        />
      )}
      {currentPage === 'person-select' && (
        <PersonSelectPage
          onConfirm={handlePersonConfirm}
          onBack={handleBackToMain}
          selectedTable={0}
          minCapacity={selectedCapacity || 2}
        />
      )}
      {currentPage === 'moving' && (
        <MovingGuidePage
          tableNumber={selectedTable || 0}
        />
      )}
      {currentPage === 'move-complete' && (
        <MoveCompletePage
          tableNumber={selectedTable || 0}
          onComplete={handleMoveComplete}
        />
      )}
      {currentPage === 'auto-return' && (
        <AutoReturnPage />
      )}
      {currentPage === 'menu-recommend' && (
        <MenuRecommendPage
          onBack={handleBackToMain}
        />
      )}

      {/* 커스텀 알림 메시지 */}
      {alertMessage && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '2rem 4rem',
          borderRadius: '20px',
          fontSize: '2rem',
          fontWeight: 'bold',
          zIndex: 9999,
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          animation: 'fadeIn 0.3s ease-in-out'
        }}>
          {alertMessage}
        </div>
      )}
    </div>
  )
}
