/**
 * WebView에서 Android TemiInterface와 통신하기 위한 인터페이스
 * 
 * Android WebView에서 TemiInterface가 window.temi로 등록되어 있다고 가정합니다.
 */

declare global {
  interface Window {
    temi?: {
      goTo: (location: string) => void
      speak: (content: string) => void
      dance: () => void
    }
  }
}

/**
 * 테이블 번호를 waypoint 이름으로 변환
 */
export function getTableWaypoint(tableNumber: number): string {
  // 테이블 번호를 그대로 사용 (예: "1", "2", "3", "4")
  // 또는 "table-1", "table-2" 형식으로 사용할 수도 있습니다
  return tableNumber.toString()
}

/**
 * 테미 로봇이 WebView 환경에서 사용 가능한지 확인
 */
export function isTemiWebViewAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.temi !== 'undefined'
}

/**
 * 테미 로봇을 특정 위치로 이동
 */
export async function temiGoTo(location: string): Promise<void> {
  if (isTemiWebViewAvailable() && window.temi) {
    try {
      window.temi.goTo(location)
      console.log(`[TemiInterface] goTo called with: ${location}`)
    } catch (error) {
      console.error('[TemiInterface] goTo error:', error)
      throw error
    }
  } else {
    throw new Error('TemiInterface is not available. Make sure you are running in Android WebView with TemiInterface registered.')
  }
}

/**
 * 테미 로봇이 말하기
 */
/**
 * 테미 로봇이 말하기
 */
export async function temiSpeak(content: string): Promise<void> {
  if (isTemiWebViewAvailable() && window.temi) {
    try {
      window.temi.speak(content)
      console.log(`[TemiInterface] speak called with: ${content}`)
    } catch (error) {
      console.error('[TemiInterface] speak error:', error)
      throw error
    }
  } else {
    // 브라우저 환경에서 할머니 목소리 흉내 (Mock Mode)
    console.log(`[TemiInterface Mock] speak: ${content}`)
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // 기존 발화 취소
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(content)
      utterance.lang = 'ko-KR'
      utterance.rate = 0.8 // 속도를 느리게
      utterance.pitch = 0.8 // 톤을 낮게 (할머니 느낌)

      window.speechSynthesis.speak(utterance)
    } else {
      console.warn('TemiInterface is not available and browser does not support speech synthesis.')
    }
  }
}

/**
 * 테미 로봇 춤추기
 */
export async function temiDance(): Promise<void> {
  if (isTemiWebViewAvailable() && window.temi) {
    try {
      window.temi.dance()
      console.log('[TemiInterface] dance called')
    } catch (error) {
      console.error('[TemiInterface] dance error:', error)
      throw error
    }
  } else {
    throw new Error('TemiInterface is not available.')
  }
}

