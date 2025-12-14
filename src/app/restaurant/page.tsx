'use client'

import { useState, useEffect } from 'react'
import '@/app/restaurant/globals.css'
import MainPage from '@/components/restaurant/MainPage'
import PersonSelectPage from '@/components/restaurant/PersonSelectPage'
import MovingGuidePage from '@/components/restaurant/MovingGuidePage'
import MoveCompletePage from '@/components/restaurant/MoveCompletePage'
import AutoReturnPage from '@/components/restaurant/AutoReturnPage'
import MenuRecommendPage from '@/components/restaurant/MenuRecommendPage'
import QRPage from '@/components/restaurant/QRPage'
import { temi } from '@/lib/temi-api-unified'
import StaffCallPage from '@/components/restaurant/StaffCallPage'
import ReturningPage from '@/components/restaurant/ReturningPage'

type PageType =
  | 'main'
  | 'person-select'
  | 'moving'
  | 'move-complete'
  | 'qr'
  | 'auto-return'
  | 'menu-recommend'
  | 'staff-call'
  | 'returning'

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

  // 주석: 도착 이벤트는 통합 API의 waitForArrival에서 관리하므로 여기서는 제거
  // 통합 API가 window.onTemiArrived를 등록하고 관리함

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
      // 통합 API 사용 (정적 import로 변경하여 청크 로드 에러 방지)
      if (temi.isAvailable()) {
        // Android WebView에서 통합 API 사용
        await temi.moveToSeat(seatNumber, {
          onArrived: (location) => {
            console.log(`✅ 도착 확인 완료: ${location}번 좌석`)
            setIsMoving(false)
            setCurrentPage('move-complete')
          },
          onTimeout: () => {
            console.log('⏱️ 도착 타임아웃 - 자동으로 완료 페이지로 이동')
            setIsMoving(false)
            setCurrentPage('move-complete')
          }
        })
      } else {
        // Fallback or legacy/mock behavior
        console.log('Temi API not available, using fallback simulation')
        setTimeout(() => {
          setIsMoving(false)
          setCurrentPage('move-complete')
        }, 3000)
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
    // 이동 완료 후 QR 페이지로 이동
    setCurrentPage('qr')
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

  const handleCallStaff = () => {
    setCurrentPage('staff-call')

    // 3초 후 복귀중 페이지로
    setTimeout(() => {
      setCurrentPage('returning')

      // 3초 후 메인으로
      setTimeout(() => {
        setCurrentPage('main')
      }, 3000)
    }, 3000)
  }

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'fixed', top: 0, left: 0 }}>
      {currentPage === 'main' && (
        <MainPage
          onTableSelect={handleTableSelect}
          onMenuRecommend={handleMenuRecommend}
          remainingSeats={remainingSeats}
          onResetSeats={handleResetSeats}
          onCallStaff={handleCallStaff}
        />
      )}
      {currentPage === 'person-select' && (
        <PersonSelectPage
          onConfirm={handlePersonConfirm}
          onBack={handleBackToMain}
          selectedTable={0}
          minCapacity={selectedCapacity ? selectedCapacity - 1 : 1}
          maxCapacity={selectedCapacity || 8}
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
      {currentPage === 'qr' && (
        <QRPage
          tableNumber={selectedTable || 0}
          onHome={handleBackToMain}
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
      {currentPage === 'staff-call' && (
        <StaffCallPage />
      )}
      {currentPage === 'returning' && (
        <ReturningPage />
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
