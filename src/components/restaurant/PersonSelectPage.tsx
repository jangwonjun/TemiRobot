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
        인원 선택 페이지
      </h1>

      {/* 메인 박스 */}
      <div className="torder-card" style={{
        border: 'none',
        borderRadius: '16px',
        padding: '3rem',
        width: '100%',
        maxWidth: '600px',
        backgroundColor: '#fff',
        position: 'relative',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        {/* 질문 */}
        <div style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '3rem',
          color: '#2c3e50'
        }}>
          어여와~ 몇 명이야?
        </div>

        {/* 인원 선택 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {/* 감소 버튼 */}
          <button
            onClick={handleDecrement}
            disabled={partySize <= 1}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              border: partySize <= 1 ? '3px solid #bdc3c7' : '3px solid #e74c3c',
              backgroundColor: partySize <= 1 ? '#ecf0f1' : '#fff',
              fontSize: '2rem',
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
            fontSize: '4rem',
            fontWeight: 'bold',
            color: '#e74c3c',
            minWidth: '100px',
            textAlign: 'center'
          }}>
            {partySize}
          </div>

          {/* 증가 버튼 */}
          <button
            onClick={handleIncrement}
            disabled={partySize >= 10}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              border: partySize >= 10 ? '3px solid #bdc3c7' : '3px solid #e74c3c',
              backgroundColor: partySize >= 10 ? '#ecf0f1' : '#fff',
              fontSize: '2rem',
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
            padding: '1.5rem',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1.5rem',
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
          marginTop: '2rem',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#757575',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '1rem',
          cursor: 'pointer'
        }}
      >
        ← 뒤로가기
      </button>
    </div>
  )
}

