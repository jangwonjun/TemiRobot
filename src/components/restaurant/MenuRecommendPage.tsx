'use client'

interface MenuRecommendPageProps {
  onBack: () => void
}

export default function MenuRecommendPage({ onBack }: MenuRecommendPageProps) {
  return (
    <div className="torder-background" style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(1rem, 3vw, 2rem)',
      position: 'relative',
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
        추천 메뉴 page
      </h1>

      {/* 메인 박스 */}
      <div className="torder-card" style={{
        border: 'none',
        borderRadius: 'clamp(12px, 2vw, 16px)',
        padding: 'clamp(2rem, 5vw, 3rem)',
        width: '100%',
        maxWidth: 'min(90vw, 700px)',
        backgroundColor: '#fff',
        position: 'relative',
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        boxSizing: 'border-box'
      }}>
        {/* 오늘의 레전드 메뉴 */}
        <div style={{
          fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
          fontWeight: 'bold',
          color: '#7f8c8d',
          marginBottom: 'clamp(1rem, 2.5vh, 1.5rem)'
        }}>
          오늘의 레전드 메뉴
        </div>

        {/* 메뉴 이름 */}
        <div style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 'bold',
          color: '#2c3e50',
          marginBottom: 'clamp(1rem, 3vh, 2rem)'
        }}>
          해물 순두부
        </div>

        {/* 할인 정보 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(0.5rem, 1.5vw, 1rem)',
          marginTop: 'clamp(1rem, 3vh, 2rem)',
          flexWrap: 'wrap'
        }}>
          <span style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: '#7f8c8d'
          }}>
            지금결제시
          </span>
          <div style={{
            position: 'relative',
            display: 'inline-block'
          }}>
            {/* 폭발 효과 */}
            <div className="torder-pulse" style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'clamp(80px, 15vw, 120px)',
              height: 'clamp(80px, 15vw, 120px)',
              border: '3px solid #e74c3c',
              borderRadius: '50%',
              backgroundColor: '#ffe5e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'clamp(1.2rem, 3vw, 2rem)',
              fontWeight: 'bold',
              color: '#e74c3c'
            }}>
              -1000
            </div>
          </div>
        </div>
      </div>

      {/* 뒤로가기 버튼 */}
      <button
        onClick={onBack}
        className="torder-button-secondary"
        style={{
          marginTop: 'clamp(1.5rem, 4vh, 3rem)',
          padding: 'clamp(0.8rem, 2vw, 1rem) clamp(1.5rem, 4vw, 2rem)',
          backgroundColor: '#ecf0f1',
          color: '#2c3e50',
          border: 'none',
          borderRadius: 'clamp(10px, 1.5vw, 12px)',
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'all 0.3s'
        }}
      >
        ← 메인으로
      </button>
    </div>
  )
}

