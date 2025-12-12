/**
 * 테미 로봇 통합 API
 * 
 * 프론트엔드 전체에서 테미 로봇 기능을 쉽게 사용할 수 있도록 통합된 API를 제공합니다.
 * 
 * 사용 예시:
 * ```typescript
 * import { TemiAPI } from '@/lib/temi-api-unified'
 * 
 * const temi = new TemiAPI()
 * 
 * // 좌석으로 이동 (말하기 + 이동 + 도착 감지)
 * await temi.moveToSeat(1, "1번 좌석으로 안내해드리겠습니다.")
 * 
 * // 단순 이동
 * await temi.goTo("1")
 * 
 * // 말하기
 * await temi.speak("안녕하세요")
 * ```
 */

import {
  isTemiWebViewAvailable,
  temiGoTo,
  temiSpeak,
  temiDance,
  temiGetCurrentLocation,
} from './temi-webview-interface'

export interface MoveToSeatOptions {
  /** 안내 메시지 (기본값: "{seatNumber}번 좌석으로 안내해드리겠습니다.") */
  message?: string
  /** 도착 감지 여부 (기본값: true) */
  waitForArrival?: boolean
  /** 도착 대기 타임아웃 (초, 기본값: 30) */
  timeout?: number
  /** 도착 시 콜백 */
  onArrived?: (location: string) => void
  /** 타임아웃 시 콜백 */
  onTimeout?: () => void
}

export interface WaitForArrivalOptions {
  /** 목적지 위치 (1-4) */
  targetLocation: string
  /** 타임아웃 (초, 기본값: 30) */
  timeout?: number
  /** 확인 간격 (밀리초, 기본값: 1000) */
  interval?: number
  /** 도착 시 콜백 */
  onArrived?: (location: string) => void
  /** 타임아웃 시 콜백 */
  onTimeout?: () => void
}

export class TemiAPI {
  /**
   * 테미 로봇이 사용 가능한지 확인
   */
  isAvailable(): boolean {
    return isTemiWebViewAvailable()
  }

  /**
   * 테미 로봇을 특정 위치로 이동
   * 
   * @param location waypoint 이름 (1-4)
   * @throws Error 테미 인터페이스가 사용 불가능한 경우
   * 
   * @example
   * await temi.goTo("1") // 1번 좌석으로 이동
   */
  async goTo(location: string): Promise<void> {
    if (!this.isAvailable()) {
      throw new Error('TemiInterface is not available. Make sure you are running in Android WebView.')
    }

    // 1-4번 좌석만 허용
    if (!['1', '2', '3', '4'].includes(location)) {
      throw new Error(`Invalid location: ${location}. Only 1-4 are allowed.`)
    }

    await temiGoTo(location)
  }

  /**
   * 테미 로봇이 말하기
   * 
   * @param content 말할 내용
   * 
   * @example
   * await temi.speak("안녕하세요")
   */
  async speak(content: string): Promise<void> {
    await temiSpeak(content)
  }

  /**
   * 테미 로봇 춤추기
   * 
   * @throws Error 테미 인터페이스가 사용 불가능한 경우
   * 
   * @example
   * await temi.dance()
   */
  async dance(): Promise<void> {
    if (!this.isAvailable()) {
      throw new Error('TemiInterface is not available.')
    }
    await temiDance()
  }

  /**
   * 테미 로봇의 현재 위치 확인
   * 
   * @returns 현재 위치 (1-4) 또는 빈 문자열
   * 
   * @example
   * const location = await temi.getCurrentLocation()
   * console.log(`현재 위치: ${location}`)
   */
  async getCurrentLocation(): Promise<string> {
    return await temiGetCurrentLocation()
  }

  /**
   * 특정 위치에 도착할 때까지 대기 (폴링 방식)
   * 
   * @param options 대기 옵션
   * @returns 도착 여부 (true: 도착, false: 타임아웃)
   * 
   * @example
   * const arrived = await temi.waitForArrival({
   *   targetLocation: "1",
   *   timeout: 30,
   *   onArrived: (location) => console.log(`도착: ${location}`),
   *   onTimeout: () => console.log('타임아웃')
   * })
   */
  async waitForArrival(options: WaitForArrivalOptions): Promise<boolean> {
    const {
      targetLocation,
      timeout = 30,
      interval = 300, // 1000ms -> 300ms로 변경 (더 빠른 확인)
      onArrived,
      onTimeout,
    } = options

    return new Promise((resolve) => {
      let checkCount = 0
      const maxChecks = Math.floor((timeout * 1000) / interval)
      let checkInterval: NodeJS.Timeout | null = null
      let eventHandler: ((location: string) => void) | null = null
      let isResolved = false

      // 이벤트 기반 도착 감지 (Java에서 window.onTemiArrived 호출)
      // Java의 OnGoToLocationStatusChangedListener가 SDK 이벤트를 받아서 즉시 호출
      if (typeof window !== 'undefined') {
        eventHandler = (location: string) => {
          if (!isResolved && location === targetLocation) {
            isResolved = true
            if (checkInterval) {
              clearInterval(checkInterval)
            }
            // 이벤트 핸들러 제거
            if (typeof window !== 'undefined') {
              delete (window as any).onTemiArrived
            }
            console.log('✅ 도착 확인 완료! (이벤트 기반 - 실시간)')
            if (onArrived) {
              onArrived(location)
            }
            resolve(true)
          }
        }

        // 전역 이벤트 핸들러 등록 (Java에서 호출할 수 있도록)
        // Java의 notifyArrived()가 이 함수를 호출함
        (window as any).onTemiArrived = eventHandler
      }

      // 위치 확인 함수 (중복 코드 제거)
      const checkLocation = async () => {
        if (isResolved) {
          if (checkInterval) {
            clearInterval(checkInterval)
          }
          return
        }

        try {
          checkCount++
          const currentLocation = await this.getCurrentLocation()
          console.log(`[${checkCount}회] 현재 위치: ${currentLocation}, 목적지: ${targetLocation}`)

          // 현재 위치가 목적지와 일치하면 도착 처리
          if (currentLocation === targetLocation) {
            isResolved = true
            if (checkInterval) {
              clearInterval(checkInterval)
            }
            // 이벤트 핸들러 제거
            if (typeof window !== 'undefined' && eventHandler) {
              delete (window as any).onTemiArrived
            }
            console.log('✅ 도착 확인 완료! (폴링)')
            if (onArrived) {
              onArrived(currentLocation)
            }
            resolve(true)
            return
          }

          // 최대 확인 횟수 초과 시 타임아웃 처리
          if (checkCount >= maxChecks) {
            isResolved = true
            if (checkInterval) {
              clearInterval(checkInterval)
            }
            // 이벤트 핸들러 제거
            if (typeof window !== 'undefined' && eventHandler) {
              delete (window as any).onTemiArrived
            }
            console.log('⏱️ 도착 타임아웃')
            if (onTimeout) {
              onTimeout()
            }
            resolve(false)
          }
        } catch (error) {
          console.error('위치 확인 실패:', error)
          // 에러가 발생해도 계속 확인 시도
        }
      }

      // 즉시 첫 번째 체크 실행 (딜레이 없음)
      setTimeout(checkLocation, 0)

      // 이후 주기적으로 체크 (폴백 - 이벤트가 오지 않을 경우 대비)
      checkInterval = setInterval(checkLocation, interval)
    })
  }

  /**
   * 좌석 번호로 이동 (안내 메시지 + 이동 + 도착 감지)
   * 
   * @param seatNumber 좌석 번호 (1-4)
   * @param options 옵션
   * @returns 도착 여부 (waitForArrival이 true인 경우)
   * 
   * @example
   * // 기본 사용 (안내 메시지 + 이동 + 도착 감지)
   * await temi.moveToSeat(1)
   * 
   * // 커스텀 메시지
   * await temi.moveToSeat(2, {
   *   message: "2번 좌석으로 안내합니다."
   * })
   * 
   * // 도착 감지 없이 이동만
   * await temi.moveToSeat(3, {
   *   waitForArrival: false
   * })
   * 
   * // 콜백 사용
   * await temi.moveToSeat(4, {
   *   onArrived: (location) => console.log(`도착: ${location}`),
   *   onTimeout: () => console.log('타임아웃')
   * })
   */
  async moveToSeat(
    seatNumber: number,
    options?: MoveToSeatOptions | string
  ): Promise<boolean | void> {
    // 옵션이 문자열인 경우 (하위 호환성)
    const opts: MoveToSeatOptions =
      typeof options === 'string'
        ? { message: options }
        : options || {}

    const {
      message,
      waitForArrival = true,
      timeout = 30,
      onArrived,
      onTimeout,
    } = opts

    // 좌석 번호 검증
    if (seatNumber < 1 || seatNumber > 4) {
      throw new Error(`Invalid seat number: ${seatNumber}. Only 1-4 are allowed.`)
    }

    const location = seatNumber.toString()
    const guideMessage =
      message || `${seatNumber}번 좌석으로 안내해드리겠습니다.`

    try {
      // 1. 안내 메시지
      await this.speak(guideMessage)

      // 2. 이동
      await this.goTo(location)

      console.log(`좌석 ${seatNumber}번(waypoint: ${location})으로 이동 시작`)

      // 3. 도착 감지 (옵션)
      if (waitForArrival) {
        return await this.waitForArrival({
          targetLocation: location,
          timeout,
          onArrived,
          onTimeout,
        })
      }
    } catch (error) {
      console.error('로봇 이동 실패:', error)
      throw error
    }
  }

  /**
   * 인원수에 따라 좌석 번호 결정 후 이동
   * 
   * @param partySize 인원수 (1-8)
   * @param options 옵션
   * @returns 도착 여부 (waitForArrival이 true인 경우)
   * 
   * @example
   * // 3명 -> 2번 좌석으로 이동
   * await temi.moveToSeatByPartySize(3)
   */
  async moveToSeatByPartySize(
    partySize: number,
    options?: MoveToSeatOptions
  ): Promise<boolean | void> {
    // 인원수에 따라 좌석 번호 결정
    const seatNumber = this.getSeatNumberByPartySize(partySize)
    return await this.moveToSeat(seatNumber, options)
  }

  /**
   * 인원수에 따라 좌석 번호 결정
   * 
   * @param partySize 인원수 (1-8)
   * @returns 좌석 번호 (1-4)
   * 
   * 매핑 규칙:
   * - 1~2명 -> 1번 좌석
   * - 3~4명 -> 2번 좌석
   * - 5~6명 -> 3번 좌석
   * - 7~8명 -> 4번 좌석
   */
  getSeatNumberByPartySize(partySize: number): number {
    if (partySize <= 2) return 1
    if (partySize <= 4) return 2
    if (partySize <= 6) return 3
    return 4
  }

  /**
   * 원위치(홈)로 돌아가기
   * 
   * @param options 옵션
   * @returns 도착 여부 (waitForArrival이 true인 경우)
   * 
   * @example
   * // 기본 사용 (안내 메시지 + 이동 + 도착 감지)
   * await temi.goHome()
   * 
   * // 커스텀 메시지
   * await temi.goHome({
   *   message: "원위치로 돌아갑니다."
   * })
   * 
   * // 도착 감지 없이 이동만
   * await temi.goHome({
   *   waitForArrival: false
   * })
   */
  async goHome(options?: MoveToSeatOptions): Promise<boolean | void> {
    const opts: MoveToSeatOptions = options || {}
    const {
      message,
      waitForArrival = false, // 원위치는 기본적으로 도착 감지 없이 이동만
      timeout = 30,
      onArrived,
      onTimeout,
    } = opts

    // 원위치 waypoint (테미 로봇에서 "home" 또는 "0"으로 설정)
    // 실제 환경에 맞게 조정 필요
    // 참고: 테미 로봇의 원위치 waypoint 이름을 확인하여 수정하세요
    const homeLocation = "home" // 또는 "0" 또는 다른 원위치 waypoint

    const guideMessage = message || "원위치로 돌아가겠습니다."

    try {
      if (!this.isAvailable()) {
        throw new Error('TemiInterface is not available.')
      }

      // 1. 안내 메시지
      await this.speak(guideMessage)

      // 2. 원위치로 이동 (직접 window.temi.goTo 호출 - "1"-"4" 검증 우회)
      if (typeof window !== 'undefined' && window.temi) {
        window.temi.goTo(homeLocation)
        console.log(`원위치(${homeLocation})로 이동 시작`)
      } else {
        throw new Error('TemiInterface is not available.')
      }

      // 3. 도착 감지 (옵션)
      if (waitForArrival) {
        return await this.waitForArrival({
          targetLocation: homeLocation,
          timeout,
          onArrived,
          onTimeout,
        })
      }
    } catch (error) {
      console.error('원위치 이동 실패:', error)
      throw error
    }
  }
}

/**
 * 싱글톤 인스턴스 (선택적 사용)
 * 
 * @example
 * import { temi } from '@/lib/temi-api-unified'
 * await temi.moveToSeat(1)
 */
export const temi = new TemiAPI()

/**
 * 기본 export (클래스 직접 사용)
 * 
 * @example
 * import TemiAPI from '@/lib/temi-api-unified'
 * const temi = new TemiAPI()
 * await temi.moveToSeat(1)
 */
export default TemiAPI

