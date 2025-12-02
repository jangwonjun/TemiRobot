'use client'

interface MovingGuidePageProps {
  tableNumber: number
}

export default function MovingGuidePage({ tableNumber }: MovingGuidePageProps) {
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
        자리 이동 안내 페이지
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
          {tableNumber} 번 자리로
        </div>
        <div className="torder-pulse" style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          color: '#e74c3c'
        }}>
          이동 중
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  )
}

