# 팡씨네 할머니집 Android 앱

테미 로봇을 활용한 식당 자리 안내 시스템 Android 앱입니다.

## 📁 프로젝트 구조

```
android/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/pangssi/restaurant/
│   │   │   │   ├── MainActivity.java      # 메인 액티비티 (WebView 설정)
│   │   │   │   └── TemiInterface.java     # JavaScript 인터페이스
│   │   │   ├── res/
│   │   │   │   ├── layout/
│   │   │   │   │   └── activity_main.xml  # 레이아웃
│   │   │   │   └── values/
│   │   │   │       └── strings.xml        # 문자열 리소스
│   │   │   └── AndroidManifest.xml        # 매니페스트
│   │   └── build.gradle                   # 앱 빌드 설정
├── build.gradle                            # 프로젝트 빌드 설정
└── settings.gradle                         # 프로젝트 설정
```

## 🔧 설정 방법

### 1. Android Studio에서 프로젝트 열기

1. Android Studio 실행
2. **File** → **Open** → `android/` 폴더 선택
3. 프로젝트 동기화 대기

### 2. Temi SDK 추가

`app/build.gradle`에 Temi SDK를 추가해야 합니다:

```gradle
dependencies {
    // Temi SDK 추가
    // 방법 1: JAR 파일 사용
    implementation files('libs/temi-sdk.jar')
    
    // 방법 2: Maven 저장소 사용 (가능한 경우)
    // implementation 'com.robotemi:sdk:1.0.0'
}
```

Temi SDK JAR 파일을 `app/libs/` 폴더에 복사하세요.

### 3. URL 설정

`MainActivity.java`에서 웹앱 URL을 설정하세요:

```java
String url;
if (BuildConfig.DEBUG) {
    // 개발 모드
    url = "http://10.0.2.2:3000/restaurant";  // 에뮬레이터
    // url = "http://192.168.1.100:3000/restaurant";  // 실제 기기 (컴퓨터 IP)
} else {
    // 프로덕션
    url = "https://your-domain.com/restaurant";
}
```

### 4. 빌드 및 실행

1. **Build** → **Make Project**
2. 테미 로봇에 연결된 기기 선택
3. **Run** → **Run 'app'**

## 📱 주요 기능

### TemiInterface.java

WebView에서 JavaScript로 테미 로봇을 제어할 수 있는 인터페이스입니다.

#### 사용 가능한 메서드

1. **goTo(String location)**
   - 테이블 번호를 waypoint로 이동
   - 예: `window.temi.goTo("1")` → 테이블 1로 이동

2. **speak(String content)**
   - 음성으로 말하기
   - 예: `window.temi.speak("2번 테이블로 안내해드리겠습니다.")`

3. **dance()**
   - 춤 동작 실행
   - 예: `window.temi.dance()`

4. **stop()**
   - 로봇 정지
   - 예: `window.temi.stop()`

5. **getCurrentLocation()**
   - 현재 위치 반환
   - 예: `var loc = window.temi.getCurrentLocation()`

## 🗺️ 테이블 Waypoint 설정

테미 로봇에서 각 테이블 위치를 waypoint로 저장해야 합니다:

1. 테미 로봇에서 맵핑 완료
2. 각 테이블 위치로 이동
3. Waypoint 저장:
   - 테이블 1 → waypoint 이름: `"1"`
   - 테이블 2 → waypoint 이름: `"2"`
   - 테이블 3 → waypoint 이름: `"3"`
   - 테이블 4 → waypoint 이름: `"4"`

## 🧪 테스트

### 1. 로그 확인

```bash
adb logcat | grep TemiInterface
```

### 2. 테스트 시나리오

1. 앱 실행
2. 테이블 선택 (예: 2인석)
3. 인원 수 입력 후 확인
4. 로그에서 확인:
   ```
   D/TemiInterface: goTo called with: 2
   D/TemiInterface: speak called with: 2번 테이블로 안내해드리겠습니다.
   ```

## 📋 주의사항

1. **Temi SDK**: Temi SDK가 프로젝트에 포함되어 있어야 합니다
2. **권한**: 인터넷 권한이 AndroidManifest.xml에 설정되어 있습니다
3. **방화벽**: 개발 시 컴퓨터와 테미 로봇이 같은 Wi-Fi에 있어야 합니다
4. **화면 방향**: 가로 모드로 고정되어 있습니다 (`android:screenOrientation="landscape"`)

## 🔗 React 웹앱 연동

React 웹앱은 자동으로 `window.temi`를 감지하여 사용합니다:

- **WebView 환경**: `window.temi.goTo("2")` 직접 호출
- **브라우저 환경**: 기존 HTTP API 사용 (자동 전환)

## 📚 참고 자료

- [테미 SDK 문서](https://www.robotemi.com)
- [Android WebView 가이드](https://developer.android.com/reference/android/webkit/WebView)

---

**이제 테이블 선택 시 테미 로봇이 자동으로 해당 테이블로 이동합니다!** 🎉
