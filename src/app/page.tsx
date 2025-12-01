'use client'

import { useState, useEffect } from 'react'
import TemiApiClient, { type TemiRobotStatus, type TemiLocation } from '@/lib/temi-api'
import TemiApiMockClient from '@/lib/temi-api-mock'

export default function Home() {
  const [status, setStatus] = useState<TemiRobotStatus | null>(null)
  const [locations, setLocations] = useState<TemiLocation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [useMock, setUseMock] = useState(false)

  // 모의 모드 사용 여부 확인 (로컬 스토리지 또는 환경 변수)
  useEffect(() => {
    const mockMode = localStorage.getItem('temi_use_mock') === 'true'
    setUseMock(mockMode)
  }, [])

  const temi = useMock ? new TemiApiMockClient() : new TemiApiClient()

  useEffect(() => {
    loadRobotStatus()
    loadLocations()
  }, [])

  const loadRobotStatus = async () => {
    try {
      setLoading(true)
      setError(null)
      const robotStatus = await temi.getRobotStatus()
      setStatus(robotStatus)
    } catch (err) {
      setError(err instanceof Error ? err.message : '로봇 상태를 불러올 수 없습니다.')
      console.error('로봇 상태 로드 실패:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadLocations = async () => {
    try {
      const locs = await temi.getLocations()
      setLocations(locs)
    } catch (err) {
      console.error('위치 목록 로드 실패:', err)
    }
  }

  const handleMoveToLocation = async (locationId: string) => {
    try {
      setLoading(true)
      setError(null)
      await temi.moveToLocation(locationId)
      alert('이동 명령이 전송되었습니다.')
    } catch (err) {
      setError(err instanceof Error ? err.message : '이동 명령을 실행할 수 없습니다.')
      console.error('이동 실패:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleStop = async () => {
    try {
      setLoading(true)
      setError(null)
      await temi.stop()
      alert('정지 명령이 전송되었습니다.')
    } catch (err) {
      setError(err instanceof Error ? err.message : '정지 명령을 실행할 수 없습니다.')
      console.error('정지 실패:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSpeak = async () => {
    const text = prompt('로봇이 말할 내용을 입력하세요:')
    if (!text) return

    try {
      setLoading(true)
      setError(null)
      await temi.speak(text)
      alert('음성 명령이 전송되었습니다.')
    } catch (err) {
      setError(err instanceof Error ? err.message : '음성 명령을 실행할 수 없습니다.')
      console.error('TTS 실패:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>테미 로봇 제어 시스템</h1>

      {error && (
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#fee', 
          color: '#c00', 
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          오류: {error}
        </div>
      )}

      <section style={{ marginBottom: '2rem' }}>
        <h2>로봇 상태</h2>
        <button 
          onClick={loadRobotStatus} 
          disabled={loading}
          style={{ 
            padding: '0.5rem 1rem', 
            marginBottom: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          상태 새로고침
        </button>
        
        {status ? (
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#f5f5f5', 
            borderRadius: '4px' 
          }}>
            <p><strong>이름:</strong> {status.name}</p>
            <p><strong>배터리:</strong> {status.battery}%</p>
            <p><strong>온라인 상태:</strong> {status.isOnline ? '온라인' : '오프라인'}</p>
            <p><strong>네트워크:</strong> {status.networkStatus === 'connected' ? '연결됨' : '연결 안 됨'}</p>
            {status.currentLocation && (
              <p><strong>현재 위치:</strong> {status.currentLocation}</p>
            )}
          </div>
        ) : (
          <p>로봇 상태를 불러오는 중...</p>
        )}
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>로봇 제어</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            onClick={handleStop}
            disabled={loading}
            style={{ 
              padding: '0.75rem 1.5rem', 
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            정지
          </button>
          <button 
            onClick={handleSpeak}
            disabled={loading}
            style={{ 
              padding: '0.75rem 1.5rem', 
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            말하기
          </button>
        </div>
      </section>

      <section>
        <h2>저장된 위치</h2>
        {locations.length > 0 ? (
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
            {locations.map((location) => (
              <div 
                key={location.id}
                style={{ 
                  padding: '1rem', 
                  backgroundColor: '#f5f5f5', 
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              >
                <h3>{location.name}</h3>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>
                  ({location.x}, {location.y})
                </p>
                <button 
                  onClick={() => handleMoveToLocation(location.id)}
                  disabled={loading}
                  style={{ 
                    marginTop: '0.5rem',
                    padding: '0.5rem 1rem', 
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    width: '100%'
                  }}
                >
                  이동
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>저장된 위치가 없습니다.</p>
        )}
      </section>

      <section style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#e7f3ff', borderRadius: '4px' }}>
        <h3>모의 모드 (Mock Mode)</h3>
        <p style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
          로봇이 없어도 UI를 테스트할 수 있습니다. 모의 모드를 켜면 가짜 데이터를 사용합니다.
        </p>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={useMock}
            onChange={(e) => {
              const checked = e.target.checked
              setUseMock(checked)
              localStorage.setItem('temi_use_mock', checked.toString())
              // 상태 새로고침
              loadRobotStatus()
              loadLocations()
            }}
            style={{ cursor: 'pointer' }}
          />
          <span>모의 모드 사용 (로봇 없이 테스트)</span>
        </label>
        {useMock && (
          <p style={{ marginTop: '0.5rem', color: '#0066cc', fontSize: '0.9rem' }}>
            ✅ 모의 모드가 활성화되었습니다. 가짜 데이터를 사용합니다.
          </p>
        )}
      </section>

      <section style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
        <h3>설정 안내</h3>
        <p style={{ marginTop: '0.5rem' }}>
          실제 로봇을 연결하려면 <code>.env.local</code> 파일을 생성하고 다음 변수들을 설정하세요:
        </p>
        <pre style={{ 
          marginTop: '0.5rem', 
          padding: '1rem', 
          backgroundColor: '#f5f5f5', 
          borderRadius: '4px',
          overflow: 'auto'
        }}>
{`TEMI_ROBOT_IP=192.168.1.100
TEMI_ROBOT_PORT=8080
# 또는
TEMI_API_URL=https://api.robotemi.com
TEMI_API_KEY=your_api_key
TEMI_ROBOT_ID=your_robot_id`}
        </pre>
      </section>
    </main>
  )
}

