'use client'

export default function ReturningPage() {
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
            {/* 메인 박스 */}
            <div className="cream-paper" style={{
                padding: '5rem 4rem',
                width: '100%',
                maxWidth: '800px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2rem'
            }}>
                <div style={{
                    fontSize: '3.5rem',
                    fontWeight: 'bold',
                    color: '#3e2723',
                    marginBottom: '2rem'
                }}>
                    다시 돌아가는중..
                </div>

                {/* 로딩 애니메이션 효과를 위한 간단한 스피너나 아이콘 */}
                <div className="animate-spin" style={{
                    width: '80px',
                    height: '80px',
                    border: '8px solid #efebe9',
                    borderTop: '8px solid #5d4037',
                    borderRadius: '50%'
                }} />
            </div>
        </div>
    )
}
