'use client'

import { useState, useEffect } from 'react'
import { MENU_ITEMS, MenuItem } from '@/data/menuData'
import '@/app/restaurant/globals.css'

interface MenuRecommendPageProps {
  onBack: () => void
}

export default function MenuRecommendPage({ onBack }: MenuRecommendPageProps) {
  const [recommendedItems, setRecommendedItems] = useState<MenuItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    // 1. Get Main items
    const mainItems = MENU_ITEMS.filter(item => item.category === '메인')

    // 2. Shuffle and pick 5
    const shuffled = [...mainItems].sort(() => 0.5 - Math.random())
    setRecommendedItems(shuffled.slice(0, 5))
  }, [])

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? recommendedItems.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex(prev => (prev === recommendedItems.length - 1 ? 0 : prev + 1))
  }

  // Loading state
  if (recommendedItems.length === 0) {
    return <div className="wood-background" />
  }

  const currentItem = recommendedItems[currentIndex]

  return (
    <div className="wood-background" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      padding: '2rem'
    }}>
      <h1 className="wood-sign swing-hover" style={{
        fontSize: '2.5rem',
        marginBottom: '2rem',
        padding: '1rem 3rem',
        color: 'white',
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
      }}>
        오늘의 추천 메뉴 ({currentIndex + 1}/5)
      </h1>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        width: '100%',
        maxWidth: '800px',
        justifyContent: 'center'
      }}>
        {/* Left Button */}
        <button
          onClick={handlePrev}
          className="wood-frame"
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            fontSize: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backgroundColor: '#efebe9',
            border: '4px solid #5d4037',
            color: '#3e2723'
          }}
        >
          ←
        </button>

        {/* Card Content */}
        <div className="paper-sheet" style={{
          flex: 1,
          padding: '2rem',
          borderRadius: '4px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '380px', // Reduced from 500px
          minHeight: '480px' // Reduced from 550px
        }}>
          {/* Pins */}
          <div className="paper-pin" style={{ top: '10px', left: '10px' }}></div>
          <div className="paper-pin" style={{ top: '10px', right: '10px' }}></div>
          <div className="paper-pin" style={{ bottom: '10px', left: '10px' }}></div>
          <div className="paper-pin" style={{ bottom: '10px', right: '10px' }}></div>

          {/* Image Frame */}
          <div style={{
            width: '80%', // Reduced from 100%
            aspectRatio: '1/1',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '4px solid white',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            marginBottom: '1.5rem',
            backgroundColor: currentItem.imageColor || '#eee',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {currentItem.imagePath ? (
              <img
                src={currentItem.imagePath}
                alt={currentItem.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span style={{ fontSize: '2rem' }}>사진 없음</span>
            )}
          </div>

          {/* Title & Price */}
          <h2 style={{
            fontSize: '2rem', // Slightly smaller font
            fontFamily: 'Gamja Flower, cursive',
            color: '#3e2723',
            marginBottom: '0.5rem',
            textAlign: 'center'
          }}>
            {currentItem.name}
          </h2>

          <div style={{
            fontSize: '1.5rem', // Slightly smaller font
            fontWeight: 'bold',
            color: '#d84315',
            marginBottom: '1rem'
          }}>
            {currentItem.price.toLocaleString()}₩
          </div>

          {/* Description */}
          <p style={{
            fontSize: '1.1rem', // Slightly smaller font
            color: '#5d4037',
            fontFamily: 'Gowun Batang, serif',
            textAlign: 'center',
            marginBottom: '1rem',
            lineHeight: '1.4'
          }}>
            {currentItem.description}
          </p>

        </div>

        {/* Right Button */}
        <button
          onClick={handleNext}
          className="wood-frame"
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            fontSize: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backgroundColor: '#efebe9',
            border: '4px solid #5d4037',
            color: '#3e2723'
          }}
        >
          →
        </button>
      </div>

      <button
        onClick={onBack}
        className="wood-sign"
        style={{
          marginTop: '2rem',
          padding: '1rem 3rem',
          fontSize: '1.5rem',
          cursor: 'pointer',
          border: 'none',
          color: 'white'
        }}
      >
        메인으로 돌아가기
      </button>

    </div>
  )
}
