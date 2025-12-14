'use client'

export default function StaffCallPage() {
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
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    color: '#3e2723',
                    lineHeight: 1.4,
                    wordBreak: 'keep-all'
                }}>
                    직원을 호출했습니다<br />
                    저는 다시 원래 자리로<br />
                    돌아가겠습니다
                </div>

                <div style={{
                    fontSize: '5rem',
                    marginTop: '2rem'
                }}>
                    🙇
                </div>
            </div>
        </div>
    )
}
