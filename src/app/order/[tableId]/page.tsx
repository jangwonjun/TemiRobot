'use client'

import { useState, useEffect } from 'react'
import '@/app/restaurant/globals.css'
import { temi } from '@/lib/temi-api-unified'

// --- Types ---
interface MenuItem {
    id: number
    category: string
    name: string
    price: number
    description: string
    imageColor?: string // kept for fallback
    imagePath?: string // New image path
    hasSpiciness?: boolean
    availableAllergies?: string[]
}

interface CartItem {
    uid: string
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
    // --- MAIN ---
    {
        id: 1,
        category: '메인',
        name: '해물 순두부찌개',
        price: 10000,
        description: '얼큰하고 시원한 국물이 일품인 팡씨네 대표 메뉴',
        imagePath: '/images/menu/sundubu.png',
        hasSpiciness: true,
        availableAllergies: ['새우', '조개', '계란']
    },
    {
        id: 2,
        category: '메인',
        name: '강된장 보리밥',
        price: 9000,
        description: '구수한 강된장과 신선한 야채의 조화',
        imagePath: '/images/menu/boribap.png',
        availableAllergies: ['대두', '참기름']
    },
    {
        id: 10,
        category: '메인',
        name: '육전',
        price: 15000,
        description: '계란옷 입혀 노릇하게 구워낸 소고기 육전',
        imagePath: '/images/menu/yukjeon.png',
        availableAllergies: ['계란', '소고기']
    },
    {
        id: 11,
        category: '메인',
        name: '치즈 감자전',
        price: 13000,
        description: '바삭한 감자채와 고소한 치즈의 만남',
        imagePath: '/images/menu/potato_pancake.png',
        availableAllergies: ['치즈', '감자']
    },
    {
        id: 12,
        category: '메인',
        name: '마약 옥수수전',
        price: 12000,
        description: '달콤 짭짤한 옥수수 알갱이가 톡톡 터지는 전',
        imagePath: '/images/menu/corn_pancake.png',
        availableAllergies: ['옥수수', '우유']
    },
    {
        id: 13,
        category: '메인',
        name: '두부김치',
        price: 16000,
        description: '따뜻한 손두부와 매콤달콤 볶음김치',
        imagePath: '/images/menu/dubu_kimchi.png',
        availableAllergies: ['돼지고기', '두부', '참기름']
    },
    {
        id: 14,
        category: '메인',
        name: '차돌 된장찌개',
        price: 9000,
        description: '차돌박이가 듬뿍 들어간 구수한 시골 된장찌개',
        imagePath: '/images/menu/chadol_doenjang.png',
        hasSpiciness: true,
        availableAllergies: ['대두', '소고기']
    },

    // --- SIDE ---
    {
        id: 25,
        category: '사이드',
        name: '옛날 떡볶이',
        price: 6000,
        description: '매콤달콤한 추억의 학교 앞 떡볶이',
        imagePath: '/images/menu/tteokbokki.png',
        hasSpiciness: true,
        availableAllergies: ['밀가루', '대파']
    },
    {
        id: 4,
        category: '사이드',
        name: '메밀전병',
        price: 7000,
        description: '매콤한 김치소가 꽉 찬 메밀전병',
        imagePath: '/images/menu/memil_jeon.png',
        availableAllergies: ['메밀', '김치', '돼지고기']
    },
    {
        id: 20,
        category: '사이드',
        name: '계란후라이 (3개)',
        price: 3000,
        description: '들기름에 구워 더욱 고소한 반숙 후라이',
        imagePath: '/images/menu/fried_eggs.png',
        availableAllergies: ['계란']
    },
    {
        id: 21,
        category: '사이드',
        name: '스팸구이',
        price: 5000,
        description: '밥도둑 스팸을 노릇노릇하게 구워냈어요',
        imagePath: '/images/menu/spam.png',
        availableAllergies: ['돼지고기']
    },
    {
        id: 22,
        category: '사이드',
        name: '도토리묵 무침',
        price: 8000,
        description: '새콤달콤한 양념과 아삭한 오이의 조화',
        imagePath: '/images/menu/acorn_jelly.png',
        availableAllergies: ['참기름', '견과류']
    },

    // --- DRINKS ---
    {
        id: 5,
        category: '음료',
        name: '콜라',
        price: 2000,
        description: '코카콜라 355ml',
        imagePath: '/images/menu/coke.png',
        imageColor: '#000000'
    },
    {
        id: 30,
        category: '음료',
        name: '제로 콜라',
        price: 2000,
        description: '부담 없는 코카콜라 제로 355ml',
        imagePath: '/images/menu/zero_coke.png',
        imageColor: '#212121'
    },
    {
        id: 31,
        category: '음료',
        name: '사이다',
        price: 2000,
        description: '칠성사이다 355ml',
        imagePath: '/images/menu/cider.png',
        imageColor: '#4caf50'
    },
    {
        id: 32,
        category: '음료',
        name: '환타 파인',
        price: 2000,
        description: '환타 파인애플맛 355ml',
        imagePath: '/images/menu/fanta.png',
        imageColor: '#ff9800'
    },

    // --- ALCOHOL ---
    {
        id: 6,
        category: '주류',
        name: '소주',
        price: 5000,
        description: '참이슬 / 처음처럼 / 진로 (택1 가능)',
        imagePath: '/images/menu/soju.png',
        imageColor: '#81c784'
    },
    {
        id: 40,
        category: '주류',
        name: '생막걸리',
        price: 4000,
        description: '장수 생막걸리',
        imagePath: '/images/menu/makgeolli.png',
        imageColor: '#f0f4c3'
    },
    {
        id: 41,
        category: '주류',
        name: '병맥주',
        price: 5000,
        description: '테라 / 카스 (택1 가능)',
        imagePath: '/images/menu/beer.png',
        imageColor: '#ffb74d'
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
