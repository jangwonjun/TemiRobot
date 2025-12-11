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
  const [occupiedTables, setOccupiedTables] = useState<number[]>([])
  const [alertMessage, setAlertMessage] = useState<string | null>(null)

  const TABLE_RANGES: Record<number, number[]> = {
    2: [1, 2],
    4: [3, 4],
    6: [5, 6],
    8: [7, 8],
  }

  const handleTableSelect = (capacity: number) => {
    const range = TABLE_RANGES[capacity]
    const availableTable = range.find(t => !occupiedTables.includes(t))

    if (!availableTable) {
      setAlertMessage(`${capacity}인석이 현재 없습니다.`)
      setTimeout(() => setAlertMessage(null), 3000)
      return
    }

    setSelectedTable(availableTable)
    setCurrentPage('person-select')
  }

  const handlePersonConfirm = async (size: number) => {
    setPartySize(size)
    if (selectedTable && !occupiedTables.includes(selectedTable)) {
      setOccupiedTables(prev => [...prev, selectedTable])
      setRemainingSeats((prev) => Math.max(0, prev - 1))
    }
    setCurrentPage('moving')

    try {
      // WebView에서 TemiInterface 사용 가능한지 확인
      const { isTemiWebViewAvailable, temiGoTo, temiSpeak, getTableWaypoint } = await import('@/lib/temi-webview-interface')

      if (isTemiWebViewAvailable()) {
        // Android WebView에서 TemiInterface 사용
        const waypoint = getTableWaypoint(selectedTable || 0)
        const guideMessage = `${selectedTable}번 테이블로 안내해드리겠습니다.`

        // 안내 메시지 먼저
        await temiSpeak(guideMessage)

        // 테이블로 이동
        await temiGoTo(waypoint)

        console.log(`테이블 ${selectedTable}번(${waypoint})으로 이동 시작`)
      } else {
        // WebView가 아닌 경우 기존 API 사용
        const useMock = localStorage.getItem('temi_use_mock') !== 'false'
        const TemiApi = useMock
          ? (await import('@/lib/temi-api-mock')).default
          : (await import('@/lib/temi-api')).default
        const temi = new TemiApi()

        const waypointId = `table-${selectedTable}-waypoint`
        await temi.moveToLocation(waypointId)

        const guideMessage = `${selectedTable}번 테이블로 안내해드리겠습니다.`
        await temi.speak(guideMessage)
      }

      // 이동 완료 페이지로 (실제 이동 시간을 고려하여 5초 후)
      setTimeout(() => {
        setCurrentPage('move-complete')
      }, 5000)
    } catch (error) {
      console.error('로봇 이동 실패:', error)
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
  }

  const handleResetSeats = () => {
    setRemainingSeats(100) // Default initial value
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
          selectedTable={selectedTable || 0}
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
