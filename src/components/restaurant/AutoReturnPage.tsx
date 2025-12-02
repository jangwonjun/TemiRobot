'use client'

export default function AutoReturnPage() {
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
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#2c3e50'
        }}>
          5초후 자동으로 돌아간데이
        </div>
      </div>

      {/* 하단 텍스트 */}
      <div style={{
        marginTop: '3rem',
        fontSize: '1.5rem',
        color: '#fff',
        fontWeight: 'bold',
        opacity: 0.8
      }}>
        마지막 page.
      </div>
    </div>
  )
}

