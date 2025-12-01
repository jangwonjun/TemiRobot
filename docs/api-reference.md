# 테미 로봇 API 참조 문서

이 문서는 테미 로봇과 통신하기 위한 API 사용법을 설명합니다.

## 📌 중요 사항

⚠️ **주의**: 이 문서는 일반적인 API 사용 패턴을 설명하는 예시입니다. 실제 API 엔드포인트, 인증 방식, 요청/응답 형식은 테미 공식 개발자 문서를 반드시 확인하세요.

## 🔗 공식 문서

- [테미 공식 웹사이트](https://www.robotemi.com)
- [테미 개발자 포털](https://developer.robotemi.com) (가능한 경우)
- [테미 GitHub](https://github.com/robotemi) (가능한 경우)

---

## 📡 API 접근 방법

테미 로봇과 통신하는 방법은 크게 두 가지가 있습니다:

### 1. 로컬 네트워크 API

로봇과 같은 Wi-Fi 네트워크에 연결된 경우, 로봇의 로컬 IP 주소를 통해 직접 통신할 수 있습니다.

```
http://[로봇_IP주소]:8080/api/[엔드포인트]
```

**장점**:
- 빠른 응답 속도
- 인터넷 연결 불필요
- 실시간 제어에 적합

**단점**:
- 같은 네트워크에 있어야 함
- IP 주소가 변경될 수 있음

### 2. 클라우드 API

테미의 클라우드 서버를 통해 로봇을 제어합니다.

```
https://api.robotemi.com/v1/[엔드포인트]
```

**장점**:
- 어디서나 접근 가능
- 여러 로봇 관리 용이
- 안정적인 연결

**단점**:
- 인터넷 연결 필수
- API 키 필요
- 약간의 지연 시간

---

## 🔐 인증

### API 키 방식

대부분의 클라우드 API는 API 키를 사용합니다:

```http
Authorization: Bearer YOUR_API_KEY
```

### 로컬 네트워크 인증

로컬 네트워크 API는 인증이 필요 없거나 간단한 토큰을 사용할 수 있습니다.

---

## 📋 주요 API 엔드포인트

### 로봇 상태 조회

로봇의 현재 상태를 조회합니다.

**요청**:
```http
GET /api/status
```

**응답**:
```json
{
  "id": "robot_12345",
  "name": "테미 로봇",
  "battery": 85,
  "isOnline": true,
  "currentLocation": "회의실 A",
  "networkStatus": "connected"
}
```

### 위치로 이동

로봇을 저장된 위치로 이동시킵니다.

**요청**:
```http
POST /api/navigate
Content-Type: application/json

{
  "locationId": "location_001"
}
```

**응답**:
```json
{
  "success": true,
  "message": "이동 시작"
}
```

### 정지

로봇의 이동을 즉시 정지시킵니다.

**요청**:
```http
POST /api/stop
```

**응답**:
```json
{
  "success": true,
  "message": "정지 완료"
}
```

### TTS (Text-to-Speech)

로봇이 텍스트를 음성으로 말합니다.

**요청**:
```http
POST /api/speak
Content-Type: application/json

{
  "text": "안녕하세요, 테미입니다."
}
```

**응답**:
```json
{
  "success": true,
  "message": "음성 재생 시작"
}
```

### 위치 목록 조회

저장된 모든 위치를 조회합니다.

**요청**:
```http
GET /api/locations
```

**응답**:
```json
{
  "locations": [
    {
      "id": "location_001",
      "name": "회의실 A",
      "x": 1.5,
      "y": 2.3,
      "z": 0.0
    },
    {
      "id": "location_002",
      "name": "접수처",
      "x": 3.2,
      "y": 1.8,
      "z": 0.0
    }
  ]
}
```

### 맵 정보 조회

로봇이 생성한 맵 정보를 조회합니다.

**요청**:
```http
GET /api/map
```

**응답**:
```json
{
  "mapId": "map_001",
  "name": "사무실 1층",
  "createdAt": "2025-01-01T00:00:00Z",
  "waypoints": [...],
  "obstacles": [...]
}
```

---

## 💻 사용 예시

### JavaScript/TypeScript

```typescript
import TemiApiClient from '@/lib/temi-api';

// API 클라이언트 생성
const temi = new TemiApiClient({
  robotIp: '192.168.1.100',
  robotPort: 8080,
});

// 로봇 상태 조회
const status = await temi.getRobotStatus();
console.log('배터리:', status.battery);

// 위치로 이동
await temi.moveToLocation('location_001');

// TTS
await temi.speak('안녕하세요, 테미입니다.');
```

### Python

```python
import requests

ROBOT_IP = "192.168.1.100"
ROBOT_PORT = 8080
BASE_URL = f"http://{ROBOT_IP}:{ROBOT_PORT}/api"

# 로봇 상태 조회
response = requests.get(f"{BASE_URL}/status")
status = response.json()
print(f"배터리: {status['battery']}%")

# 위치로 이동
requests.post(f"{BASE_URL}/navigate", json={
    "locationId": "location_001"
})

# TTS
requests.post(f"{BASE_URL}/speak", json={
    "text": "안녕하세요, 테미입니다."
})
```

### cURL

```bash
# 로봇 상태 조회
curl http://192.168.1.100:8080/api/status

# 위치로 이동
curl -X POST http://192.168.1.100:8080/api/navigate \
  -H "Content-Type: application/json" \
  -d '{"locationId": "location_001"}'

# TTS
curl -X POST http://192.168.1.100:8080/api/speak \
  -H "Content-Type: application/json" \
  -d '{"text": "안녕하세요, 테미입니다."}'
```

---

## 🔄 WebSocket 실시간 통신

일부 기능은 WebSocket을 통해 실시간으로 통신할 수 있습니다:

```typescript
const ws = new WebSocket(`ws://${robotIp}:${robotPort}/ws`);

ws.onopen = () => {
  console.log('WebSocket 연결됨');
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('로봇 상태 업데이트:', data);
};

ws.onerror = (error) => {
  console.error('WebSocket 오류:', error);
};
```

---

## ⚠️ 주의사항

1. **에러 처리**: 모든 API 호출에 적절한 에러 처리를 추가하세요.
2. **타임아웃**: 네트워크 문제를 대비해 타임아웃을 설정하세요.
3. **재시도 로직**: 일시적인 네트워크 오류에 대비해 재시도 로직을 구현하세요.
4. **API 키 보안**: API 키는 절대 클라이언트 코드에 노출하지 마세요.
5. **속도 제한**: API 호출 빈도에 주의하세요. 너무 빠른 연속 호출은 피하세요.

---

## 🐛 문제 해결

### 연결 실패

- 로봇과 같은 네트워크에 연결되어 있는지 확인
- 로봇의 IP 주소가 변경되지 않았는지 확인
- 방화벽 설정 확인

### 인증 실패

- API 키가 올바른지 확인
- API 키가 만료되지 않았는지 확인
- 권한이 충분한지 확인

### 응답 없음

- 로봇이 부팅되어 있고 온라인 상태인지 확인
- 네트워크 연결 상태 확인
- 타임아웃 설정 확인

---

## 📚 추가 리소스

- [테미 공식 문서](https://www.robotemi.com)
- [테미 개발자 포럼](https://forum.robotemi.com)
- [GitHub 예제](https://github.com/robotemi) (가능한 경우)

---

**마지막 업데이트**: 2025년 1월

