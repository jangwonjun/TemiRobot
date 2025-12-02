'use client'

interface MovingGuidePageProps {
  tableNumber: number
}

export default function MovingGuidePage({ tableNumber }: MovingGuidePageProps) {
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
        자리 이동 안내
      </div>

      {/* 메인 박스 */}
      <div className="cream-paper" style={{
        padding: '4rem',
        width: '100%',
        maxWidth: '600px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#1a1a1a',
          marginBottom: '2rem'
        }}>
          {tableNumber} 번 자리로
        </div>
        <div className="torder-pulse" style={{
          fontSize: '3.5rem',
          fontWeight: 'bold',
          color: '#d32f2f'
        }}>
          이동 중...
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
        .torder-pulse {
          animation: pulse 1.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  )
}

