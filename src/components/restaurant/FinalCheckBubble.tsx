'use client'

import { useEffect } from 'react'
import { temi } from '@/lib/temi-api-unified'

interface FinalCheckBubbleProps {
  hasAllergy: boolean
  hasSpicy: boolean
  allergyItems: string[]
  spicyCount: number
  onConfirm: () => void
  onEdit: () => void
}

// Pangcae Final Check™
// 사용자가 가장 실수하기 쉬운 '결제 직전'에만 개입하는
// 로봇 기반 주문 안전 확인 인터페이스
export default function FinalCheckBubble({
  hasAllergy,
  hasSpicy,
  allergyItems,
  spicyCount,
  onConfirm,
  onEdit
}: FinalCheckBubbleProps) {
  useEffect(() => {
    // Temi 음성 안내 (선택)
    if (temi.isAvailable()) {
      temi.speak('주문 전에 잠깐만 확인해주세요.').catch(() => {})
    }
  }, [])

  // 케이스 1: 알러지만 있는 경우
  if (hasAllergy && !hasSpicy) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '100px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#fff9c4',
        border: '3px solid #f57c00',
        borderRadius: '20px',
        padding: '1.5rem',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        zIndex: 1000,
        fontFamily: 'Gowun Batang, serif',
        animation: 'fadeIn 0.3s ease-in'
      }}>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateX(-50%) translateY(10px); }
            to { opacity: 1; transform: translateX(-50%) translateY(0); }
          }
        `}</style>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.8rem', color: '#e65100' }}>
          ⚠️ 잠깐만 확인해주세요
        </div>
        <div style={{ fontSize: '1rem', marginBottom: '1rem', color: '#3e2723', lineHeight: '1.6' }}>
          선택하신 메뉴에 <strong>'{allergyItems[0]}'</strong> 성분이 포함되어 있어요.
          <br />
          알러지가 있으시면 지금 수정하실 수 있어요.
        </div>
        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button
            onClick={onEdit}
            style={{
              flex: 1,
              padding: '0.8rem',
              backgroundColor: '#fff',
              border: '2px solid #f57c00',
              borderRadius: '10px',
              fontSize: '1rem',
              cursor: 'pointer',
              color: '#e65100',
              fontWeight: 'bold'
            }}
          >
            메뉴 수정
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '0.8rem',
              backgroundColor: '#f57c00',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1rem',
              cursor: 'pointer',
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            괜찮아요
          </button>
        </div>
      </div>
    )
  }

  // 케이스 2: 매운 메뉴만 있는 경우
  if (!hasAllergy && hasSpicy) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '100px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#ffebee',
        border: '3px solid #d32f2f',
        borderRadius: '20px',
        padding: '1.5rem',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        zIndex: 1000,
        fontFamily: 'Gowun Batang, serif',
        animation: 'fadeIn 0.3s ease-in'
      }}>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateX(-50%) translateY(10px); }
            to { opacity: 1; transform: translateX(-50%) translateY(0); }
          }
        `}</style>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.8rem', color: '#c62828' }}>
          🌶️ 현재 선택하신 메뉴는
        </div>
        <div style={{ fontSize: '1rem', marginBottom: '1rem', color: '#3e2723', lineHeight: '1.6' }}>
          평균 매운 정도 <strong>{spicyCount}단계</strong>입니다.
        </div>
        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button
            onClick={onEdit}
            style={{
              flex: 1,
              padding: '0.8rem',
              backgroundColor: '#fff',
              border: '2px solid #d32f2f',
              borderRadius: '10px',
              fontSize: '1rem',
              cursor: 'pointer',
              color: '#c62828',
              fontWeight: 'bold'
            }}
          >
            덜 맵게
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '0.8rem',
              backgroundColor: '#d32f2f',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1rem',
              cursor: 'pointer',
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            그대로 주문
          </button>
        </div>
      </div>
    )
  }

  // 케이스 3: 종합 체크 (알러지 + 매운 메뉴)
  return (
    <div style={{
      position: 'fixed',
      bottom: '100px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#e8f5e9',
      border: '3px solid #2e7d32',
      borderRadius: '20px',
      padding: '1.5rem',
      maxWidth: '400px',
      width: '90%',
      boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
      zIndex: 1000,
      fontFamily: 'Gowun Batang, serif',
      animation: 'fadeIn 0.3s ease-in'
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
      <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.8rem', color: '#1b5e20' }}>
        ✅ 주문 전 마지막 확인입니다
      </div>
      <div style={{ fontSize: '1rem', marginBottom: '1rem', color: '#3e2723', lineHeight: '1.8' }}>
        <div>• 알러지 유발 성분: <strong>{allergyItems.length}건</strong></div>
        <div>• 매운 메뉴: <strong>{spicyCount}건</strong></div>
        <div style={{ marginTop: '0.5rem' }}>
          문제 없으면 주문을 완료해주세요.
        </div>
      </div>
      <button
        onClick={onConfirm}
        style={{
          width: '100%',
          padding: '0.8rem',
          backgroundColor: '#2e7d32',
          border: 'none',
          borderRadius: '10px',
          fontSize: '1.1rem',
          cursor: 'pointer',
          color: 'white',
          fontWeight: 'bold'
        }}
      >
        주문 완료
      </button>
    </div>
  )
}

