'use client'

import { useRouter } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
import React, { useState, useEffect } from 'react'

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

    // --- Payment / Sync Logic ---
    const [view, setView] = React.useState<'qr' | 'payment'>('qr')
    const [receivedOrder, setReceivedOrder] = React.useState<any>(null)

    // Poll for orders every 2 seconds
    React.useEffect(() => {
        if (view === 'payment') return // Stop polling if already paying

        const interval = setInterval(async () => {
            try {
                const res = await fetch(`/api/order/sync?tableId=${tableNumber}`)
                const data = await res.json()

                if (data.success && data.order) {
                    console.log('New Order Received:', data.order)
                    setReceivedOrder(data.order)
                    setView('payment')
                }
            } catch (err) {
                // Ignore polling errors
            }
        }, 2000)

        return () => clearInterval(interval)
    }, [tableNumber, view])

    const handlePaymentComplete = async () => {
        // Clear order from server
        await fetch(`/api/order/sync?tableId=${tableNumber}`, { method: 'DELETE' })

        alert('결제가 완료되었습니다! 맛있게 드세요. 😊')
        // Return to Home or Reset
        onHome() // Or just close payment view to show QR again? user flow implies "Enjoy your meal" end.
        // Let's go to Home as requested by "Enjoy your meal" flow usually ending interaction.
    }

    if (view === 'payment' && receivedOrder) {
        return (
            <div className="hanji-background" style={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                fontFamily: 'Gowun Batang, serif'
            }}>
                <h1 style={{ fontFamily: 'Gamja Flower, cursive', fontSize: '3rem', color: '#2e7d32', marginBottom: '2rem' }}>
                    주문 내역 확인 & 결제
                </h1>

                <div className="cream-paper" style={{
                    width: '100%',
                    maxWidth: '600px',
                    padding: '2rem',
                    border: '3px solid #2e7d32',
                    marginBottom: '2rem'
                }}>
                    <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1rem' }}>
                        {receivedOrder.items.map((item: any, idx: number) => (
                            <div key={idx} style={{
                                display: 'flex', justifyContent: 'space-between',
                                borderBottom: '1px dashed #ccc', padding: '1rem 0',
                                fontSize: '1.5rem'
                            }}>
                                <span>{item.name} x 1</span>
                                <span>{item.price.toLocaleString()}₩</span>
                            </div>
                        ))}
                    </div>

                    <div style={{
                        borderTop: '2px solid #2e7d32', paddingTop: '1rem',
                        display: 'flex', justifyContent: 'space-between',
                        fontSize: '2rem', fontWeight: 'bold', color: '#1b5e20'
                    }}>
                        <span>총 결제금액</span>
                        <span>{receivedOrder.totalPrice.toLocaleString()}₩</span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '2rem' }}>
                    {/* "Staff Call" logic is preserved if needed, but here we focus on Payment */}
                    <button
                        onClick={handlePaymentComplete}
                        style={{
                            padding: '1.5rem 4rem',
                            fontSize: '2rem',
                            backgroundColor: '#2e7d32',
                            color: 'white',
                            border: 'none',
                            borderRadius: '16px',
                            fontFamily: 'Gamja Flower, cursive',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                            cursor: 'pointer'
                        }}
                    >
                        카드 결제하기
                    </button>
                    <button
                        onClick={() => setView('qr')} // Cancel / Back to QR
                        style={{
                            padding: '1.5rem 2rem',
                            fontSize: '1.5rem',
                            backgroundColor: '#fff',
                            color: '#555',
                            border: '2px solid #555',
                            borderRadius: '16px',
                            fontFamily: 'Gamja Flower, cursive',
                            cursor: 'pointer'
                        }}
                    >
                        취소
                    </button>
                </div>
            </div>
        )
    }

    // Default QR View
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
