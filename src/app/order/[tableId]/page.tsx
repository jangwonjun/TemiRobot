'use client'

import { useState, useEffect } from 'react'
import '@/app/restaurant/globals.css'
import { temi } from '@/lib/temi-api-unified'
import { MENU_ITEMS, CATEGORIES, MenuItem, CartItem } from '@/data/menuData'

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

    const handleRemoveItem = (uid: string) => {
        setCart(prev => prev.filter(item => item.uid !== uid))
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
            await fetch('/api/order/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tableId: params.tableId,
                    items: cart,
                    totalPrice: totalPrice,
                })
            })

            await fetch('/api/order/sync', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tableId: params.tableId,
                })
            })

            setView('success')
            setCart([])
        } catch (error) {
            console.error('Failed to sync order:', error)
            alert('주문 전송 중 오류가 발생했습니다.')
        }
    }

    const handleAddMore = () => {
        setView('menu')
    }

    const handleBackToMenu = () => {
        setView('menu')
    }

    // --- RENDER: CONFIRMATION VIEW ---
    if (view === 'confirmation') {
        return (
            <div className="wood-background" style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '1rem',
                fontFamily: 'Gowun Batang, serif',
            }}>
                <div className="paper-sheet" style={{
                    width: '100%',
                    maxWidth: '600px',
                    padding: '2rem 1.5rem',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    borderRadius: '4px'
                }}>
                    <div className="paper-pin" style={{ top: '10px', left: '10px' }}></div>
                    <div className="paper-pin" style={{ top: '10px', right: '10px' }}></div>
                    <div className="paper-pin" style={{ bottom: '10px', left: '10px' }}></div>
                    <div className="paper-pin" style={{ bottom: '10px', right: '10px' }}></div>

                    <h1 style={{ fontFamily: 'Gamja Flower, cursive', fontSize: '2.5rem', textAlign: 'center', color: '#3e2723', marginBottom: '2rem', marginTop: '1rem' }}>
                        주문 확인
                    </h1>

                    <div style={{
                        flex: 1,
                        marginBottom: '2rem',
                        overflowY: 'auto',
                        border: '2px dashed #8d6e63',
                        padding: '1rem',
                        backgroundColor: '#fffdf5'
                    }}>
                        <div style={{ fontSize: '1.2rem', marginBottom: '1rem', textAlign: 'center', fontWeight: 'bold' }}>
                            주문 내용을 확인해주세요.
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {cart.map((cartItem) => (
                                <div key={cartItem.uid} style={{
                                    borderBottom: '1px solid #d7ccc8',
                                    paddingBottom: '0.5rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div>
                                        <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>{cartItem.name}</div>
                                        {(cartItem.options.spiciness || (cartItem.options.allergies && cartItem.options.allergies.length > 0)) && (
                                            <div style={{ fontSize: '1rem', color: '#6d4c41', marginTop: '0.3rem' }}>
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
                            borderTop: '2px solid #3e2723',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '1.8rem',
                            fontWeight: 'bold',
                            color: '#3e2723'
                        }}>
                            <span>총 결제금액</span>
                            <span>{totalPrice.toLocaleString()}₩</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', zIndex: 10 }}>
                        <button
                            onClick={handleAddMore}
                            className="wood-frame"
                            style={{
                                flex: 1,
                                padding: '1rem',
                                fontSize: '1.3rem',
                                color: '#3e2723',
                                cursor: 'pointer',
                                border: '6px solid #5d4037'
                            }}
                        >
                            더 담기
                        </button>
                        <button
                            onClick={handleFinalOrder}
                            className="wood-sign"
                            style={{
                                flex: 2,
                                padding: '1rem',
                                fontSize: '1.5rem',
                                color: 'white',
                                cursor: 'pointer',
                                border: 'none'
                            }}
                        >
                            주문하기
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // --- RENDER: SUCCESS VIEW ---
    if (view === 'success') {
        return (
            <div className="wood-background" style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '1rem',
                fontFamily: 'Gamja Flower, cursive',
            }}>
                <div className="paper-sheet" style={{
                    padding: '3rem',
                    borderRadius: '4px',
                    textAlign: 'center',
                    maxWidth: '500px',
                    width: '100%'
                }}>
                    <div className="paper-pin" style={{ top: '10px', left: '10px' }}></div>
                    <div className="paper-pin" style={{ top: '10px', right: '10px' }}></div>
                    <div className="paper-pin" style={{ bottom: '10px', left: '10px' }}></div>
                    <div className="paper-pin" style={{ bottom: '10px', right: '10px' }}></div>

                    <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🎉</div>
                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#3e2723' }}>주문이 완료되었습니다!</h1>
                    <p style={{ fontSize: '1.5rem', color: '#5d4037', fontFamily: 'Gowun Batang, serif', marginBottom: '3rem' }}>
                        맛있는 음식을 곧 준비해드리겠습니다.
                    </p>

                    <button
                        onClick={handleBackToMenu}
                        className="wood-sign"
                        style={{
                            padding: '1rem 3rem',
                            fontSize: '1.5rem',
                            margin: '0 auto',
                            cursor: 'pointer'
                        }}
                    >
                        메뉴판으로 돌아가기
                    </button>
                </div>
            </div>
        )
    }

    // --- RENDER: MENU VIEW ---
    return (
        <div className="wood-background" style={{
            minHeight: '100vh',
            padding: '1rem',
            fontFamily: 'Gowun Batang, serif',
            color: '#1a1a1a',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <div className="wood-sign swing-hover" style={{
                marginBottom: '1rem',
                padding: '1rem 2rem',
                fontSize: '2rem',
                width: '100%',
                maxWidth: '600px',
                zIndex: 20
            }}>
                팡씨네 할머니
            </div>

            <div className="paper-sheet" style={{
                width: '100%',
                maxWidth: '600px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                padding: '2rem 1.5rem',
                position: 'relative',
                marginBottom: '4rem'
            }}>
                <div className="paper-pin" style={{ top: '12px', left: '12px' }}></div>
                <div className="paper-pin" style={{ top: '12px', right: '12px' }}></div>
                <div className="paper-pin" style={{ bottom: '12px', left: '12px' }}></div>
                <div className="paper-pin" style={{ bottom: '12px', right: '12px' }}></div>

                <div style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    backgroundColor: '#fffde7',
                    borderBottom: '2px dashed #8d6e63',
                    paddingBottom: '1rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    gap: '0.5rem'
                }}>
                    {CATEGORIES.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveTab(category)}
                            style={{
                                flex: 1,
                                padding: '0.6rem 0',
                                background: activeTab === category ? '#5d4037' : 'transparent',
                                color: activeTab === category ? '#fff' : '#5d4037',
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                fontFamily: 'Gamja Flower, cursive',
                                cursor: 'pointer',
                                borderRadius: '8px',
                                transition: 'all 0.2s',
                                border: activeTab === category ? 'none' : '1px solid #a1887f'
                            }}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <main style={{ flex: 1 }}>
                    {filteredItems.map(item => (
                        <div
                            key={item.id}
                            onClick={() => handleItemClick(item)}
                            style={{
                                display: 'flex',
                                marginBottom: '1rem',
                                borderBottom: '1px solid #d7ccc8',
                                paddingBottom: '1rem',
                                cursor: 'pointer'
                            }}
                        >
                            <div style={{
                                width: '100px',
                                height: '100px',
                                backgroundColor: '#fff',
                                padding: '4px',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                transform: `rotate(${Math.random() * 4 - 2}deg)`,
                                flexShrink: 0,
                                marginRight: '1rem'
                            }}>
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: item.imageColor || '#eee',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden'
                                }}>
                                    {item.imagePath ? (
                                        <img
                                            src={item.imagePath}
                                            alt={item.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <span style={{ fontSize: '0.8rem' }}>사진</span>
                                    )}
                                </div>
                            </div>

                            <div style={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                paddingTop: '0.2rem'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', fontFamily: 'Gamja Flower, cursive', color: '#3e2723' }}>{item.name}</span>
                                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#d84315' }}>
                                        {item.price.toLocaleString()}
                                    </span>
                                </div>
                                <div style={{
                                    fontSize: '0.95rem',
                                    color: '#5d4037',
                                    marginTop: '0.3rem',
                                    lineHeight: '1.3'
                                }}>
                                    {item.description}
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredItems.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#8d6e63' }}>
                            준비 중인 메뉴입니다.
                        </div>
                    )}
                </main>
            </div>

            <div style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: 90,
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
            }}>
                {totalPrice > 0 && (
                    <div className="wood-sign" style={{
                        padding: '0.8rem 1.2rem',
                        fontSize: '1.2rem',
                        borderRadius: '30px'
                    }}>
                        {totalPrice.toLocaleString()}₩
                    </div>
                )}

                <button
                    onClick={() => setIsCartModalOpen(true)}
                    className="recommend-btn"
                    style={{
                        padding: '0.8rem 1.5rem',
                        fontSize: '1.1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        borderRadius: '30px'
                    }}
                >
                    <span>📄</span>
                    주문내역
                </button>
            </div>

            {isOptionModalOpen && selectedItem && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    zIndex: 200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem',
                    backdropFilter: 'blur(3px)'
                }}>
                    <div className="paper-sheet" style={{
                        width: '100%',
                        maxWidth: '400px',
                        padding: '2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem',
                        position: 'relative',
                        borderRadius: '2px'
                    }}>
                        <div className="paper-pin" style={{ top: '10px', left: '10px' }}></div>
                        <div className="paper-pin" style={{ top: '10px', right: '10px' }}></div>

                        <h2 style={{ fontFamily: 'Gamja Flower, cursive', fontSize: '2rem', textAlign: 'center', color: '#3e2723', margin: '0.5rem 0' }}>
                            {selectedItem.name}
                        </h2>

                        {selectedItem.hasSpiciness && (
                            <div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem', textAlign: 'center', color: '#5d4037' }}>
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
                                                border: '2px solid #5d4037',
                                                backgroundColor: spiciness === level ? '#5d4037' : 'transparent',
                                                color: spiciness === level ? 'white' : '#5d4037',
                                                fontSize: '1.2rem',
                                                fontWeight: 'bold',
                                                cursor: 'pointer',
                                                fontFamily: 'Gamja Flower, cursive'
                                            }}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectedItem.availableAllergies && selectedItem.availableAllergies.length > 0 && (
                            <div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem', textAlign: 'center', color: '#5d4037' }}>
                                    알러지 체크 (제외할 재료)
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
                                    {selectedItem.availableAllergies.map(allergy => (
                                        <label key={allergy} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px',
                                            fontSize: '1rem',
                                            cursor: 'pointer',
                                            padding: '5px 10px',
                                            border: '1px solid #8d6e63',
                                            borderRadius: '8px',
                                            backgroundColor: checkedAllergies.includes(allergy) ? '#ffebee' : 'transparent',
                                            borderColor: checkedAllergies.includes(allergy) ? '#d32f2f' : '#8d6e63',
                                            color: '#3e2723'
                                        }}>
                                            <input
                                                type="checkbox"
                                                checked={checkedAllergies.includes(allergy)}
                                                onChange={() => handleAllergyToggle(allergy)}
                                                style={{ width: '18px', height: '18px' }}
                                            />
                                            {allergy}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button
                                onClick={() => setIsOptionModalOpen(false)}
                                className="wood-frame"
                                style={{
                                    flex: 1,
                                    padding: '0.8rem',
                                    fontSize: '1.2rem',
                                    color: '#3e2723',
                                    border: '4px solid #5d4037',
                                    cursor: 'pointer'
                                }}
                            >
                                취소
                            </button>
                            <button
                                onClick={handleAddToCart}
                                className="wood-sign"
                                style={{
                                    flex: 1,
                                    padding: '0.8rem',
                                    fontSize: '1.2rem',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                담기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isCartModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 150,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
                }}>
                    <div className="paper-sheet" style={{
                        width: '100%', maxWidth: '400px', padding: '2rem',
                        display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative'
                    }}>
                        <div className="paper-pin" style={{ top: '10px', left: '10px' }}></div>
                        <div className="paper-pin" style={{ top: '10px', right: '10px' }}></div>

                        <h2 style={{ textAlign: 'center', fontFamily: 'Gamja Flower, cursive', fontSize: '1.8rem', color: '#3e2723' }}>현재 장바구니</h2>
                        {cart.length === 0 ? (
                            <div style={{ textAlign: 'center', color: '#aaa', padding: '1rem' }}>비어있음</div>
                        ) : (
                            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                {cart.map(item => (
                                    <div key={item.uid} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', borderBottom: '1px dashed #ccc' }}>
                                        <span>{item.name}</span>
                                        <span>{item.price.toLocaleString()}</span>
                                        <button onClick={() => handleRemoveItem(item.uid)} style={{ color: 'red', border: 'none', background: 'none', marginLeft: '1rem', cursor: 'pointer' }}>x</button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button onClick={() => setIsCartModalOpen(false)} className="wood-frame" style={{ flex: 1, padding: '0.8rem', cursor: 'pointer', border: '4px solid #5d4037' }}>닫기</button>
                            <button onClick={handlePlaceOrder} className="wood-sign" style={{ flex: 1, padding: '0.8rem', border: 'none', cursor: 'pointer' }}>주문하기</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
