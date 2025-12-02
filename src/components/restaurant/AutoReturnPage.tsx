'use client'

export default function AutoReturnPage() {
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
          fontSize: 'clamp(1.8rem, 4.5vw, 2.5rem)',
          fontWeight: 'bold',
          color: '#2c3e50'
        }}>
          5초후 자동으로 돌아간데이
        </div>
      </div>

      {/* 하단 텍스트 */}
      <div style={{
        marginTop: 'clamp(1.5rem, 4vh, 3rem)',
        fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
        color: '#fff',
        fontWeight: 'bold',
        opacity: 0.8
      }}>
        마지막 page.
      </div>
    </div>
  )
}

