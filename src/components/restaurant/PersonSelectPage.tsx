'use client'

import { useState } from 'react'

interface PersonSelectPageProps {
  onConfirm: (count: number) => void
  onBack: () => void
  selectedTable: number
  minCapacity?: number
  maxCapacity?: number
}

export default function PersonSelectPage({ onConfirm, onBack, selectedTable, minCapacity = 1, maxCapacity = 8 }: PersonSelectPageProps) {
  // 선택한 용량부터 maxCapacity까지 선택 가능
  const minCount = minCapacity
  const maxCount = maxCapacity

  const initialCount = minCapacity
  const [partySize, setPartySize] = useState(initialCount)

  const handleDecrement = () => {
    if (partySize > minCount) {
      setPartySize(partySize - 1)
    }
  }

  const handleIncrement = () => {
    if (partySize < maxCount) {
      setPartySize(partySize + 1)
    }
  }

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
        몇 분이서 오셨나요?
      </div>

      {/* 인원수 조절 영역 */}
      <div className="cream-paper" style={{
        padding: '3rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        marginBottom: '3rem',
        width: '100%',
        maxWidth: '500px'
      }}>
        <button
          onClick={handleDecrement}
          disabled={partySize <= minCount}
          className="dark-frame-button"
          style={{
            width: '60px',
            height: '60px',
            fontSize: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: partySize <= minCount ? 0.5 : 1
          }}
        >
          -
        </button>

        <div style={{
          fontSize: '5rem',
          fontWeight: 'bold',
          color: '#1a1a1a',
          width: '120px',
          textAlign: 'center'
        }}>
          {partySize}
        </div>

        <button
          onClick={handleIncrement}
          disabled={partySize >= maxCount}
          className="dark-frame-button"
          style={{
            width: '60px',
            height: '60px',
            fontSize: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: partySize >= maxCount ? 0.5 : 1
          }}
        >
          +
        </button>
      </div>

      {/* 하단 버튼 영역 */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        width: '100%',
        maxWidth: '500px'
      }}>
        <button
          onClick={onBack}
          className="dark-frame-button"
          style={{
            flex: 1,
            padding: '1rem',
            fontSize: '1.2rem',
            backgroundColor: '#fff',
            color: '#3e2723'
          }}
        >
          이전으로
        </button>
        <button
          onClick={() => onConfirm(partySize)}
          className="recommend-btn"
          style={{
            flex: 2,
            fontSize: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          <span>확인</span>
          <span>→</span>
        </button>
      </div>
    </div>
  )
}
