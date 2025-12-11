'use client'

import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'

interface QRPageProps {
    tableNumber: number
    onHome: () => void
}

export default function QRPage({ tableNumber, onHome }: QRPageProps) {
    const [qrData, setQrData] = useState<string>('')

    useEffect(() => {
        // Fetch QR data from server
        const fetchQR = async () => {
            try {
                const res = await fetch(`/api/qr?table=${tableNumber}`)
                const data = await res.json()
                setQrData(data.url)
            } catch (error) {
                console.error('Failed to fetch QR data:', error)
            }
        }
        fetchQR()
    }, [tableNumber])

    const handleStaffCall = () => {
        alert('직원을 호출했습니다. 잠시만 기다려주세요.')
    }

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
                fontSize: '2.5rem',
                fontWeight: 'bold',
                marginBottom: '2rem',
                color: '#1a1a1a', // Greenish from sketch? Keeping standard theme for now, utilizing globals
                fontFamily: 'Gamja Flower, cursive'
            }}>
                메뉴 선택
            </div>

            {/* 메인 박스 (QR 영역) */}
            <div className="cream-paper" style={{
                padding: '3rem',
                width: '100%',
                maxWidth: '500px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2rem',
                border: '5px solid #2e7d32' // Green border from sketch
            }}>
                {qrData ? (
                    <div style={{ padding: '20px', background: 'white', borderRadius: '10px' }}>
                        <QRCodeSVG value={qrData} size={250} />
                    </div>
                ) : (
                    <div style={{ width: '250px', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        Loading QR...
                    </div>
                )}

                <div style={{ marginTop: '1rem', fontSize: '1.2rem', color: '#555' }}>
                    QR코드를 스캔하여 주문해주세요
                </div>
            </div>

            <div style={{
                display: 'flex',
                gap: '1rem',
                width: '100%',
                maxWidth: '500px'
            }}>
                {/* 홈으로 버튼 (추가됨) */}
                <button
                    onClick={onHome}
                    className="dark-frame-button"
                    style={{
                        flex: 1,
                        padding: '1.5rem',
                        fontSize: '1.5rem',
                        backgroundColor: '#fff',
                        color: '#3e2723',
                        fontFamily: 'Gowun Batang, serif',
                        fontWeight: 'bold'
                    }}
                >
                    처음으로
                </button>

                {/* 직원 호출 버튼 */}
                <button
                    onClick={handleStaffCall}
                    style={{
                        flex: 2,
                        padding: '1.5rem',
                        fontSize: '1.5rem',
                        backgroundColor: '#d32f2f', // Red from sketch
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                        cursor: 'pointer',
                        fontFamily: 'Gowun Batang, serif',
                        fontWeight: 'bold'
                    }}
                >
                    직원 호출
                </button>
            </div>
        </div>
    )
}
