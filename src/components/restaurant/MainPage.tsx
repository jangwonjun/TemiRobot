'use client'

interface MainPageProps {
  onTableSelect: (tableNumber: number) => void
  onMenuRecommend: () => void
  remainingSeats: number
}

export default function MainPage({ onTableSelect, onMenuRecommend, remainingSeats }: MainPageProps) {
  const tables = [2, 4, 6, 8]

  return (
    <div className="wood-background" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '2rem',
      height: '100vh',
      overflow: 'hidden'
    }}>
      {/* 상단 현판 */}
      <div className="wood-sign swing-hover" style={{
        marginTop: '1rem',
        padding: '0.8rem 3rem',
        fontSize: '1.5rem',
        minWidth: '400px'
      }}>
        할머니의 손맛, 정겨운 식탁
      </div>

      {/* 메인 컨텐츠 영역 (종이 질감) */}
      <div className="paper-sheet" style={{
        width: '100%',
        maxWidth: '900px',
        padding: '4rem 3rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '1rem',
        marginBottom: '2rem',
        flex: 1,
        justifyContent: 'center'
      }}>
        {/* 종이 고정 핀 */}
        <div className="paper-pin" style={{ top: '15px', left: '15px' }}></div>
        <div className="paper-pin" style={{ top: '15px', right: '15px' }}></div>
        <div className="paper-pin" style={{ bottom: '15px', left: '15px' }}></div>
        <div className="paper-pin" style={{ bottom: '15px', right: '15px' }}></div>

        {/* 타이틀 */}
        <h1 style={{
          fontSize: '4rem',
          marginBottom: '3rem',
          textAlign: 'center',
          fontFamily: 'Gamja Flower, cursive',
          color: '#1a1a1a'
        }}>
          팡씨네 할머니집
        </h1>

        {/* 테이블 선택 버튼들 (나무 액자 스타일) */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          width: '100%',
          flexWrap: 'wrap'
        }}>
          {tables.map((capacity) => (
            <button
              key={capacity}
              onClick={() => onTableSelect(capacity)}
              className="wood-frame"
              style={{
                width: '160px',
                height: '160px',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span style={{
                fontSize: '4rem',
                fontWeight: 'bold',
                color: '#1a1a1a',
                fontFamily: 'Gowun Batang, serif'
              }}>
                {capacity}
              </span>
              <span style={{
                fontSize: '1.5rem',
                color: '#1a1a1a',
                marginTop: '-0.5rem',
                fontFamily: 'Gowun Batang, serif'
              }}>
                인석
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 하단 영역 (나무 판자들) */}
      <div style={{
        width: '100%',
        maxWidth: '1100px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: '1rem',
        gap: '1rem',
        position: 'relative'
      }}>
        {/* 좌측 하단 배너 */}
        <div className="wood-sign" style={{
          flex: 2,
          padding: '1.5rem',
          fontSize: '1.8rem',
          justifyContent: 'center'
        }}>
          아들딸래미들 어여와 맛있게 만들어줄텡게
        </div>

        {/* 중앙 추천 메뉴 (항아리/버튼) */}
        <div style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '10px' // 약간 위로
        }}>
          <button
            onClick={onMenuRecommend}
            className="recommend-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '2rem'
            }}
          >
            <img
              src="/images/food_icon.svg"
              alt="Food Icon"
              style={{ width: '50px', height: '50px' }}
            />
            추천 메뉴
          </button>
        </div>

        {/* 우측 여석 안내 */}
        <div className="wood-sign" style={{
          flex: 1,
          padding: '1rem',
          flexDirection: 'column',
          minWidth: '200px'
        }}>
          <div style={{ fontSize: '1.2rem', marginBottom: '0.2rem', color: '#ffccbc' }}>🪑 여석 안내 🪑</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ffab91' }}>
            {remainingSeats === 0 ? '만석입니다.' : `${remainingSeats} 자리 남음`}
          </div>
        </div>
      </div>
    </div>
  )
}
