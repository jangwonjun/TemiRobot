'use client'

interface MainPageProps {
  onTableSelect: (tableNumber: number) => void
  onMenuRecommend: () => void
}

export default function MainPage({ onTableSelect, onMenuRecommend }: MainPageProps) {
  const tables = [2, 4, 6, 8]

  return (
    <div className="torder-background" style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      position: 'relative',
      boxSizing: 'border-box'
    }}>
      {/* 로고 */}
      <div className="torder-logo" style={{ marginBottom: '1.5rem', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}>
        팡씨네 할머니집
      </div>

      {/* 테이블 선택 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 'clamp(1rem, 2vw, 2rem)',
        width: '100%',
        maxWidth: 'min(90vw, 800px)',
        marginBottom: 'clamp(1.5rem, 3vh, 3rem)',
        padding: '0 1rem'
      }}>
        {tables.map((capacity) => (
          <button
            key={capacity}
            onClick={() => onTableSelect(capacity)}
            className="torder-card"
            style={{
              aspectRatio: '1',
              border: 'none',
              borderRadius: 'clamp(12px, 2vw, 16px)',
              backgroundColor: '#fff',
              fontSize: 'clamp(1.2rem, 3vw, 2rem)',
              fontWeight: 'bold',
              color: '#2c3e50',
              cursor: 'pointer',
              transition: 'all 0.3s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
              minHeight: '80px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05) translateY(-4px)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(231, 76, 60, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1) translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)'
            }}
          >
            <div style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)', marginBottom: '0.5rem', color: '#e74c3c' }}>{capacity}</div>
            <div style={{ fontSize: 'clamp(0.8rem, 1.5vw, 1rem)', color: '#7f8c8d' }}>인석</div>
          </button>
        ))}
      </div>

      {/* 추천 메뉴 버튼 */}
      <button
        onClick={onMenuRecommend}
        className="torder-button"
        style={{
          padding: 'clamp(0.8rem, 2vw, 1rem) clamp(1.5rem, 4vw, 2rem)',
          backgroundColor: '#e74c3c',
          color: 'white',
          border: 'none',
          borderRadius: 'clamp(10px, 1.5vw, 12px)',
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'all 0.3s',
          boxShadow: '0 4px 12px rgba(231, 76, 60, 0.3)',
          minWidth: '200px'
        }}
      >
        추천 메뉴
      </button>
    </div>
  )
}

