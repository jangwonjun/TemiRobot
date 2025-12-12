'use client'

import { useState } from 'react'
import '@/app/restaurant/globals.css'

// --- Types ---
interface MenuItem {
    id: number
    category: string
    name: string
    price: number
    description: string
    imageColor: string
    hasSpiciness?: boolean
    availableAllergies?: string[] // e.g., ['새우', '갑각류', '계란', '메밀']
}

interface CartItem {
    uid: string // unique id for list rendering
    menuId: number
    name: string
    price: number
    options: {
        spiciness?: number
        allergies?: string[]
    }
}

// --- Mock Data ---
const CATEGORIES = ['메인', '사이드', '음료', '주류']

const MENU_ITEMS: MenuItem[] = [
    {
        id: 1,
        category: '메인',
        name: '해물 순두부찌개',
        price: 10000,
        description: '얼큰하고 시원한 국물이 일품인 팡씨네 대표 메뉴',
        imageColor: '#e57373',
        hasSpiciness: true,
        availableAllergies: ['새우', '조개', '계란']
    },
    {
        id: 2,
        category: '메인',
        name: '강된장 보리밥',
        price: 9000,
        description: '구수한 강된장과 신선한 야채의 조화',
        imageColor: '#a1887f',
        availableAllergies: ['대두', '참기름']
    },
    {
        id: 3,
        category: '사이드',
        name: '육전',
        price: 15000,
        description: '계란옷 입혀 노릇하게 구워낸 소고기 육전',
        imageColor: '#ffd54f',
        availableAllergies: ['계란', '소고기']
    },
    {
        id: 4,
        category: '사이드',
        name: '메밀전병',
        price: 7000,
        description: '매콤한 김치소가 꽉 찬 메밀전병',
        imageColor: '#ffb74d',
        availableAllergies: ['메밀', '김치', '돼지고기']
    },
    {
        id: 5,
        category: '음료',
        name: '콜라',
        price: 2000,
        description: '코카콜라 355ml',
        imageColor: '#000000'
    },
    {
        id: 6,
        category: '주류',
        name: '소주',
        price: 5000,
        description: '참이슬 / 처음처럼',
        imageColor: '#81c784'
    }
]

export default function OrderPage({ params }: { params: { tableId: string } }) {
    // View State: 'menu' | 'confirmation' | 'success'
    const [view, setView] = useState<'menu' | 'confirmation' | 'success'>('menu')

    const [activeTab, setActiveTab] = useState('메인')
    const [cart, setCart] = useState<CartItem[]>([])

    // Modal State
    const [isOptionModalOpen, setIsOptionModalOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)

    // Option State
    const [spiciness, setSpiciness] = useState<number>(1)
    const [checkedAllergies, setCheckedAllergies] = useState<string[]>([])

    // Cart Modal State
    const [isCartModalOpen, setIsCartModalOpen] = useState(false)

    // Filter menu
    const filteredItems = MENU_ITEMS.filter(item => item.category === activeTab)

    // Calculate Total
    const totalPrice = cart.reduce((acc, item) => acc + item.price, 0)

    // Handlers
    const handleItemClick = (item: MenuItem) => {
        setSelectedItem(item)
        // Reset options
        setSpiciness(1)
        setCheckedAllergies([])
        setIsOptionModalOpen(true)
    }

    const handleAddToCart = () => {
        if (!selectedItem) return

        const newItem: CartItem = {
            uid: Math.random().toString(36).substr(2, 9),
            menuId: selectedItem.id,
            name: selectedItem.name,
            price: selectedItem.price,
            options: {
                spiciness: selectedItem.hasSpiciness ? spiciness : undefined,
                allergies: checkedAllergies.length > 0 ? checkedAllergies : undefined
            }
        }

        setCart(prev => [...prev, newItem])
        setIsOptionModalOpen(false)
        setSelectedItem(null)
    }

    const handleAllergyToggle = (allergy: string) => {
        setCheckedAllergies(prev =>
            prev.includes(allergy)
                ? prev.filter(a => a !== allergy)
                : [...prev, allergy]
        )
    }

    // Go to Confirmation View
    const handlePlaceOrder = () => {
        if (cart.length === 0) {
            alert('장바구니가 비어있습니다.')
            return
        }
        setIsCartModalOpen(false)
        setView('confirmation')
    }

    // Finalize Order
    const handleFinalOrder = async () => {
        try {
            // Send order to the robot (Desktop) via API
            await fetch('/api/order/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tableId: params.tableId,
                    items: cart,
                    totalPrice: totalPrice,
                })
            })

            setView('success')
            setCart([])
        } catch (error) {
            console.error('Failed to sync order:', error)
            alert('주문 전송 중 오류가 발생했습니다.')
        }
    }

    // Back to Menu (from Confirmation)
    const handleAddMore = () => {
        setView('menu')
    }

    // Back to Menu (from Success - Reset)
    const handleBackToMenu = () => {
        setView('menu')
    }

    // --- RENDER: CONFIRMATION VIEW ---
    if (view === 'confirmation') {
        return (
            <div className="hanji-background" style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                fontFamily: 'Gowun Batang, serif',
                padding: '2rem'
            }}>
                <h1 style={{ fontFamily: 'Gamja Flower, cursive', fontSize: '2.5rem', textAlign: 'center', color: '#2e7d32', marginBottom: '2rem' }}>
                    주문 확인
                </h1>

                <div className="cream-paper" style={{
                    flex: 1,
                    padding: '2rem',
                    marginBottom: '2rem',
                    overflowY: 'auto',
                    border: '2px dashed #2e7d32'
                }}>
                    <div style={{ fontSize: '1.2rem', marginBottom: '1rem', textAlign: 'center', fontWeight: 'bold' }}>
                        주문 내용을 확인해주세요.
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {cart.map((cartItem) => (
                            <div key={cartItem.uid} style={{
                                borderBottom: '1px solid #ccc',
                                paddingBottom: '0.5rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>{cartItem.name}</div>
                                    {(cartItem.options.spiciness || (cartItem.options.allergies && cartItem.options.allergies.length > 0)) && (
                                        <div style={{ fontSize: '1rem', color: '#666', marginTop: '0.3rem' }}>
                                            {cartItem.options.spiciness && <span style={{ marginRight: '0.5rem' }}>🔥 맵기: {cartItem.options.spiciness}단계</span>}
                                            {cartItem.options.allergies && <span>⚠️ 제외: {cartItem.options.allergies.join(', ')}</span>}
                                        </div>
                                    )}
                                </div>
                                <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>
                                    {cartItem.price.toLocaleString()}₩
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{
                        marginTop: '2rem',
                        paddingTop: '1rem',
                        borderTop: '2px solid #2e7d32',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '1.8rem',
                        fontWeight: 'bold',
                        color: '#1b5e20'
                    }}>
                        <span>총 결제금액</span>
                        <span>{totalPrice.toLocaleString()}₩</span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={handleAddMore}
                        style={{
                            flex: 1,
                            padding: '1.2rem',
                            fontSize: '1.3rem',
                            border: '3px solid #555',
                            backgroundColor: 'white',
                            color: '#333',
                            borderRadius: '12px',
                            fontFamily: 'Gamja Flower, cursive',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        더 담을래요
                    </button>
                    <button
                        onClick={handleFinalOrder}
                        style={{
                            flex: 2,
                            padding: '1.2rem',
                            fontSize: '1.5rem',
                            border: 'none',
                            backgroundColor: '#2e7d32',
                            color: 'white',
                            borderRadius: '12px',
                            fontFamily: 'Gamja Flower, cursive',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
                        }}
                    >
                        주문할게요!
                    </button>
                </div>
            </div>
        )
    }

    // --- RENDER: SUCCESS VIEW ---
    if (view === 'success') {
        return (
            <div className="hanji-background" style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                fontFamily: 'Gamja Flower, cursive',
                color: '#2e7d32'
            }}>
                <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🎉</div>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>주문이 완료되었습니다!</h1>
                <p style={{ fontSize: '1.5rem', color: '#555', fontFamily: 'Gowun Batang, serif', marginBottom: '3rem' }}>
                    맛있는 음식을 곧 준비해드리겠습니다.
                </p>

                <button
                    onClick={handleBackToMenu}
                    style={{
                        padding: '1rem 3rem',
                        fontSize: '1.5rem',
                        border: '3px solid #2e7d32',
                        backgroundColor: 'white',
                        color: '#2e7d32',
                        borderRadius: '50px',
                        fontFamily: 'Gamja Flower, cursive',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    메뉴판으로 돌아가기
                </button>
            </div>
        )
    }

    // --- RENDER: MENU VIEW ---
    return (
        <div className="hanji-background" style={{
            minHeight: '100vh',
            paddingBottom: '100px', // Space for fixed bottom button
            fontFamily: 'Gowun Batang, serif',
            color: '#1a1a1a'
        }}>
            {/* 1. Header (Sticky) */}
            <header style={{
                position: 'sticky',
                top: 0,
                backgroundColor: '#fdfbf7', // hanji-bg
                zIndex: 100,
                borderBottom: '3px solid #2e7d32', // Green border
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <div style={{
                    padding: '1rem',
                    textAlign: 'center',
                    fontSize: '1.8rem',
                    fontWeight: 'bold',
                    color: '#2e7d32', // Green title
                    fontFamily: 'Gamja Flower, cursive'
                }}>
                    팡씨네 할머니
                </div>

                {/* Categories (Tabs) */}
                <div style={{
                    display: 'flex',
                    borderTop: '2px solid #2e7d32' // Green border
                }}>
                    {CATEGORIES.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveTab(category)}
                            style={{
                                flex: 1,
                                padding: '1rem 0.5rem',
                                border: 'none',
                                background: activeTab === category ? '#2e7d32' : 'transparent',
                                color: activeTab === category ? 'white' : '#2e7d32',
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                fontFamily: 'Gamja Flower, cursive',
                                cursor: 'pointer',
                                borderRight: '1px solid #2e7d32'
                            }}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </header>

            {/* 2. Menu List */}
            <main style={{ padding: '1rem' }}>
                {filteredItems.map(item => (
                    <div
                        key={item.id}
                        onClick={() => handleItemClick(item)}
                        style={{
                            display: 'flex',
                            marginBottom: '1rem',
                            border: '2px solid #2e7d32', // Green border for card
                            borderRadius: '8px',
                            overflow: 'hidden',
                            backgroundColor: 'white',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                            cursor: 'pointer',
                            transition: 'transform 0.1s',
                        }}
                    >
                        {/* Image Area */}
                        <div style={{
                            width: '100px',
                            height: '100px',
                            backgroundColor: item.imageColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            flexShrink: 0
                        }}>
                            사진
                        </div>

                        {/* Content Area */}
                        <div style={{
                            padding: '0.8rem',
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{item.name}</span>
                                <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#2e7d32' }}>
                                    {item.price.toLocaleString()}₩
                                </span>
                            </div>
                            <div style={{
                                fontSize: '0.9rem',
                                color: '#555',
                                marginTop: '0.5rem',
                                lineHeight: '1.3'
                            }}>
                                {item.description}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Empty State */}
                {filteredItems.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
                        준비 중인 메뉴입니다.
                    </div>
                )}
            </main>

            {/* 3. Bottom Action (Order History) */}
            <div style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: 90,
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
            }}>
                {/* Price Display (Separate) */}
                {totalPrice > 0 && (
                    <div style={{
                        backgroundColor: '#fff',
                        border: '2px solid #2e7d32',
                        borderRadius: '12px',
                        padding: '1rem 1.5rem',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: '#2e7d32',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                        fontFamily: 'Gamja Flower, cursive',
                    }}>
                        {totalPrice.toLocaleString()}₩
                    </div>
                )}

                <button
                    onClick={() => setIsCartModalOpen(true)}
                    style={{
                        backgroundColor: '#2e7d32', // Green button
                        color: 'white',
                        border: '2px solid #1b5e20',
                        borderRadius: '12px',
                        padding: '1rem 1.5rem',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                        fontFamily: 'Gamja Flower, cursive',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <span>📄</span>
                    주문내역
                </button>
            </div>

            {/* 4. Option Modal */}
            {isOptionModalOpen && selectedItem && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    zIndex: 200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem'
                }}>
                    <div className="hanji-background" style={{
                        width: '100%',
                        maxWidth: '400px',
                        backgroundColor: '#fdfbf7',
                        border: '4px solid #2e7d32',
                        borderRadius: '12px',
                        padding: '2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem'
                    }}>
                        <h2 style={{ fontFamily: 'Gamja Flower, cursive', fontSize: '2rem', textAlign: 'center', color: '#2e7d32', margin: 0 }}>
                            {selectedItem.name}
                        </h2>

                        {/* Spiciness (if applicable) */}
                        {selectedItem.hasSpiciness && (
                            <div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem', textAlign: 'center' }}>
                                    맵기 조절
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                    {[1, 2, 3, 4, 5].map(level => (
                                        <button
                                            key={level}
                                            onClick={() => setSpiciness(level)}
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                border: '2px solid #2e7d32',
                                                backgroundColor: spiciness === level ? '#2e7d32' : 'white',
                                                color: spiciness === level ? 'white' : '#2e7d32',
                                                fontSize: '1.2rem',
                                                fontWeight: 'bold',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Allergies (if available) */}
                        {selectedItem.availableAllergies && selectedItem.availableAllergies.length > 0 && (
                            <div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem', textAlign: 'center' }}>
                                    알러지 체크 (제외할 재료)
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
                                    {selectedItem.availableAllergies.map(allergy => (
                                        <label key={allergy} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px',
                                            fontSize: '1.1rem',
                                            cursor: 'pointer',
                                            padding: '5px 10px',
                                            border: '1px solid #ccc',
                                            borderRadius: '8px',
                                            backgroundColor: checkedAllergies.includes(allergy) ? '#ffebee' : 'white',
                                            borderColor: checkedAllergies.includes(allergy) ? '#d32f2f' : '#ccc'
                                        }}>
                                            <input
                                                type="checkbox"
                                                checked={checkedAllergies.includes(allergy)}
                                                onChange={() => handleAllergyToggle(allergy)}
                                                style={{ width: '20px', height: '20px' }}
                                            />
                                            {allergy}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Buttons */}
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button
                                onClick={() => setIsOptionModalOpen(false)}
                                style={{
                                    flex: 1,
                                    padding: '1rem',
                                    fontSize: '1.2rem',
                                    border: '2px solid #555',
                                    backgroundColor: 'white',
                                    borderRadius: '8px',
                                    fontFamily: 'Gamja Flower, cursive',
                                    fontWeight: 'bold'
                                }}
                            >
                                취소
                            </button>
                            <button
                                onClick={handleAddToCart}
                                style={{
                                    flex: 1,
                                    padding: '1rem',
                                    fontSize: '1.2rem',
                                    border: 'none',
                                    backgroundColor: '#2e7d32',
                                    color: 'white',
                                    borderRadius: '8px',
                                    fontFamily: 'Gamja Flower, cursive',
                                    fontWeight: 'bold'
                                }}
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 5. Cart Modal */}
            {isCartModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    zIndex: 300,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem'
                }}>
                    <div className="hanji-background" style={{
                        width: '100%',
                        maxWidth: '400px',
                        backgroundColor: '#fdfbf7',
                        border: '4px solid #2e7d32',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        maxHeight: '90vh' // Max height for scrolling
                    }}>
                        <div style={{
                            padding: '1.5rem',
                            textAlign: 'center',
                            borderBottom: '2px solid #2e7d32'
                        }}>
                            <h2 style={{ fontFamily: 'Gamja Flower, cursive', fontSize: '2rem', margin: 0, color: '#2e7d32' }}>주문 내역</h2>
                        </div>

                        <div style={{
                            padding: '1.5rem',
                            overflowY: 'auto',
                            flex: 1
                        }}>
                            {cart.length === 0 ? (
                                <div style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>장바구니가 비어있습니다.</div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {cart.map((cartItem, index) => (
                                        <div key={cartItem.uid} style={{
                                            borderBottom: '1px dashed #ccc',
                                            paddingBottom: '0.5rem'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                                <span>{cartItem.name}</span>
                                                <span>{cartItem.price.toLocaleString()}₩</span>
                                            </div>
                                            {(cartItem.options.spiciness || (cartItem.options.allergies && cartItem.options.allergies.length > 0)) && (
                                                <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.3rem' }}>
                                                    {cartItem.options.spiciness && <span style={{ marginRight: '0.5rem' }}>🔥 맵기: {cartItem.options.spiciness}단계</span>}
                                                    {cartItem.options.allergies && <span>⚠️ 제외: {cartItem.options.allergies.join(', ')}</span>}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div style={{
                            padding: '1.5rem',
                            backgroundColor: 'rgba(46, 125, 50, 0.1)',
                            borderTop: '2px solid #2e7d32'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1b5e20' }}>
                                <span>총 금액</span>
                                <span>{totalPrice.toLocaleString()}₩</span>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    onClick={() => setIsCartModalOpen(false)}
                                    style={{
                                        flex: 1,
                                        padding: '1rem',
                                        fontSize: '1.2rem',
                                        border: '2px solid #555',
                                        backgroundColor: 'white',
                                        borderRadius: '8px',
                                        fontFamily: 'Gamja Flower, cursive',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    닫기
                                </button>
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={cart.length === 0}
                                    style={{
                                        flex: 1,
                                        padding: '1rem',
                                        fontSize: '1.2rem',
                                        border: 'none',
                                        backgroundColor: cart.length > 0 ? '#2e7d32' : '#ccc',
                                        color: 'white',
                                        borderRadius: '8px',
                                        fontFamily: 'Gamja Flower, cursive',
                                        fontWeight: 'bold',
                                        cursor: cart.length > 0 ? 'pointer' : 'not-allowed'
                                    }}
                                >
                                    주문
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
