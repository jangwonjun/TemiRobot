'use client'

export default function VersionInfo() {
  const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME
  
  if (!buildTime) return null

  // 빌드 시간을 한국 시간으로 포맷팅
  const formatBuildTime = (isoString: string) => {
    try {
      const date = new Date(isoString)
      return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return isoString
    }
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      fontSize: '0.75rem',
      color: '#999',
      opacity: 0.5,
      fontFamily: 'monospace',
      zIndex: 1000,
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      padding: '4px 8px',
      borderRadius: '4px',
      pointerEvents: 'none'
    }}>
      빌드: {formatBuildTime(buildTime)}
    </div>
  )
}

