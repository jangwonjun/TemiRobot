'use client'

interface MenuRecommendPageProps {
  onBack: () => void
}

export default function MenuRecommendPage({ onBack }: MenuRecommendPageProps) {
  return (
    <div className="hanji-background">
      <div className="popup-overlay">
        <div className="popup-content">
          {/* 상단 타이틀 */}
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#1a1a1a',
            marginBottom: '2rem'
          }}>
            오늘의 레전드 메뉴
          </div>

          {/* 메뉴 이름 */}
          <div style={{
            fontSize: '4rem',
            fontWeight: 'bold',
            color: '#1a1a1a',
            marginBottom: '3rem',
            fontFamily: 'Gamja Flower, cursive'
          }}>
            해물 순두부
          </div>

          {/* 할인 스티커 */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            zIndex: 10
          }}>
            <div className="discount-sticker">
              <span style={{ fontSize: '1.8rem' }}>-1000</span>
              <span style={{ fontSize: '0.9rem' }}>(지금 주문시)</span>
            </div>
          </div>

          {/* 하단 버튼 */}
          <div style={{ marginTop: '3rem' }}>
            <button
              onClick={onBack}
              style={{
                padding: '0.8rem 2rem',
                backgroundColor: '#ecf0f1',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1.2rem',
                cursor: 'pointer',
                color: '#2c3e50',
                fontWeight: 'bold'
              }}
            >
              ← 메인으로
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

