'use client'

import { useRouter } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
import React, { useState, useEffect } from 'react'
import { temi } from '@/lib/temi-api-unified'
import FinalCheckBubble from '@/components/restaurant/FinalCheckBubble'
import { MENU_ITEMS } from '@/data/menuData'

interface QRPageProps {
    tableNumber: number
    onHome: () => void
    onCallStaff: () => void
}

export default function QRPage({ tableNumber, onHome, onCallStaff }: QRPageProps) {
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
        onCallStaff()
    }

    // --- Payment / Sync Logic ---
    const [view, setView] = React.useState<'qr' | 'payment' | 'returning'>('qr')
    const [receivedOrder, setReceivedOrder] = React.useState<any>(null)
    
    // Pangcae Final Check™ State
    const [showFinalCheck, setShowFinalCheck] = React.useState(false)

    // Poll for orders
    React.useEffect(() => {
        if (view !== 'qr') return // Only poll in QR view

        const interval = setInterval(async () => {
            try {
                const res = await fetch(`/api/order/sync?tableId=${tableNumber}`)
                const data = await res.json()

                if (data.success && data.order) {
                    console.log('New Order Received:', data.order)
                    setReceivedOrder(data.order)
                    setView('payment')
                }
            } catch (err) { }
        }, 2000)
        return () => clearInterval(interval)
    }, [tableNumber, view])

    // 결제 완료 폴링 제거 - Temi에서 버튼 클릭해야 넘어가도록 변경

    // Auto-return timer 및 도크 복귀
    React.useEffect(() => {
        if (view === 'returning') {
            // 도크로 복귀
            const returnToDock = async () => {
                try {
                    if (temi.isAvailable()) {
                        // 2초 후 도크로 이동 (검은 화면 메시지 없이 이동만)
                        setTimeout(async () => {
                            await temi.goHome({
                                waitForArrival: false // 도착 감지 없이 이동만
                            })
                        }, 2000)
                    }
                } catch (error) {
                    console.error('도크 복귀 실패:', error)
                }
            }

            returnToDock()

            // 5초 후 홈으로 복귀
            const timer = setTimeout(() => {
                onHome()
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [view, onHome])

    // Pangcae Final Check™: 알러지 및 매운 정도 체크 함수
    const checkAllergyAndSpicy = () => {
        if (!receivedOrder || !receivedOrder.items) {
            return { allergyItems: [], spicyCount: 0, hasAllergy: false, hasSpicy: false }
        }

        const allergyItems: string[] = []
        let spicyCount = 0

        receivedOrder.items.forEach((cartItem: any) => {
            const menuItem = MENU_ITEMS.find(item => item.id === cartItem.menuId)
            if (menuItem) {
                // 알러지 체크: 메뉴에 알러지 성분이 있고, 사용자가 제외하지 않은 경우
                if (menuItem.availableAllergies && menuItem.availableAllergies.length > 0) {
                    menuItem.availableAllergies.forEach(allergy => {
                        // 사용자가 이 알러지를 제외하지 않았다면 포함된 것으로 간주
                        if (!cartItem.options?.allergies || !cartItem.options.allergies.includes(allergy)) {
                            if (!allergyItems.includes(allergy)) {
                                allergyItems.push(allergy)
                            }
                        }
                    })
                }
                // 매운 정도 체크: spiciness >= 2인 경우
                if (cartItem.options?.spiciness && cartItem.options.spiciness >= 2) {
                    spicyCount++
                }
            }
        })

        return { allergyItems, spicyCount, hasAllergy: allergyItems.length > 0, hasSpicy: spicyCount > 0 }
    }

    // 실제 결제 완료 함수 (분리)
    const completePayment = async () => {
        try {
            await fetch(`/api/order/sync?tableId=${tableNumber}`, { method: 'DELETE' })
            // 결제 확인 완료 후 도크로 복귀 화면으로 이동
            setView('returning')
            setShowFinalCheck(false)
        } catch (error) {
            console.error('결제 확인 처리 실패:', error)
        }
    }

    const handlePaymentComplete = async () => {
        // Pangcae Final Check™ 로직
        const { hasAllergy, hasSpicy } = checkAllergyAndSpicy()

        // 체크 필요 시 말풍선 표시, 아니면 바로 결제 완료
        if (hasAllergy || hasSpicy) {
            setShowFinalCheck(true)
        } else {
            await completePayment()
        }
    }

    // 말풍선 확인 핸들러
    const handleFinalCheckConfirm = () => {
        setShowFinalCheck(false)
        completePayment()
    }

    // 말풍선 수정 핸들러 (결제 화면에서는 취소로 처리)
    const handleFinalCheckEdit = () => {
        setShowFinalCheck(false)
        setView('qr') // QR 화면으로 돌아가기
    }

    if (view === 'returning') {
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
                    주문이 완료되었습니다!
                </h1>
                <div style={{ fontSize: '1.5rem', color: '#555', marginBottom: '3rem', textAlign: 'center' }}>
                    맛있게 드세요. <br />
                    저는 다시 원래 자리로 돌아가겠습니다. 🤖
                </div>
                <div style={{ fontSize: '1.2rem', color: '#888' }}>
                    5초 후 자동으로 복귀합니다...
                </div>
            </div>
        )
    }

    if (view === 'payment' && receivedOrder) {
        // 알러지 및 매운 정도 계산 (말풍선용)
        const { allergyItems, spicyCount, hasAllergy, hasSpicy } = checkAllergyAndSpicy()

        return (
            <div className="hanji-background" style={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                fontFamily: 'Gowun Batang, serif',
                position: 'relative'
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
                                <div>
                                    <span>{item.name} x 1</span>
                                    {(item.options?.spiciness || (item.options?.allergies && item.options.allergies.length > 0)) && (
                                        <div style={{ fontSize: '1rem', color: '#6d4c41', marginTop: '0.3rem' }}>
                                            {item.options.spiciness && <span style={{ marginRight: '0.5rem' }}>🔥 맵기: {item.options.spiciness}단계</span>}
                                            {item.options.allergies && <span>⚠️ 제외: {item.options.allergies.join(', ')}</span>}
                                        </div>
                                    )}
                                </div>
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

                {/* Pangcae Final Check™ 말풍선 */}
                {showFinalCheck && (
                    <FinalCheckBubble
                        hasAllergy={hasAllergy}
                        hasSpicy={hasSpicy}
                        allergyItems={allergyItems}
                        spicyCount={spicyCount}
                        onConfirm={handleFinalCheckConfirm}
                        onEdit={handleFinalCheckEdit}
                    />
                )}
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
