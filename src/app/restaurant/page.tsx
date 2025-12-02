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

  const handleTableSelect = (tableNumber: number) => {
    setSelectedTable(tableNumber)
    setCurrentPage('person-select')
  }

  const handlePersonConfirm = async (size: number) => {
    setPartySize(size)
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

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {currentPage === 'main' && (
        <MainPage 
          onTableSelect={handleTableSelect}
          onMenuRecommend={handleMenuRecommend}
        />
      )}
      {currentPage === 'person-select' && (
        <PersonSelectPage 
          onConfirm={handlePersonConfirm}
          onBack={handleBackToMain}
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
    </div>
  )
}
