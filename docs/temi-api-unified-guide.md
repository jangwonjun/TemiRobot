# 테미 로봇 통합 API 가이드

프론트엔드 전체에서 테미 로봇 기능을 쉽게 사용할 수 있는 통합 API입니다.

## 📦 설치 및 Import

```typescript
// 방법 1: 싱글톤 인스턴스 사용 (권장)
import { temi } from '@/lib/temi-api-unified'

// 방법 2: 클래스 직접 사용
import TemiAPI from '@/lib/temi-api-unified'
const temi = new TemiAPI()
```

## 🚀 기본 사용법

### 1. 좌석으로 이동 (가장 간단한 방법)

```typescript
// 기본 사용: 안내 메시지 + 이동 + 도착 감지
await temi.moveToSeat(1) // 1번 좌석으로 이동

// 커스텀 안내 메시지
await temi.moveToSeat(2, {
  message: "2번 좌석으로 안내합니다."
})

// 도착 감지 없이 이동만
await temi.moveToSeat(3, {
  waitForArrival: false
})
```

### 2. 인원수로 좌석 결정 후 이동

```typescript
// 3명 -> 2번 좌석으로 자동 이동
await temi.moveToSeatByPartySize(3)

// 커스텀 옵션
await temi.moveToSeatByPartySize(5, {
  message: "5명이시군요. 3번 좌석으로 안내합니다.",
  timeout: 60 // 60초 타임아웃
})
```

### 3. 개별 기능 사용

```typescript
// 이동만
await temi.goTo("1") // 1번 좌석으로 이동

// 말하기만
await temi.speak("안녕하세요")

// 춤추기
await temi.dance()

// 현재 위치 확인
const location = await temi.getCurrentLocation()
console.log(`현재 위치: ${location}`)
```

## 📋 API 레퍼런스

### `moveToSeat(seatNumber, options?)`

좌석 번호로 이동 (안내 메시지 + 이동 + 도착 감지)

**Parameters:**
- `seatNumber: number` - 좌석 번호 (1-4)
- `options?: MoveToSeatOptions` - 옵션
  - `message?: string` - 안내 메시지 (기본값: "{seatNumber}번 좌석으로 안내해드리겠습니다.")
  - `waitForArrival?: boolean` - 도착 감지 여부 (기본값: true)
  - `timeout?: number` - 도착 대기 타임아웃 초 (기본값: 30)
  - `onArrived?: (location: string) => void` - 도착 시 콜백
  - `onTimeout?: () => void` - 타임아웃 시 콜백

**Returns:**
- `Promise<boolean | void>` - `waitForArrival`이 true인 경우 도착 여부 반환

**Example:**
```typescript
// 기본 사용
await temi.moveToSeat(1)

// 콜백 사용
await temi.moveToSeat(2, {
  onArrived: (location) => {
    console.log(`도착 완료: ${location}번 좌석`)
    setCurrentPage('move-complete')
  },
  onTimeout: () => {
    console.log('도착 타임아웃')
    setCurrentPage('move-complete')
  }
})
```

### `moveToSeatByPartySize(partySize, options?)`

인원수에 따라 좌석 결정 후 이동

**Parameters:**
- `partySize: number` - 인원수 (1-8)
- `options?: MoveToSeatOptions` - 옵션 (위와 동일)

**Returns:**
- `Promise<boolean | void>` - `waitForArrival`이 true인 경우 도착 여부 반환

**Example:**
```typescript
await temi.moveToSeatByPartySize(3) // 3명 -> 2번 좌석
```

### `goTo(location)`

특정 위치로 이동

**Parameters:**
- `location: string` - waypoint 이름 (1-4)

**Throws:**
- `Error` - 테미 인터페이스가 사용 불가능하거나 잘못된 위치인 경우

**Example:**
```typescript
await temi.goTo("1") // 1번 좌석으로 이동
```

### `speak(content)`

테미 로봇이 말하기

**Parameters:**
- `content: string` - 말할 내용

**Example:**
```typescript
await temi.speak("안녕하세요")
```

### `dance()`

테미 로봇 춤추기

**Throws:**
- `Error` - 테미 인터페이스가 사용 불가능한 경우

**Example:**
```typescript
await temi.dance()
```

### `getCurrentLocation()`

현재 위치 확인

**Returns:**
- `Promise<string>` - 현재 위치 (1-4) 또는 빈 문자열

**Example:**
```typescript
const location = await temi.getCurrentLocation()
if (location) {
  console.log(`현재 위치: ${location}번 좌석`)
}
```

### `waitForArrival(options)`

특정 위치에 도착할 때까지 대기 (폴링 방식)

**Parameters:**
- `options: WaitForArrivalOptions`
  - `targetLocation: string` - 목적지 위치 (1-4)
  - `timeout?: number` - 타임아웃 초 (기본값: 30)
  - `interval?: number` - 확인 간격 밀리초 (기본값: 1000)
  - `onArrived?: (location: string) => void` - 도착 시 콜백
  - `onTimeout?: () => void` - 타임아웃 시 콜백

**Returns:**
- `Promise<boolean>` - 도착 여부 (true: 도착, false: 타임아웃)

**Example:**
```typescript
const arrived = await temi.waitForArrival({
  targetLocation: "1",
  timeout: 30,
  onArrived: (location) => console.log(`도착: ${location}`),
  onTimeout: () => console.log('타임아웃')
})
```

### `getSeatNumberByPartySize(partySize)`

인원수에 따라 좌석 번호 결정

**Parameters:**
- `partySize: number` - 인원수 (1-8)

**Returns:**
- `number` - 좌석 번호 (1-4)

**매핑 규칙:**
- 1~2명 -> 1번 좌석
- 3~4명 -> 2번 좌석
- 5~6명 -> 3번 좌석
- 7~8명 -> 4번 좌석

**Example:**
```typescript
const seatNumber = temi.getSeatNumberByPartySize(3) // 2
```

### `isAvailable()`

테미 로봇이 사용 가능한지 확인

**Returns:**
- `boolean` - 사용 가능 여부

**Example:**
```typescript
if (temi.isAvailable()) {
  await temi.moveToSeat(1)
} else {
  console.log('테미 로봇을 사용할 수 없습니다.')
}
```

## 💡 실제 사용 예시

### React 컴포넌트에서 사용

```typescript
'use client'

import { useState } from 'react'
import { temi } from '@/lib/temi-api-unified'

export default function SeatSelection() {
  const [isMoving, setIsMoving] = useState(false)

  const handleSeatSelect = async (seatNumber: number) => {
    setIsMoving(true)
    
    try {
      await temi.moveToSeat(seatNumber, {
        onArrived: (location) => {
          console.log(`도착 완료: ${location}번 좌석`)
          setIsMoving(false)
          // 다음 페이지로 이동
        },
        onTimeout: () => {
          console.log('도착 타임아웃')
          setIsMoving(false)
          // 타임아웃 처리
        }
      })
    } catch (error) {
      console.error('이동 실패:', error)
      setIsMoving(false)
    }
  }

  return (
    <div>
      <button onClick={() => handleSeatSelect(1)} disabled={isMoving}>
        {isMoving ? '이동 중...' : '1번 좌석'}
      </button>
    </div>
  )
}
```

### 인원수로 자동 좌석 배정

```typescript
import { temi } from '@/lib/temi-api-unified'

const handlePersonConfirm = async (partySize: number) => {
  try {
    // 인원수에 따라 자동으로 좌석 결정 후 이동
    await temi.moveToSeatByPartySize(partySize, {
      message: `${partySize}명이시군요. ${temi.getSeatNumberByPartySize(partySize)}번 좌석으로 안내합니다.`
    })
  } catch (error) {
    console.error('이동 실패:', error)
  }
}
```

### 도착 감지 없이 이동만

```typescript
import { temi } from '@/lib/temi-api-unified'

// 빠른 이동 (도착 감지 없음)
await temi.moveToSeat(1, {
  waitForArrival: false
})
```

## ⚠️ 주의사항

1. **테미 로봇 환경에서만 작동**: 이 API는 Android WebView 환경에서만 작동합니다. 브라우저에서는 Mock 모드로 동작합니다.

2. **좌석 번호 제한**: 좌석 번호는 1-4만 허용됩니다.

3. **도착 감지**: 기본적으로 도착 감지는 폴링 방식으로 1초마다 확인합니다. 타임아웃은 기본 30초입니다.

4. **에러 처리**: 모든 메서드는 Promise를 반환하므로 try-catch로 에러를 처리하세요.

## 🔄 기존 코드 마이그레이션

### Before (기존 방식)

```typescript
import { isTemiWebViewAvailable, temiGoTo, temiSpeak, temiGetCurrentLocation } from '@/lib/temi-webview-interface'

if (isTemiWebViewAvailable()) {
  await temiSpeak("1번 좌석으로 안내해드리겠습니다.")
  await temiGoTo("1")
  
  // 수동으로 도착 감지
  const checkInterval = setInterval(async () => {
    const location = await temiGetCurrentLocation()
    if (location === "1") {
      clearInterval(checkInterval)
      // 도착 처리
    }
  }, 1000)
}
```

### After (통합 API 사용)

```typescript
import { temi } from '@/lib/temi-api-unified'

await temi.moveToSeat(1, {
  onArrived: (location) => {
    // 도착 처리
  }
})
```

훨씬 간단하고 깔끔합니다! 🎉

