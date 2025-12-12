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
      interval = 1000,
      onArrived,
      onTimeout,
    } = options

    return new Promise((resolve) => {
      let checkCount = 0
      const maxChecks = Math.floor((timeout * 1000) / interval)

      const checkInterval = setInterval(async () => {
        try {
          checkCount++
          const currentLocation = await this.getCurrentLocation()
          console.log(`[${checkCount}회] 현재 위치: ${currentLocation}, 목적지: ${targetLocation}`)

          // 현재 위치가 목적지와 일치하면 도착 처리
          if (currentLocation === targetLocation) {
            clearInterval(checkInterval)
            console.log('✅ 도착 확인 완료!')
            if (onArrived) {
              onArrived(currentLocation)
            }
            resolve(true)
            return
          }

          // 최대 확인 횟수 초과 시 타임아웃 처리
          if (checkCount >= maxChecks) {
            clearInterval(checkInterval)
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
      }, interval)
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

