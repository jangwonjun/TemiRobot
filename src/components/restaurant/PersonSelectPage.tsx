'use client'

import { useState } from 'react'

interface PersonSelectPageProps {
  onConfirm: (size: number) => void
  onBack: () => void
}

export default function PersonSelectPage({ onConfirm, onBack }: PersonSelectPageProps) {
  const [partySize, setPartySize] = useState(1)

  const handleDecrement = () => {
    if (partySize > 1) {
      setPartySize(partySize - 1)
    }
  }

  const handleIncrement = () => {
    if (partySize < 10) {
      setPartySize(partySize + 1)
    }
  }

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
        인원 선택 페이지
      </h1>

      {/* 메인 박스 */}
      <div className="torder-card" style={{
        border: 'none',
        borderRadius: 'clamp(12px, 2vw, 16px)',
        padding: 'clamp(2rem, 5vw, 3rem)',
        width: '100%',
        maxWidth: 'min(90vw, 600px)',
        backgroundColor: '#fff',
        position: 'relative',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        boxSizing: 'border-box'
      }}>
        {/* 질문 */}
        <div style={{
          fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 'clamp(1.5rem, 4vh, 3rem)',
          color: '#2c3e50'
        }}>
          어여와~ 몇 명이야?
        </div>

        {/* 인원 선택 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(1rem, 3vw, 2rem)',
          marginBottom: 'clamp(1.5rem, 4vh, 3rem)'
        }}>
          {/* 감소 버튼 */}
          <button
            onClick={handleDecrement}
            disabled={partySize <= 1}
            style={{
              width: 'clamp(50px, 8vw, 60px)',
              height: 'clamp(50px, 8vw, 60px)',
              borderRadius: '50%',
              border: partySize <= 1 ? '3px solid #bdc3c7' : '3px solid #e74c3c',
              backgroundColor: partySize <= 1 ? '#ecf0f1' : '#fff',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 'bold',
              color: partySize <= 1 ? '#95a5a6' : '#e74c3c',
              cursor: partySize <= 1 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              boxShadow: partySize <= 1 ? 'none' : '0 2px 8px rgba(231, 76, 60, 0.2)'
            }}
            onMouseEnter={(e) => {
              if (partySize > 1) {
                e.currentTarget.style.backgroundColor = '#ffe5e5'
                e.currentTarget.style.transform = 'scale(1.1)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = partySize <= 1 ? '#ecf0f1' : '#fff'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            -
          </button>

          {/* 인원 수 */}
          <div style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 'bold',
            color: '#e74c3c',
            minWidth: 'clamp(80px, 15vw, 100px)',
            textAlign: 'center'
          }}>
            {partySize}
          </div>

          {/* 증가 버튼 */}
          <button
            onClick={handleIncrement}
            disabled={partySize >= 10}
            style={{
              width: 'clamp(50px, 8vw, 60px)',
              height: 'clamp(50px, 8vw, 60px)',
              borderRadius: '50%',
              border: partySize >= 10 ? '3px solid #bdc3c7' : '3px solid #e74c3c',
              backgroundColor: partySize >= 10 ? '#ecf0f1' : '#fff',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 'bold',
              color: partySize >= 10 ? '#95a5a6' : '#e74c3c',
              cursor: partySize >= 10 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              boxShadow: partySize >= 10 ? 'none' : '0 2px 8px rgba(231, 76, 60, 0.2)'
            }}
            onMouseEnter={(e) => {
              if (partySize < 10) {
                e.currentTarget.style.backgroundColor = '#ffe5e5'
                e.currentTarget.style.transform = 'scale(1.1)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = partySize >= 10 ? '#ecf0f1' : '#fff'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            +
          </button>
        </div>

        {/* 확인 버튼 */}
        <button
          onClick={() => onConfirm(partySize)}
          className="torder-button"
          style={{
            width: '100%',
            padding: 'clamp(1rem, 2.5vw, 1.5rem)',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: 'clamp(10px, 1.5vw, 12px)',
            fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s',
            boxShadow: '0 4px 12px rgba(231, 76, 60, 0.3)'
          }}
        >
          확인
        </button>
      </div>

      {/* 뒤로가기 버튼 */}
      <button
        onClick={onBack}
        style={{
          marginTop: 'clamp(1rem, 3vh, 2rem)',
          padding: 'clamp(0.6rem, 1.5vw, 0.75rem) clamp(1.2rem, 3vw, 1.5rem)',
          backgroundColor: '#757575',
          color: 'white',
          border: 'none',
          borderRadius: 'clamp(6px, 1vw, 8px)',
          fontSize: 'clamp(0.9rem, 2vw, 1rem)',
          cursor: 'pointer'
        }}
      >
        ← 뒤로가기
      </button>
    </div>
  )
}

