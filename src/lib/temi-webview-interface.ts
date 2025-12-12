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
      getCurrentLocation: () => string
    }
  }
}

/**
 * 테이블 번호를 테미 로봇 waypoint로 변환
 * 테미 로봇에는 1, 2, 3, 4로 맵핑된 waypoint가 있음
 * 
 * 매핑 규칙:
 * - 테이블 1,2 → waypoint "1"
 * - 테이블 3,4 → waypoint "2"
 * - 테이블 5,6 → waypoint "3"
 * - 테이블 7,8 → waypoint "4"
 */
export function getTableWaypoint(tableNumber: number): string {
  // 테이블 번호를 1-4로 매핑
  if (tableNumber <= 2) {
    return "1"
  } else if (tableNumber <= 4) {
    return "2"
  } else if (tableNumber <= 6) {
    return "3"
  } else {
    return "4"
  }
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

/**
 * 테미 로봇의 현재 위치를 반환합니다.
 * 
 * @returns 현재 위치의 waypoint 이름 (예: "1", "2", "3", "4")
 * 
 * 사용 예시:
 * - const location = await temiGetCurrentLocation()
 */
export async function temiGetCurrentLocation(): Promise<string> {
  if (isTemiWebViewAvailable() && window.temi) {
    try {
      const location = (window.temi as any).getCurrentLocation()
      console.log(`[TemiInterface] getCurrentLocation: ${location}`)
      return location || ""
    } catch (error) {
      console.error('[TemiInterface] getCurrentLocation error:', error)
      return ""
    }
  } else {
    // 브라우저 환경에서는 빈 문자열 반환
    console.warn('[TemiInterface Mock] getCurrentLocation: not available')
    return ""
  }
}

