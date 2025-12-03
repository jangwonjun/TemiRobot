'use client'

export default function AutoReturnPage() {
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
        복귀 중
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
          fontSize: '3rem',
          fontWeight: 'bold',
          color: '#1a1a1a',
          marginBottom: '1rem'
        }}>
          5초 후 복귀
        </div>
      </div>

      {/* 하단 텍스트 */}
      <div style={{
        marginTop: '3rem',
        fontSize: '1.5rem',
        color: '#5d4037',
        fontWeight: 'bold',
        opacity: 0.8
      }}>
        원위치로 복귀 중...
      </div>
    </div>
  )
}

