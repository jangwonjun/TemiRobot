'use client'

import { useState } from 'react'
import '@/app/restaurant/globals.css'

// Mock Data
const CATEGORIES = ['메인', '사이드', '음료', '주류']

const MENU_ITEMS = [
    {
        id: 1,
        category: '메인',
        name: '해물 순두부찌개',
        price: 10000,
        description: '얼큰하고 시원한 국물이 일품인 팡씨네 대표 메뉴',
        imageColor: '#e57373' // Placeholder color
    },
    {
        id: 2,
        category: '메인',
        name: '강된장 보리밥',
        price: 9000,
        description: '구수한 강된장과 신선한 야채의 조화',
        imageColor: '#a1887f'
    },
    {
        id: 3,
        category: '사이드',
        name: '육전',
        price: 15000,
        description: '계란옷 입혀 노릇하게 구워낸 소고기 육전',
        imageColor: '#ffd54f'
    },
    {
        id: 4,
        category: '사이드',
        name: '메밀전병',
        price: 7000,
        description: '매콤한 김치소가 꽉 찬 메밀전병',
        imageColor: '#ffb74d'
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
    const [activeTab, setActiveTab] = useState('메인')

    // Filter items based on active tab
    const filteredItems = MENU_ITEMS.filter(item => item.category === activeTab)

    return (
        <div className="hanji-background" style={{
            minHeight: '100vh',
            paddingBottom: '80px', // Space for fixed bottom button
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
                                transition: 'all 0.2s',
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
                    <div key={item.id} style={{
                        display: 'flex',
                        marginBottom: '1rem',
                        border: '2px solid #2e7d32', // Green border for card
                        borderRadius: '8px',
                        overflow: 'hidden',
                        backgroundColor: 'white',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                    }}>
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
                zIndex: 10
            }}>
                <button style={{
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
                }}>
                    <span>📄</span>
                    주문내역
                </button>
            </div>
        </div>
    )
}
